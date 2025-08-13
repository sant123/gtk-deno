import { GtkDialogResult, GtkOpenFileDialog } from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkOpenFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
