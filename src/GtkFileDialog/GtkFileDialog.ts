import { getPtrFromString } from "utils";
import { lib } from "lib";
import { ref, unref } from "loop";
import { GtkDialogResult, GtkFileDialogOptions } from "./misc/types.ts";

export abstract class GtkFileDialog {
  #callBackResult: PromiseWithResolvers<void> | null = null;
  #isDisposed = false;
  #queue: Promise<void> = Promise.resolve();

  #options: GtkFileDialogOptions = {
    acceptLabel: "",
    initialFolder: "",
    initialName: "",
    title: "",
  };

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
    return this.#options.title;
  }

  /**
   * Gets/Sets the title that will be shown on the file chooser dialog.
   * Available since: 4.10
   */
  set title(title: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(title);

    lib.symbols.gtk_file_dialog_set_title(
      this.gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.title = title;
  }

  get acceptLabel(): string {
    return this.#options.acceptLabel;
  }

  /**
   * Gets/Sets the label shown on the file chooser’s accept button.
   * Leaving the accept label unset will fall back to a default label, depending on what API is used to launch the file dialog.
   * Available since: 4.10
   */
  set acceptLabel(acceptLabel: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(acceptLabel);

    lib.symbols.gtk_file_dialog_set_accept_label(
      this.gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.acceptLabel = acceptLabel;
  }

  get initialFolder(): string {
    return this.#options.initialFolder;
  }

  /**
   * Gets/Sets the folder that will be set as the initial folder in the file chooser dialog.
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
      this.gtkFileDialogPtr,
      gFilePtr,
    );

    /**
     * @release GFile
     */
    lib.symbols.g_object_unref(gFilePtr);

    this.#options.initialFolder = initialFolder;
  }

  get initialName(): string {
    return this.#options.initialName;
  }

  /**
   * Gets/Sets the filename that will be initially selected.
   * For save dialogs, `initialName` will usually be pre-entered into the name field.
   * If a file with this name already exists in the directory set via `initialFolder`, the dialog will preselect it.
   * Available since: 4.10
   */
  set initialName(initialName: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(initialName);

    lib.symbols.gtk_file_dialog_set_initial_name(
      this.gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.initialName = initialName;
  }
}
