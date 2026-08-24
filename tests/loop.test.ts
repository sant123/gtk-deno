import { assert, assertEquals } from "@std/assert";

import {
  IDLE_POLL_INTERVAL,
  type LoopScheduler,
  PollingEventLoop,
} from "../src/PollingEventLoop.ts";

class FakeScheduler implements LoopScheduler {
  readonly delays: number[] = [];
  #callbacks = new Map<number, () => void>();
  #nextTimer = 1;

  setTimeout(
    callback: () => void,
    delay: number,
  ): ReturnType<typeof setTimeout> {
    const timer = this.#nextTimer++;
    this.delays.push(delay);
    this.#callbacks.set(timer, callback);
    return timer as unknown as ReturnType<typeof setTimeout>;
  }

  clearTimeout(timer: ReturnType<typeof setTimeout>): void {
    this.#callbacks.delete(timer as unknown as number);
  }

  runNext(): void {
    const next = this.#callbacks.entries().next().value as
      | [number, () => void]
      | undefined;
    assert(next, "expected a scheduled loop tick");
    this.#callbacks.delete(next[0]);
    next[1]();
  }

  get pendingCount(): number {
    return this.#callbacks.size;
  }
}

function createLoop(iterations: boolean[] = []) {
  const scheduler = new FakeScheduler();
  const loop = new PollingEventLoop({
    iteration: () => iterations.shift() ?? false,
  }, scheduler);
  return { loop, scheduler };
}

Deno.test("loop starts once for the first distinct reference", () => {
  const { loop, scheduler } = createLoop();
  loop.ref(1n);
  loop.ref(1n);
  loop.ref(2n);

  assert(loop.isRunning);
  assert(loop.isScheduled);
  assertEquals(loop.referenceCount, 2);
  assertEquals(scheduler.delays, [0]);
});

Deno.test("partial release leaves the loop running", () => {
  const { loop, scheduler } = createLoop();
  loop.ref(1n);
  loop.ref(2n);
  loop.unref(1n);
  loop.unref(99n);

  assert(loop.isRunning);
  assertEquals(loop.referenceCount, 1);
  assertEquals(scheduler.pendingCount, 1);
});

Deno.test("final release cancels future polling and a new reference restarts it", () => {
  const { loop, scheduler } = createLoop();
  loop.ref(1n);
  loop.unref(1n);

  assert(!loop.isRunning);
  assert(!loop.isScheduled);
  assertEquals(scheduler.pendingCount, 0);

  loop.ref(2n);
  assert(loop.isRunning);
  assertEquals(scheduler.delays, [0, 0]);
});

Deno.test("active GLib work is fully drained then yields with a timer task", () => {
  const { loop, scheduler } = createLoop([true, true, false]);
  loop.ref(1n);
  scheduler.runNext();

  assertEquals(scheduler.delays, [0, 0]);
  assert(loop.isScheduled);
});

Deno.test("an idle GLib context waits instead of busy-spinning", () => {
  const { loop, scheduler } = createLoop([false]);
  loop.ref(1n);
  scheduler.runNext();

  assertEquals(scheduler.delays, [0, IDLE_POLL_INTERVAL]);
  assertEquals(scheduler.pendingCount, 1);
});

Deno.test("active GLib polling leaves Deno promises and timers runnable", async () => {
  let calls = 0;
  const loop = new PollingEventLoop({
    // Every tick handles one source, then finishes draining it.
    iteration: () => ++calls % 2 === 1,
  });
  loop.ref(1n);

  let promiseRan = false;
  Promise.resolve().then(() => promiseRan = true);

  await new Promise<void>((resolve) => setTimeout(resolve, 0));
  loop.unref(1n);

  assert(promiseRan);
  assert(calls > 0);
  assert(!loop.isScheduled);
});
