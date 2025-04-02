import { getFileNameFromGFile, getGErrorFromPtr } from "utils";
import { lib } from "lib";

import { getDialogResultFromGError } from "./misc/utils.ts";
import { GtkDialogResult } from "./misc/types.ts";
import { GtkFileDialog } from "./GtkFileDialog.ts";

export class GtkOpenMultipleFileDialog extends GtkFileDialog {
  #fileNames: string[] = [];

  protected override gAsyncReadyCallback(
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

    const error = getGErrorFromPtr(errorPtr);
    this.result = getDialogResultFromGError(error);

    if (this.result === GtkDialogResult.OK) {
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

  protected override _showDialog(): void {
    lib.symbols.gtk_file_dialog_open_multiple(
      this.gtkFileDialogPtr,
      null,
      this.cancellable,
      this.unsafeCallBack.pointer,
      null,
    );
  }

  get fileNames(): string[] {
    return this.#fileNames;
  }
}
