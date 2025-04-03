import { GtkSaveFileDialog } from "../GtkSaveFileDialog.ts";
import { GtkDialogResult } from "../misc/types.ts";

using dialog = new GtkSaveFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
