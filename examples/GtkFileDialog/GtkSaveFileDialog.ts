import { GtkDialogResult, GtkSaveFileDialog } from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkSaveFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
