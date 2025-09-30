import { getPtrFromString, GtkSymbol } from "utils";
import { GtkConnectFlags } from "types";
import { lib } from "lib";
import { ref, unref } from "loop";

import { GTK_APPLICATION_DISPOSED } from "./GtkApplicationWindowErrors.ts";
import type { GtkApplication } from "../GtkApplication/GtkApplication.ts";

interface GtkApplicationWindowOptions {
  title: string | null;
}

/**
 * A `GtkWindow` subclass that integrates with `GtkApplication`.
 */
export class GtkApplicationWindow {
  #app: GtkApplication;
  #gtkApplicationWindowPtr: Deno.PointerValue<unknown> = null;
  #hasClosed = false;
  #isDisposed = false;

  #unsafeCloseRequestCallBack: Deno.UnsafeCallback<{
    readonly parameters: readonly ["pointer", "pointer", "pointer"];
    readonly result: "void";
  }> = new Deno.UnsafeCallback({
    parameters: ["pointer", "pointer", "pointer"],
    result: "void",
  }, this.#handleCloseRequestCallback.bind(this));

  #options: GtkApplicationWindowOptions = {
    title: null,
  };

  constructor(app: GtkApplication) {
    if (app[GtkSymbol].isDisposed()) {
      console.trace(GTK_APPLICATION_DISPOSED);
      throw new Error(GTK_APPLICATION_DISPOSED);
    }

    this.#app = app;

    this.#gtkApplicationWindowPtr = lib.symbols.gtk_application_window_new(
      this.#app[GtkSymbol].getGtkApplicationPtr(),
    );

    lib.symbols.g_signal_connect_data(
      this.#gtkApplicationWindowPtr,
      getPtrFromString("close-request"),
      this.#unsafeCloseRequestCallBack.pointer,
      null,
      null,
      GtkConnectFlags.G_CONNECT_AFTER,
    );

    ref(this.#gtkApplicationWindowPtr);
  }

  #handleCloseRequestCallback() {
    this.#hasClosed = true;

    setTimeout(() => {
      this.dispose();
    });
  }

  /**
   * Requests that the window is closed.
   *
   * This is similar to what happens when a window manager close button is clicked.
   *
   * This function can be used with close buttons in custom titlebars.
   */
  close(): void {
    if (this.#isDisposed) {
      return;
    }

    lib.symbols.gtk_window_close(this.#gtkApplicationWindowPtr);
  }

  /**
   * Release all attached pointers. The `using` keyword call this method automatically.
   */
  dispose(): void {
    this[Symbol.dispose]();
  }

  /**
   * Presents a window to the user.
   *
   * This may mean raising the window in the stacking order, unminimizing it, moving it to the current desktop and/or giving it the keyboard focus (possibly dependent on the user’s platform, window manager and preferences).
   *
   * If `window` is hidden, this function also makes it visible.
   */
  present(): void {
    if (this.#isDisposed) {
      return;
    }

    lib.symbols.gtk_window_present(this.#gtkApplicationWindowPtr);
  }

  /**
   * Sets the default size of a window.
   *
   * The default size of a window is the size that will be used if no other constraints apply.
   *
   * The default size will be updated whenever the window is resized to reflect the new size, unless the window is forced to a size, like when it is maximized or fullscreened.
   *
   * If the window’s minimum size request is larger than the default, the default will be ignored.
   *
   * Setting the default size to a value <= 0 will cause it to be ignored and the natural size request will be used instead. It is possible to do this while the window is showing to “reset” it to its initial size.
   *
   * @param width in pixels, or -1 to unset the default width.
   * @param height in pixels, or -1 to unset the default height.
   */
  setDefaultSize(width: number, height: number): void {
    if (this.#isDisposed) {
      return;
    }

    lib.symbols.gtk_window_set_default_size(
      this.#gtkApplicationWindowPtr,
      width,
      height,
    );
  }

  get title(): string | null {
    return this.#options.title;
  }

  /**
   * Gets/Sets the title of a window will be displayed in its title bar; on the X Window System, the title bar is rendered by the window manager so exactly how the title appears to users may vary according to a user’s exact configuration. The title should help a user distinguish this window from other windows they may have open. A good title might include the application name and current document filename, for example.
   *
   * Passing `null` does the same as setting the title to an empty string.
   */
  set title(title: string | null) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = title == null ? null : getPtrFromString(title);

    lib.symbols.gtk_window_set_title(
      this.#gtkApplicationWindowPtr,
      stringPtr,
    );

    this.#options.title = title;
  }

  [Symbol.dispose](): void {
    if (this.#isDisposed) {
      return;
    }

    if (!this.#hasClosed) {
      lib.symbols.gtk_window_destroy(this.#gtkApplicationWindowPtr);
    }

    this.#unsafeCloseRequestCallBack.close();
    unref(this.#gtkApplicationWindowPtr);
    this.#isDisposed = true;
  }
}
