import { getFileNameFromGFile, getGErrorFromDoublePtr, GtkSymbol } from "utils";
import { lib } from "lib";

import { getDialogResultFromGError } from "./misc/utils.ts";
import { GtkDialogResult } from "./misc/types.ts";
import { GtkBaseDialog } from "./GtkBaseDialog.ts";

export class GtkSelectFolderDialog extends GtkBaseDialog {
  #selectedPath = "";

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
    this.#selectedPath = "";
    const errorPtr = Deno.UnsafePointer.of(new BigUint64Array(1));

    /**
     * @pointer GFile
     */
    const gFilePtr = lib.symbols.gtk_file_dialog_select_folder_finish(
      sourceObject,
      res,
      errorPtr,
    );

    const error = getGErrorFromDoublePtr(errorPtr);
    this[GtkSymbol].setResult(getDialogResultFromGError(error));

    if (this[GtkSymbol].getResult() === GtkDialogResult.OK) {
      this.#selectedPath = getFileNameFromGFile(gFilePtr);
    }
  }

  #showDialog(): void {
    lib.symbols.gtk_file_dialog_select_folder(
      this[GtkSymbol].getGtkFileDialogPtr(),
      null,
      this[GtkSymbol].getCancellable(),
      this[GtkSymbol].getUnsafeCallbackPtr(),
      null,
    );
  }

  get selectedPath(): string {
    return this.#selectedPath;
  }
}
