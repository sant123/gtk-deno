import {
  GtkDialogResult,
  GtkOpenFileDialog,
} from "../../src/GtkFileDialog/mod.ts";

import { GtkFileFilter } from "../../src/GtkFileFilter/mod.ts";

using dialog = new GtkOpenFileDialog();
using filter = new GtkFileFilter();

filter.addMimeType("text/plain");
// filter.addPattern("*.json");
// filter.addSuffix("pdf");

dialog.defaultFilter = filter;

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
