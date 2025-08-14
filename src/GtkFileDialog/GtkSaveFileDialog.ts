import { getGErrorFromDoublePtr, getPathFromGFile, GtkSymbol } from "utils";
import { lib } from "lib";

import { getDialogResultFromGError } from "./misc/utils.ts";
import { GtkDialogResult } from "./misc/types.ts";
import { GtkFileDialog } from "./GtkFileDialog.ts";

export class GtkSaveFileDialog extends GtkFileDialog {
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
    const errorPtr = Deno.UnsafePointer.of(new BigUint64Array(1));

    /**
     * @pointer GFile
     */
    const gFilePtr = lib.symbols.gtk_file_dialog_save_finish(
      sourceObject,
      res,
      errorPtr,
    );

    const error = getGErrorFromDoublePtr(errorPtr);
    this[GtkSymbol].setResult(getDialogResultFromGError(error));

    if (this[GtkSymbol].getResult() === GtkDialogResult.OK) {
      this.#fileName = getPathFromGFile(gFilePtr);
    }
  }

  #showDialog(): void {
    lib.symbols.gtk_file_dialog_save(
      this[GtkSymbol].getGtkFileDialogPtr(),
      null,
      this[GtkSymbol].getCancellable(),
      this[GtkSymbol].getUnsafeCallbackPtr(),
      null,
    );
  }

  /**
   * Presents a file chooser dialog to the user.
   *
   * The file chooser dialog will be save mode.
   *
   * Available since: 4.10
   */
  override showDialog(): Promise<GtkDialogResult> {
    return super.showDialog();
  }

  get fileName(): string {
    return this.#fileName;
  }
}
