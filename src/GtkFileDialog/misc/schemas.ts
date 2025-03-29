import * as v from "valibot";
import { GtkDialogResult } from "./types.ts";

const minFileNameStringLength = 2; // Min two chars
const minFileNamesArrayLength = 2; // Min two files

export const GtkOpenFileDialogDefaultSchema = v.object({
  fileName: v.pipe(v.string(), v.length(0)),
});

export const GtkOpenMultipleFileDialogDefaultSchema = v.object({
  fileNames: v.pipe(v.array(v.string()), v.length(0)),
});

export const GtkOpenFileDialogOkSchema = v.object({
  fileName: v.pipe(v.string(), v.minLength(minFileNameStringLength)),
});

export const GtkOpenMultipleFileDialogOkSchema = v.object({
  fileNames: v.pipe(
    v.array(v.pipe(v.string(), v.minLength(minFileNameStringLength))),
    v.minLength(minFileNamesArrayLength),
  ),
});

export const GtkFileDialogResultSchema = v.union([
  v.literal(GtkDialogResult.OK),
  v.literal(GtkDialogResult.Cancel),
]);

export const GtkFileDialogResultsSchema = v.array(GtkFileDialogResultSchema);
