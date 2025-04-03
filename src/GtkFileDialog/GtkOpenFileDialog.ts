import { getFileNameFromGFile, getGErrorFromDoublePtr } from "utils";
import { lib } from "lib";

import { getDialogResultFromGError } from "./misc/utils.ts";
import { GtkDialogResult } from "./misc/types.ts";
import { GtkFileDialog } from "./GtkFileDialog.ts";

export class GtkOpenFileDialog extends GtkFileDialog {
  #fileName = "";

  protected override gAsyncReadyCallback(
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
    this.result = getDialogResultFromGError(error);

    if (this.result === GtkDialogResult.OK) {
      this.#fileName = getFileNameFromGFile(gFilePtr);
    }
  }

  protected override _showDialog(): void {
    lib.symbols.gtk_file_dialog_open(
      this.gtkFileDialogPtr,
      null,
      this.cancellable,
      this.unsafeCallBack.pointer,
      null,
    );
  }

  get fileName(): string {
    return this.#fileName;
  }
}
