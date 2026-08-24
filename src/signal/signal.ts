import { getPtrFromString } from "utils";
import { lib } from "lib";
import type {
  AbiCallbackFromDef,
  CallbackFromDef,
  Closable,
  SignalDefinition,
} from "./types.ts";
import { GtkConnectFlags } from "./GtkConnectFlags.ts";

export abstract class Signal<
  D extends Record<string, SignalDefinition>,
> {
  #handlers: Closable[] = [];

  connect<K extends Extract<keyof D, string>>(
    event: K,
    cb: CallbackFromDef<D[K]>,
    ptr: Deno.PointerValue,
    definition: D[K],
    connectFlags = GtkConnectFlags.G_CONNECT_DEFAULT,
  ): void {
    const wrappedCallback = (...args: unknown[]): unknown => {
      const result = (cb as (...args: unknown[]) => unknown)(...args);
      const transformResult = definition.transformResult as
        | ((value: unknown) => unknown)
        | undefined;

      return transformResult ? transformResult(result) : result;
    };

    const handler = new Deno.UnsafeCallback(
      definition as Deno.UnsafeCallbackDefinition,
      wrappedCallback as AbiCallbackFromDef<D[K]>,
    );

    lib.symbols.g_signal_connect_data(
      ptr,
      getPtrFromString(event),
      handler.pointer,
      null,
      null,
      connectFlags,
    );

    this.#handlers.push(handler);
  }

  dispose() {
    setTimeout(() => {
      this.#handlers.forEach((handler) => handler.close());
      this.#handlers = [];
    });
  }
}
