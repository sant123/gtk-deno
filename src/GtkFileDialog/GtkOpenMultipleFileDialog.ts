import { getFileNameFromGFile, getGErrorFromDoublePtr, GtkSymbol } from "utils";
import { lib } from "lib";

import { getDialogResultFromGError } from "./misc/utils.ts";
import { GtkDialogResult } from "./misc/types.ts";
import { GtkFileDialog } from "./GtkFileDialog.ts";

export class GtkOpenMultipleFileDialog extends GtkFileDialog {
  #fileNames: string[] = [];

  constructor() {
    super();

    this[GtkSymbol].child
      .gAsyncReadyCallback = this.#gAsyncReadyCallback.bind(this);

    this[GtkSymbol].child
      .showDialog = this.#showDialog.bind(this);
  }

  #gAsyncReadyCallback(
    sourceObject: Deno.PointerValue<unknown>,
    res: Deno.PointerValue<unknown>,
  ): void {
    this.#fileNames = [];
    const errorPtr = Deno.UnsafePointer.of(new Uint8Array(8));

    /**
     * @pointer GListModel
     */
    const gListModelPtr = lib.symbols.gtk_file_dialog_open_multiple_finish(
      sourceObject,
      res,
      errorPtr,
    );

    const error = getGErrorFromDoublePtr(errorPtr);
    this[GtkSymbol].setResult(getDialogResultFromGError(error));

    if (this[GtkSymbol].getResult() === GtkDialogResult.OK) {
      let position = 0;

      for (;;) {
        /**
         * @pointer GFile
         */
        const gFilePtr = lib.symbols.g_list_model_get_object(
          gListModelPtr,
          position++,
        );

        if (!gFilePtr) {
          break;
        }

        const fileName = getFileNameFromGFile(gFilePtr);
        this.#fileNames.push(fileName);
      }

      /**
       * @release GListModel
       */
      lib.symbols.g_object_unref(gListModelPtr);
    }
  }

  #showDialog(): void {
    lib.symbols.gtk_file_dialog_open_multiple(
      this[GtkSymbol].getGtkFileDialogPtr(),
      null,
      this[GtkSymbol].getCancellable(),
      this[GtkSymbol].getUnsafeCallbackPtr(),
      null,
    );
  }

  get fileNames(): string[] {
    return this.#fileNames;
  }
}
