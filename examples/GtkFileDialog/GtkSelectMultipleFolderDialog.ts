import {
  GtkDialogResult,
  GtkSelectMultipleFolderDialog,
} from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkSelectMultipleFolderDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected folders:", dialog.selectedPaths);
} else {
  console.log("No folder choosen");
}
