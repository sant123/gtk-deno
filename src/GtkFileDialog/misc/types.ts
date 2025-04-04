export enum GtkDialogResult {
  None,
  OK,
  Cancel,
  Abort,
}

export interface GtkFileDialogOptions {
  acceptLabel: string;
  initialName: string;
  title: string;
}
