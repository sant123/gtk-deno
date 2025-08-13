import { getPtrFromString, GtkSymbol } from "utils";
import { lib } from "lib";
import { ref, unref } from "loop";
import { type GtkDialogOptions, GtkDialogResult } from "./misc/types.ts";

export abstract class GtkBaseDialog {
  #callBackResult: PromiseWithResolvers<void> | null = null;
  #cancellable: Deno.PointerValue<unknown> = null;
  #gtkFileDialogPtr: Deno.PointerValue<unknown> = null;
  #isDisposed = false;
  #queue: Promise<void> = Promise.resolve();
  #result = GtkDialogResult.None;

  #options: GtkDialogOptions = {
    acceptLabel: "",
    initialFolder: "",
    title: "",
  };

  #unsafeCallBack: Deno.UnsafeCallback<{
    readonly parameters: readonly ["pointer", "pointer", "pointer"];
    readonly result: "void";
  }> = new Deno.UnsafeCallback({
    parameters: ["pointer", "pointer", "pointer"],
    result: "void",
  }, this.#handleGAsyncReadyCallback.bind(this));

  constructor() {
    lib.symbols.gtk_init();

    /**
     * @pointer GtkFileDialog
     */
    this.#gtkFileDialogPtr = lib.symbols.gtk_file_dialog_new();

    ref(this);
  }

  #handleGAsyncReadyCallback(
    sourceObject: Deno.PointerValue<unknown>,
    res: Deno.PointerValue<unknown>,
    data: Deno.PointerValue<unknown>,
  ): void {
    this[GtkSymbol].child.gAsyncReadyCallback(sourceObject, res, data);

    /**
     * @release GCancellable
     */
    lib.symbols.g_object_unref(this.#cancellable);
    this.#cancellable = null;

    if (this.#result === GtkDialogResult.None) {
      return this.#callBackResult?.reject();
    }

    this.#callBackResult?.resolve();
  }

  async showDialog(): Promise<GtkDialogResult> {
    if (this.#isDisposed) {
      return GtkDialogResult.Abort;
    }

    this[GtkSymbol].child.onBeforeOpen();

    this.#queue = this.#queue.then(async () => {
      /**
       * @pointer GCancellable
       */
      this.#cancellable = lib.symbols.g_cancellable_new();
      this.#callBackResult = Promise.withResolvers();
      await this[GtkSymbol].child.showDialog();
      await this.#callBackResult.promise;
    });

    await this.#queue;
    return this.#result;
  }

  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    if (this.#isDisposed) {
      return;
    }

    if (this.#cancellable) {
      lib.symbols.g_cancellable_cancel(this.#cancellable);
      lib.symbols.g_main_context_iteration(null, true);
    }

    this[GtkSymbol].child.onBeforeDispose();
    this.#unsafeCallBack.close();

    /**
     * @release GtkFileDialog
     */
    lib.symbols.g_object_unref(this.#gtkFileDialogPtr);
    this.#isDisposed = true;

    unref(this);
  }

  get acceptLabel(): string {
    return this.#options.acceptLabel;
  }

  /**
   * Gets/Sets the label shown on the file chooser’s accept button.
   *
   * Leaving the accept label unset will fall back to a default label, depending on what API is used to launch the file dialog.
   *
   * Available since: 4.10
   */
  set acceptLabel(acceptLabel: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(acceptLabel);

    lib.symbols.gtk_file_dialog_set_accept_label(
      this.#gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.acceptLabel = acceptLabel;
  }

  get initialFolder(): string {
    return this.#options.initialFolder;
  }

  /**
   * Gets/Sets the folder that will be set as the initial folder in the file chooser dialog.
   *
   * Available since: 4.10
   */
  set initialFolder(initialFolder: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(initialFolder);

    /**
     * @pointer GFile
     */
    const gFilePtr = lib.symbols.g_file_new_for_path(stringPtr);

    lib.symbols.gtk_file_dialog_set_initial_folder(
      this.#gtkFileDialogPtr,
      gFilePtr,
    );

    /**
     * @release GFile
     */
    lib.symbols.g_object_unref(gFilePtr);

    this.#options.initialFolder = initialFolder;
  }

  get title(): string {
    return this.#options.title;
  }

  /**
   * Gets/Sets the title that will be shown on the file chooser dialog.
   *
   * Available since: 4.10
   */
  set title(title: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(title);

    lib.symbols.gtk_file_dialog_set_title(
      this.#gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.title = title;
  }

  /**
   * Internal use only
   */
  [GtkSymbol] = {
    child: {
      onBeforeOpen: (): void => {},
      onBeforeDispose: (): void => {},
      gAsyncReadyCallback: (
        _sourceObject: Deno.PointerValue<unknown>,
        _res: Deno.PointerValue<unknown>,
        _data: Deno.PointerValue<unknown>,
      ): void => {},
      showDialog: (): void | Promise<void> => {},
    },
    isDisposed: (): boolean => {
      return this.#isDisposed;
    },
    getResult: (): GtkDialogResult => {
      return this.#result;
    },
    setResult: (result: GtkDialogResult): void => {
      this.#result = result;
    },
    getGtkFileDialogPtr: (): Deno.PointerValue<unknown> => {
      return this.#gtkFileDialogPtr;
    },
    getCancellable: (): Deno.PointerValue<unknown> => {
      return this.#cancellable;
    },
    getUnsafeCallbackPtr: (): Deno.PointerValue<unknown> => {
      return this.#unsafeCallBack.pointer;
    },
  };
}
