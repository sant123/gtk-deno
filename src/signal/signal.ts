import { getPtrFromString } from "utils";
import { lib } from "lib";
import type {
  CallbackFromDef,
  SignalDefinition,
  SignalHandler,
} from "./types.ts";
import { GtkConnectFlags } from "./GtkConnectFlags.ts";

export interface SignalDependencies {
  createCallback<Definition extends Deno.UnsafeCallbackDefinition>(
    definition: Definition,
    callback: Deno.UnsafeCallbackFunction<
      Definition["parameters"],
      Definition["result"]
    >,
  ): Deno.UnsafeCallback<Definition>;
  connect(
    ptr: Deno.PointerValue,
    event: Deno.PointerValue,
    callback: Deno.PointerValue,
    flags: GtkConnectFlags,
  ): bigint;
  disconnect(ptr: Deno.PointerValue, id: bigint): void;
  defer(callback: () => void): void;
}

const nativeDependencies: SignalDependencies = {
  createCallback: (definition, callback) =>
    new Deno.UnsafeCallback(definition, callback),
  connect: (ptr, event, callback, flags) =>
    lib.symbols.g_signal_connect_data(
      ptr,
      event,
      callback,
      null,
      null,
      flags,
    ),
  disconnect: (ptr, id) => lib.symbols.g_signal_handler_disconnect(ptr, id),
  defer: (callback) => void setTimeout(callback, 0),
};

export abstract class Signal<
  D extends Record<string, SignalDefinition>,
> {
  #handlers: SignalHandler[] = [];
  #disposed = false;
  #dependencies: SignalDependencies;

  protected constructor(dependencies: SignalDependencies = nativeDependencies) {
    this.#dependencies = dependencies;
  }

  connect<K extends Extract<keyof D, string>>(
    event: K,
    cb: CallbackFromDef<D[K]>,
    ptr: Deno.PointerValue,
    definition: D[K],
    connectFlags = GtkConnectFlags.G_CONNECT_DEFAULT,
  ): void {
    if (this.#disposed) return;

    const wrappedCallback = (...args: unknown[]): unknown => {
      const result = (cb as (...args: unknown[]) => unknown)(...args);
      const transformResult = definition.transformResult as
        | ((value: unknown) => unknown)
        | undefined;

      return transformResult ? transformResult(result) : result;
    };

    const callback = this.#dependencies.createCallback(
      definition,
      wrappedCallback as Deno.UnsafeCallbackFunction<
        D[K]["parameters"],
        D[K]["result"]
      >,
    );

    const id = this.#dependencies.connect(
      ptr,
      getPtrFromString(event),
      callback.pointer,
      connectFlags,
    );

    // A zero handler ID means GObject did not create a connection.
    if (id === 0n) {
      callback.close();
      return;
    }

    this.#handlers.push({ id, callback, ptr });
  }

  dispose(): void {
    if (this.#disposed) return;

    this.#disposed = true;
    const handlers = this.#handlers;
    this.#handlers = [];

    for (const handler of handlers) {
      this.#dependencies.disconnect(handler.ptr, handler.id);
    }

    // A signal callback can dispose its owner. Defer close until that native
    // invocation has returned, after every handler has been disconnected.
    this.#dependencies.defer(() => {
      for (const handler of handlers) {
        handler.callback.close();
      }
    });
  }
}
