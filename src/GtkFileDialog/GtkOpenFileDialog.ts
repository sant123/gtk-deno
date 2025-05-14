import { getFileNameFromGFile, getGErrorFromDoublePtr, GtkSymbol } from "utils";
import { lib } from "lib";

import { getDialogResultFromGError } from "./misc/utils.ts";
import { GtkDialogResult } from "./misc/types.ts";
import { GtkFileDialog } from "./GtkFileDialog.ts";

export class GtkOpenFileDialog extends GtkFileDialog {
  #fileName = "";

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
    this.#fileName = "";
    const errorPtr = Deno.UnsafePointer.of(new Uint8Array(8));

    /**
     * @pointer GFile
     */
    const gFilePtr = lib.symbols.gtk_file_dialog_open_finish(
      sourceObject,
      res,
      errorPtr,
    );

    const error = getGErrorFromDoublePtr(errorPtr);
    this[GtkSymbol].setResult(getDialogResultFromGError(error));

    if (this[GtkSymbol].getResult() === GtkDialogResult.OK) {
      this.#fileName = getFileNameFromGFile(gFilePtr);
    }
  }

  #showDialog(): void {
    lib.symbols.gtk_file_dialog_open(
      this[GtkSymbol].getGtkFileDialogPtr(),
      null,
      this[GtkSymbol].getCancellable(),
      this[GtkSymbol].getUnsafeCallbackPtr(),
      null,
    );
  }

  get fileName(): string {
    return this.#fileName;
  }
}
