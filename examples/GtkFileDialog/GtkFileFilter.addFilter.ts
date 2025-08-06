import {
  GtkDialogResult,
  GtkOpenFileDialog,
} from "../../src/GtkFileDialog/mod.ts";

import { GtkFileFilter } from "../../src/GtkFileFilter/mod.ts";

using dialog = new GtkOpenFileDialog();

using mimeTypeTextPlainFilter = new GtkFileFilter();
mimeTypeTextPlainFilter.addMimeType("text/plain");

using patternJsonFilter = new GtkFileFilter();
patternJsonFilter.addPattern("*.json");

using suffixPdfFilter = new GtkFileFilter();
suffixPdfFilter.addSuffix("pdf");

dialog.addFilter(mimeTypeTextPlainFilter);
dialog.addFilter(patternJsonFilter);
dialog.addFilter(suffixPdfFilter);

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
