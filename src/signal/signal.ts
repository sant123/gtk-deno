import { getPtrFromString } from "utils";
import { lib } from "lib";
import type { CallbackFromDef, Closable } from "./types.ts";
import { GtkConnectFlags } from "./GtkConnectFlags.ts";

export abstract class Signal<
  D extends Record<string, Deno.UnsafeCallbackDefinition>,
> {
  #handlers: Closable[] = [];

  connect<K extends Extract<keyof D, string>>(
    event: K,
    cb: CallbackFromDef<D[K]>,
    ptr: Deno.PointerValue,
    definition: D[K],
  ): void {
    const handler = new Deno.UnsafeCallback(
      definition as Deno.UnsafeCallbackDefinition,
      cb,
    );

    lib.symbols.g_signal_connect_data(
      ptr,
      getPtrFromString(event),
      handler.pointer,
      null,
      null,
      GtkConnectFlags.G_CONNECT_DEFAULT,
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
