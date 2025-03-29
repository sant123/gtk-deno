import { GError } from "types";
import { GtkDialogResult } from "./types.ts";

export function getDialogResultFromGError(error: GError | null) {
  if (!error) {
    return GtkDialogResult.OK;
  }

  switch (error.code) {
    case 1:
      return GtkDialogResult.Abort;

    case 2:
      return GtkDialogResult.Cancel;

    default:
      return GtkDialogResult.None;
  }
}
