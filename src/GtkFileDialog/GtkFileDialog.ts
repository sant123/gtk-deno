import { getPtrFromString, GtkSymbol } from "utils";
import { lib } from "lib";
import { ref, unref } from "loop";
import { GtkDialogResult, type GtkFileDialogOptions } from "./misc/types.ts";
import type { GtkFileFilter } from "../GtkFileFilter/GtkFileFilter.ts";

export const EMPTY_DEFAULT_FILTER = "Default file filter is empty.";
export const EMPTY_FILTERS = "One or more filters in setFilters() is empty.";
export const DEFAULT_FILTER_NOT_EXISTS_IN_FILTERS =
  "The default filter must be present in the filter list.";

export abstract class GtkFileDialog {
  #callBackResult: PromiseWithResolvers<void> | null = null;
  #cancellable: Deno.PointerValue<unknown> = null;
  #defaultFilter: GtkFileFilter | null = null;
  #filters: GtkFileFilter[] = [];
  #gtkFileDialogPtr: Deno.PointerValue<unknown> = null;
  #isDisposed = false;
  #listStorePtr: Deno.PointerValue<unknown> = null;
  #queue: Promise<void> = Promise.resolve();
  #result = GtkDialogResult.None;

  #options: GtkFileDialogOptions = {
    acceptLabel: "",
    initialFile: "",
    initialFolder: "",
    initialName: "",
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

  #checkFilters(): void {
    const isDefaultFilterEmpty = this.#defaultFilter?.[GtkSymbol].isEmpty();

    if (isDefaultFilterEmpty) {
      throw new Error(EMPTY_DEFAULT_FILTER);
    }

    const someFilterIsEmpty = this.#filters.some((filter) =>
      filter[GtkSymbol].isEmpty()
    );

    if (someFilterIsEmpty) {
      throw new Error(EMPTY_FILTERS);
    }

    if (
      this.#defaultFilter && this.#filters.length &&
      !this.#filters.includes(this.#defaultFilter)
    ) {
      throw new Error(DEFAULT_FILTER_NOT_EXISTS_IN_FILTERS);
    }
  }

  #initializeGListStore(): void {
    if (this.#listStorePtr) {
      return;
    }

    const gtkFilterType = lib.symbols.gtk_file_filter_get_type();

    /**
     * @pointer GListStore
     */
    this.#listStorePtr = lib.symbols.g_list_store_new(gtkFilterType);

    lib.symbols.gtk_file_dialog_set_filters(
      this.#gtkFileDialogPtr,
      this.#listStorePtr,
    );
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

  /**
   * Incremental use of `instance.setFilters()`. Adds one filter at the end of the filters list.
   * @param filter The file filter.
   */
  addFilter(filter: GtkFileFilter): void {
    this.#initializeGListStore();
    const filterPtr = filter[GtkSymbol].getGtkFileFilterPtr();
    lib.symbols.g_list_store_append(this.#listStorePtr, filterPtr);
    this.#filters.push(filter);
  }

  async showDialog(): Promise<GtkDialogResult> {
    if (this.#isDisposed) {
      return GtkDialogResult.Abort;
    }

    this.#checkFilters();

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

  /**
   * Sets the filter that will be selected by default in the file chooser dialog.
   *
   * If set to `null`, the first item in `instance.setFilters()` will be used as the default filter. If that list is empty, the dialog will be unfiltered.
   *
   * Available since: 4.10
   * @param filter The file filter.
   */
  setDefaultFilter(filter: GtkFileFilter | null): void {
    const filterPtr = filter?.[GtkSymbol].getGtkFileFilterPtr() ?? null;

    lib.symbols.gtk_file_dialog_set_default_filter(
      this.#gtkFileDialogPtr,
      filterPtr,
    );

    this.#defaultFilter = filter;
  }

  /**
   * Sets the filters that will be offered to the user in the file chooser dialog.
   *
   * Available since: 4.10
   * @param filters A params file filter
   */
  setFilters(...filters: GtkFileFilter[]): void {
    this.#initializeGListStore();

    if (this.#filters.length) {
      lib.symbols.g_list_store_remove_all(this.#listStorePtr);
      this.#filters = [];
    }

    for (const filter of filters) {
      const filterPtr = filter[GtkSymbol].getGtkFileFilterPtr();
      lib.symbols.g_list_store_append(this.#listStorePtr, filterPtr);
      this.#filters.push(filter);
    }
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

    if (this.#listStorePtr) {
      /**
       * @release GListStore
       */
      lib.symbols.g_object_unref(this.#listStorePtr);
    }

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

  get initialFile(): string {
    return this.#options.initialFile;
  }

  /**
   * Gets/Sets the file that will be initially selected in the file chooser dialog.
   *
   * This function is a shortcut for calling both `initialFolder` and `initialName` with the directory and name of file, respectively.
   *
   * Available since: 4.10
   */
  set initialFile(initialFile: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(initialFile);

    /**
     * @pointer GFile
     */
    const gFilePtr = lib.symbols.g_file_new_for_path(stringPtr);

    lib.symbols.gtk_file_dialog_set_initial_file(
      this.#gtkFileDialogPtr,
      gFilePtr,
    );

    /**
     * @release GFile
     */
    lib.symbols.g_object_unref(gFilePtr);

    this.#options.initialFile = initialFile;
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

  get initialName(): string {
    return this.#options.initialName;
  }

  /**
   * Gets/Sets the filename that will be initially selected.
   *
   * For save dialogs, `initialName` will usually be pre-entered into the name field.
   *
   * If a file with this name already exists in the directory set via `initialFolder`, the dialog will preselect it.
   *
   * Available since: 4.10
   */
  set initialName(initialName: string) {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(initialName);

    lib.symbols.gtk_file_dialog_set_initial_name(
      this.#gtkFileDialogPtr,
      stringPtr,
    );

    this.#options.initialName = initialName;
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
      gAsyncReadyCallback: (
        _sourceObject: Deno.PointerValue<unknown>,
        _res: Deno.PointerValue<unknown>,
        _data: Deno.PointerValue<unknown>,
      ): void => {},
      showDialog: (): void | Promise<void> => {},
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
