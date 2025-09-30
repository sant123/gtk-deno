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

export type CallbacksFromDefs<
  T extends Record<string, Deno.UnsafeCallbackDefinition>,
> = {
  [K in keyof T]: T[K] extends {
    parameters: infer P extends readonly Deno.NativeType[];
    result: infer R extends Deno.NativeResultType;
  } ? (
      ...args: {
        -readonly [I in keyof P]: Deno.FromNativeType<P[I]>;
      }
    ) => Deno.ToNativeResultType<R>
    : never;
};
