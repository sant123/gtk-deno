export interface GError {
  domain: number;
  code: number;
  message: string;
}

export interface Closable {
  close(): void;
}

export enum GtkConnectFlags {
  G_CONNECT_DEFAULT = 0,
  G_CONNECT_AFTER = 1,
  G_CONNECT_SWAPPED = 2,
}
