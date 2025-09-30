import { getPtrFromString, GtkSymbol } from "utils";
import { lib } from "lib";
import { Signal } from "signal";

import { type Definitions, ffiDefinitions, type Signals } from "./events.ts";
import type { GtkApplicationFlags } from "./GtkApplicationFlags.ts";

export class GtkApplication extends Signal<typeof ffiDefinitions> {
  #gtkApplicationPtr: Deno.PointerValue = null;
  #isDisposed = false;

  constructor(applicationId: string, flags: GtkApplicationFlags) {
    super();

    /**
     * @pointer GtkApplication
     */
    this.#gtkApplicationPtr = lib.symbols.gtk_application_new(
      getPtrFromString(applicationId),
      flags,
    );

    lib.symbols.g_application_register(this.#gtkApplicationPtr, null, null);
  }

  override connect<S extends Signals>(event: S, cb: Definitions[S]): void {
    if (this.#isDisposed) {
      return;
    }

    super.connect(event, cb, this.#gtkApplicationPtr, ffiDefinitions[event]);
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
  override dispose(): void {
    if (this.#isDisposed) {
      return;
    }

    /**
     * @release GtkApplication
     */
    lib.symbols.g_object_unref(this.#gtkApplicationPtr);
    super.dispose();
    this.#isDisposed = true;
  }

  [Symbol.dispose](): void {
    this.dispose();
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
