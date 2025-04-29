import {
  GtkDialogResult,
  GtkOpenFileDialog,
} from "../../src/GtkFileDialog/mod.ts";

using dialog = new GtkOpenFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
