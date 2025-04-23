export enum GtkDialogResult {
  None,
  OK,
  Cancel,
  Abort,
}

export interface GtkFileDialogOptions {
  acceptLabel: string;
  initialFolder: string;
  initialName: string;
  title: string;
}
