import {
  GtkDialogResult,
  GtkOpenMultipleFileDialog,
} from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkOpenMultipleFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected files:", dialog.fileNames);
} else {
  console.log("No file choosen");
}
