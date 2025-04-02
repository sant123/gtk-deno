import { lib } from "lib";
import { ref, unref } from "loop";
import { GtkDialogResult, GtkFileDialogOptions } from "./misc/types.ts";

export abstract class GtkFileDialog {
  #callBackResult: PromiseWithResolvers<void> | null = null;
  #isDisposed = false;
  #options: GtkFileDialogOptions = {};
  #queue: Promise<void> = Promise.resolve();

  protected cancellable: Deno.PointerValue<unknown> = null;
  protected gtkFileDialogPtr: Deno.PointerValue<unknown> = null;
  protected result = GtkDialogResult.None;

  protected unsafeCallBack = new Deno.UnsafeCallback({
    parameters: ["pointer", "pointer", "pointer"],
    result: "void",
  }, this.#handleGAsyncReadyCallback.bind(this));

  constructor() {
    lib.symbols.gtk_init();

    /**
     * @pointer GtkFileDialog
     */
    this.gtkFileDialogPtr = lib.symbols.gtk_file_dialog_new();

    ref(this);
  }

  #handleGAsyncReadyCallback(
    sourceObject: Deno.PointerValue<unknown>,
    res: Deno.PointerValue<unknown>,
    data: Deno.PointerValue<unknown>,
  ): void {
    this.gAsyncReadyCallback(sourceObject, res, data);

    /**
     * @release GCancellable
     */
    lib.symbols.g_object_unref(this.cancellable);
    this.cancellable = null;

    if (this.result === GtkDialogResult.None) {
      return this.#callBackResult?.reject();
    }

    this.#callBackResult?.resolve();
  }

  protected abstract _showDialog(): void | Promise<void>;

  protected abstract gAsyncReadyCallback(
    sourceObject: Deno.PointerValue<unknown>,
    res: Deno.PointerValue<unknown>,
    data: Deno.PointerValue<unknown>,
  ): void;

  async showDialog(): Promise<GtkDialogResult> {
    if (this.#isDisposed) {
      return GtkDialogResult.Abort;
    }

    this.#queue = this.#queue.then(async () => {
      /**
       * @pointer GCancellable
       */
      this.cancellable = lib.symbols.g_cancellable_new();
      this.#callBackResult = Promise.withResolvers();
      await this._showDialog();
      await this.#callBackResult.promise;
    });

    await this.#queue;
    return this.result;
  }

  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    if (this.#isDisposed) {
      return;
    }

    if (this.cancellable) {
      lib.symbols.g_cancellable_cancel(this.cancellable);
      lib.symbols.g_main_context_iteration(null, true);
    }

    this.#isDisposed = true;
    this.unsafeCallBack.close();

    /**
     * @release GtkFileDialog
     */
    lib.symbols.g_object_unref(this.gtkFileDialogPtr);

    unref(this);
  }

  get title(): string {
    return this.#options.title ?? "";
  }

  set title(title: string) {
    if (this.#isDisposed) {
      return;
    }

    const bytes = new TextEncoder().encode(title + "\0");
    const stringPtr = Deno.UnsafePointer.of(bytes);

    lib.symbols.gtk_file_dialog_set_title(
      this.gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.title = title;
  }
}
