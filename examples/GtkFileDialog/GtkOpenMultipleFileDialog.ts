import {
  GtkDialogResult,
  GtkOpenMultipleFileDialog,
} from "../../src/GtkFileDialog/mod.ts";

using dialog = new GtkOpenMultipleFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected files:", dialog.fileNames);
} else {
  console.log("No file choosen");
}
