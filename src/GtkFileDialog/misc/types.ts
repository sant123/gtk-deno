export enum GtkDialogResult {
  None,
  OK,
  Cancel,
  Abort,
}

export interface GtkDialogOptions {
  acceptLabel: string;
  initialFolder: string;
  title: string;
}

export interface GtkFileDialogOptions {
  initialFile: string;
  initialName: string;
}
