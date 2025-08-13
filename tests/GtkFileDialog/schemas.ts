import * as v from "valibot";
import { GtkDialogResult } from "@onyx/gtk/GtkFileDialog";

const minFileNameStringLength = 2; // Min two chars
const minFileNamesArrayLength = 2; // Min two files

export const SingleChoice = v.union([
  v.literal(GtkDialogResult.OK),
  v.literal(GtkDialogResult.Cancel),
]);

export const MultipleChoice = v.array(SingleChoice);

export const GtkFileDialogDefaultSchema = v.object({
  fileName: v.pipe(v.string(), v.length(0)),
});

export const GtkFileDialogOkSchema = v.object({
  fileName: v.pipe(v.string(), v.minLength(minFileNameStringLength)),
});

export const GtkOpenMultipleFileDialogDefaultSchema = v.object({
  fileNames: v.pipe(v.array(v.string()), v.length(0)),
});

export const GtkOpenMultipleFileDialogOkSchema = v.object({
  fileNames: v.pipe(
    v.array(v.pipe(v.string(), v.minLength(minFileNameStringLength))),
    v.minLength(minFileNamesArrayLength),
  ),
});

export const GtkSelectFolderDialogDefaultSchema = v.object({
  selectedPath: v.pipe(v.string(), v.length(0)),
});

export const GtkSelectFolderDialogOkSchema = v.object({
  selectedPath: v.pipe(v.string(), v.minLength(minFileNameStringLength)),
});
