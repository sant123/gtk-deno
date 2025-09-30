export interface Closable {
  close(): void;
}

export type CallbackFromDef<Def extends Deno.UnsafeCallbackDefinition> =
  Def extends {
    parameters: infer P extends readonly Deno.NativeType[];
    result: infer R extends Deno.NativeResultType;
  } ? (
      ...args: { -readonly [I in keyof P]: Deno.FromNativeType<P[I]> }
    ) => Deno.ToNativeResultType<R>
    : never;
