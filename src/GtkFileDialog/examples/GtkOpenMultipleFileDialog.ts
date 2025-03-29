import { GtkOpenMultipleFileDialog } from "../GtkOpenMultipleFileDialog.ts";
import { GtkDialogResult } from "../misc/types.ts";

using dialog = new GtkOpenMultipleFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected files:", dialog.fileNames);
} else {
  console.log("No file choosen");
}
