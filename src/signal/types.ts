export interface Closable {
  close(): void;
}

/**
 * A signal callback definition with an optional conversion from its public
 * TypeScript result to the ABI result expected by GLib/GTK.
 */
export type SignalDefinition = Deno.UnsafeCallbackDefinition & {
  transformResult?: (...args: never[]) => unknown;
};

export type AbiCallbackFromDef<Def extends Deno.UnsafeCallbackDefinition> =
  Def extends {
    parameters: infer P extends readonly Deno.NativeType[];
    result: infer R extends Deno.NativeResultType;
  } ? (
      ...args: { -readonly [I in keyof P]: Deno.FromNativeType<P[I]> }
    ) => Deno.ToNativeResultType<R>
    : never;

export type CallbackFromDef<Def extends Deno.UnsafeCallbackDefinition> =
  Def extends {
    parameters: infer P extends readonly Deno.NativeType[];
    transformResult: (value: infer PublicResult) => unknown;
  } ? (
      ...args: { -readonly [I in keyof P]: Deno.FromNativeType<P[I]> }
    ) => PublicResult
    : AbiCallbackFromDef<Def>;
