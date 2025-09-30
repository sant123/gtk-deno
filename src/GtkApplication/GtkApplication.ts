import { getPtrFromString, GtkSymbol } from "utils";
import { lib } from "lib";
import { type Closable, GtkConnectFlags } from "types";

import type { GtkApplicationFlags } from "./GtkApplicationFlags.ts";

import {
  ffiDefinitions,
  type SignalParams,
  type SignalReturn,
  type Signals,
} from "./events.ts";

export class GtkApplication {
  #handlers: Closable[] = [];
  #gtkApplicationPtr: Deno.PointerValue<unknown> = null;
  #isDisposed = false;

  constructor(applicationId: string, flags: GtkApplicationFlags) {
    /**
     * @pointer GtkApplication
     */
    this.#gtkApplicationPtr = lib.symbols.gtk_application_new(
      getPtrFromString(applicationId),
      flags,
    );

    lib.symbols.g_application_register(this.#gtkApplicationPtr, null, null);
  }

  connect<S extends Signals>(
    event: Signals,
    cb: (...args: SignalParams[S]) => SignalReturn[S],
  ): void {
    if (this.#isDisposed) {
      return;
    }

    const definition = ffiDefinitions[event];
    const handler = new Deno.UnsafeCallback(definition, cb);

    lib.symbols.g_signal_connect_data(
      this.#gtkApplicationPtr,
      getPtrFromString(event),
      handler.pointer,
      null,
      null,
      GtkConnectFlags.G_CONNECT_DEFAULT,
    );

    this.#handlers.push(handler);
  }

  run(): void {
    if (this.#isDisposed) {
      return;
    }

    lib.symbols.g_application_activate(this.#gtkApplicationPtr);
  }

  /**
   * Release all attached pointers. The `using` keyword call this method automatically.
   */
  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    if (this.#isDisposed) {
      return;
    }

    /**
     * @release GtkApplication
     */
    lib.symbols.g_object_unref(this.#gtkApplicationPtr);

    for (const handler of this.#handlers) {
      handler.close();
    }

    this.#isDisposed = true;
  }

  [GtkSymbol] = {
    isDisposed: (): boolean => {
      return this.#isDisposed;
    },
    getGtkApplicationPtr: () => {
      return this.#gtkApplicationPtr;
    },
  };
}
