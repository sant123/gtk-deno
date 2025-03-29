import { GtkOpenFileDialog } from "../GtkOpenFileDialog.ts";
import { GtkDialogResult } from "../misc/types.ts";

using dialog = new GtkOpenFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
