import { getPtrFromString, GtkSymbol } from "utils";
import { lib } from "lib";
import type { GtkFileFilter } from "../GtkFileFilter/GtkFileFilter.ts";
import { GtkBaseDialog } from "./GtkBaseDialog.ts";

const EMPTY_DEFAULT_FILTER = "Default file filter is empty.";
const EMPTY_FILTERS = "One or more filters in setFilters() is empty.";
const DEFAULT_FILTER_NOT_EXISTS_IN_FILTERS =
  "The default filter must be present in the filter list.";

interface GtkFileDialogOptions {
  initialFile: string;
  initialName: string;
}

export abstract class GtkFileDialog extends GtkBaseDialog {
  #defaultFilter: GtkFileFilter | null = null;
  #filters: GtkFileFilter[] = [];
  #listStorePtr: Deno.PointerValue<unknown> = null;

  #options: GtkFileDialogOptions = {
    initialFile: "",
    initialName: "",
  };

  constructor() {
    super();

    this[GtkSymbol].child
      .onBeforeOpen = this.#onBeforeOpen.bind(this);

    this[GtkSymbol].child
      .onBeforeDispose = this.#onBeforeDispose.bind(this);
  }

  #onBeforeOpen(): void {
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

  #onBeforeDispose(): void {
    if (this.#listStorePtr) {
      /**
       * @release GListStore
       */
      lib.symbols.g_object_unref(this.#listStorePtr);
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
      this[GtkSymbol].getGtkFileDialogPtr(),
      this.#listStorePtr,
    );
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
      this[GtkSymbol].getGtkFileDialogPtr(),
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

    const ptrArray = new BigUint64Array(filters.length);

    for (let i = 0; i < filters.length; i++) {
      const ptr = filters[i][GtkSymbol].getGtkFileFilterPtr();
      ptrArray[i] = Deno.UnsafePointer.value(ptr);
    }

    lib.symbols.g_list_store_splice(
      this.#listStorePtr,
      0,
      this.#filters.length,
      Deno.UnsafePointer.of(ptrArray),
      filters.length,
    );

    this.#filters = [...filters];
  }

  get initialFile(): string {
    return this.#options.initialFile;
  }

  /**
   * Gets/Sets the file that will be initially selected in the file chooser dialog.
   *
   * This function is a shortcut for calling both `initialFolder` and `initialName` with the directory and name of `file`, respectively.
   *
   * Available since: 4.10
   */
  set initialFile(initialFile: string) {
    if (this[GtkSymbol].isDisposed()) {
      return;
    }

    const stringPtr = getPtrFromString(initialFile);

    /**
     * @pointer GFile
     */
    const gFilePtr = lib.symbols.g_file_new_for_path(stringPtr);

    lib.symbols.gtk_file_dialog_set_initial_file(
      this[GtkSymbol].getGtkFileDialogPtr(),
      gFilePtr,
    );

    /**
     * @release GFile
     */
    lib.symbols.g_object_unref(gFilePtr);

    this.#options.initialFile = initialFile;
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
    if (this[GtkSymbol].isDisposed()) {
      return;
    }

    const stringPtr = getPtrFromString(initialName);

    lib.symbols.gtk_file_dialog_set_initial_name(
      this[GtkSymbol].getGtkFileDialogPtr(),
      stringPtr,
    );

    this.#options.initialName = initialName;
  }
}
