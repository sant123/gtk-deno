import { GtkFileFilter } from "../../GtkFileFilter/GtkFileFilter.ts";
import { GtkOpenFileDialog } from "../GtkOpenFileDialog.ts";
import { GtkDialogResult } from "../misc/types.ts";

using dialog = new GtkOpenFileDialog();
using filter = new GtkFileFilter();

filter.addMimeType("text/plain");
// filter.addPattern("*.json");
// filter.addSuffix("pdf");

dialog.setDefaultFilter(filter);

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
