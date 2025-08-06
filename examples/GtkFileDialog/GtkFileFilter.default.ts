import {
  GtkDialogResult,
  GtkOpenFileDialog,
} from "../../src/GtkFileDialog/mod.ts";

import { GtkFileFilter } from "../../src/GtkFileFilter/mod.ts";

using dialog = new GtkOpenFileDialog();
using filter = new GtkFileFilter();

dialog.setDefaultFilter(filter);
filter.addMimeType("text/plain");
// filter.addPattern("*.json");
// filter.addSuffix("pdf");

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
