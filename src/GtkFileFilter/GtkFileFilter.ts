import { lib } from "lib";
import { getPtrFromString } from "utils";

export const GtkFileFilterSymbol = Symbol("GtkFileFilter");

export class GtkFileFilter {
  #gtkFileFilterPtr: Deno.PointerValue<unknown> = null;
  #isDisposed = false;
  #isEmpty = true;

  /**
   * Creates a new GtkFileFilter with no rules added to it
   */
  constructor() {
    /**
     * @pointer GtkFileFilter
     */
    this.#gtkFileFilterPtr = lib.symbols.gtk_file_filter_new();
  }

  /**
   * Adds a rule allowing a given mime type.
   * @param mimeType Name of a MIME type.
   */
  addMimeType(mimeType: string): void {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(mimeType);

    lib.symbols.gtk_file_filter_add_mime_type(
      this.#gtkFileFilterPtr,
      stringPtr,
    );

    this.#isEmpty = false;
  }

  /**
   * Adds a rule allowing a shell style glob pattern.
   *
   * Note that it depends on the platform whether pattern matching ignores case or not. On Windows, it does, on other platforms, it doesn’t.
   * @param pattern A shell style glob pattern.
   */
  addPattern(pattern: string): void {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(pattern);

    lib.symbols.gtk_file_filter_add_pattern(
      this.#gtkFileFilterPtr,
      stringPtr,
    );

    this.#isEmpty = false;
  }

  /**
   * Adds a suffix match rule to a filter.
   *
   * This is similar to adding a match for the pattern `"*.suffix"`
   *
   * An example to filter files with the suffix `".sub"`:
   *
   * ```typescript
   * instance.addSuffix("sub");
   * ```
   *
   * Filters with multiple dots are allowed.
   *
   * In contrast to pattern matches, suffix matches are always case-insensitive.
   *
   * Available since: 4.4
   * @param suffix Filename suffix to match.
   */
  addSuffix(suffix: string): void {
    if (this.#isDisposed) {
      return;
    }

    const stringPtr = getPtrFromString(suffix);

    lib.symbols.gtk_file_filter_add_suffix(
      this.#gtkFileFilterPtr,
      stringPtr,
    );

    this.#isEmpty = false;
  }

  dispose(): void {
    this[Symbol.dispose]();
  }

  [Symbol.dispose](): void {
    if (this.#isDisposed) {
      return;
    }

    /**
     * @release GtkFileFilter
     */
    lib.symbols.g_object_unref(this.#gtkFileFilterPtr);
    this.#isDisposed = true;
  }

  /**
   * Internal use only
   */
  [GtkFileFilterSymbol] = {
    getPtr: () => {
      return this.#gtkFileFilterPtr;
    },
    isEmpty: () => {
      return this.#isEmpty;
    },
  };
}
