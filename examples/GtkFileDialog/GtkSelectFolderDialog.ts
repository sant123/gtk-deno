import {
  GtkDialogResult,
  GtkSelectFolderDialog,
} from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkSelectFolderDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected folder:", dialog.selectedPath);
} else {
  console.log("No folder choosen");
}
