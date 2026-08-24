import { assertEquals } from "@std/assert";

import { Signal, type SignalDependencies } from "signal";
import type { SignalDefinition } from "../src/signal/types.ts";

const definition = {
  parameters: [],
  result: "void",
} as const satisfies SignalDefinition;

type Definitions = { changed: typeof definition };

class FakeCallback {
  readonly pointer: Deno.PointerValue = null;
  closeCount = 0;

  close(): void {
    this.closeCount++;
  }
}

class FakeSignal extends Signal<Definitions> {
  constructor(dependencies: SignalDependencies) {
    super(dependencies);
  }

  add(callback: () => void): void {
    this.connect("changed", callback, null, definition);
  }
}

function createSignal(ids: bigint[]) {
  const callbacks: FakeCallback[] = [];
  const disconnected: bigint[] = [];
  const events: string[] = [];
  const deferred: (() => void)[] = [];
  const dependencies: SignalDependencies = {
    createCallback: <Definition extends Deno.UnsafeCallbackDefinition>() => {
      const callback = new FakeCallback();
      callbacks.push(callback);
      return callback as unknown as Deno.UnsafeCallback<Definition>;
    },
    connect: () => ids.shift() ?? 0n,
    disconnect: (_ptr, id) => {
      disconnected.push(id);
      events.push(`disconnect:${id}`);
    },
    defer: (callback) => deferred.push(callback),
  };

  return {
    signal: new FakeSignal(dependencies),
    callbacks,
    disconnected,
    events,
    flush: () => deferred.splice(0).forEach((callback) => callback()),
  };
}

Deno.test("signal retains the native handler ID returned for each callback", () => {
  const test = createSignal([11n, 12n]);
  test.signal.add(() => {});
  test.signal.add(() => {});
  test.signal.dispose();

  assertEquals(test.disconnected, [11n, 12n]);
  assertEquals(test.callbacks.map((callback) => callback.closeCount), [0, 0]);
});

Deno.test("signal disconnects every handler before deferred callback close", () => {
  const test = createSignal([1n]);
  test.signal.add(() => {});

  // Observe the ordering through a callback close wrapper without changing the
  // mock's deferred scheduling behavior.
  const created = test.callbacks[0];
  const close = created.close.bind(created);
  created.close = () => {
    test.events.push("close");
    close();
  };
  test.signal.dispose();
  assertEquals(test.events, ["disconnect:1"]);

  test.flush();
  assertEquals(test.events, ["disconnect:1", "close"]);
});

Deno.test("signal disposal is idempotent for multiple handlers", () => {
  const test = createSignal([3n, 4n]);
  test.signal.add(() => {});
  test.signal.add(() => {});

  test.signal.dispose();
  test.signal.dispose();
  assertEquals(test.disconnected, [3n, 4n]);
  assertEquals(test.callbacks.map((callback) => callback.closeCount), [0, 0]);

  test.flush();
  test.flush();
  assertEquals(test.callbacks.map((callback) => callback.closeCount), [1, 1]);
});

Deno.test("an unsuccessful native connection is not retained", () => {
  const test = createSignal([0n]);
  test.signal.add(() => {});
  test.signal.dispose();

  assertEquals(test.disconnected, []);
  assertEquals(test.callbacks.map((callback) => callback.closeCount), [1]);
});
