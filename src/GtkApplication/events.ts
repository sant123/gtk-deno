import type { CallbacksFromDefs } from "types";

export const ffiDefinitions = {
  activate: { parameters: ["pointer", "pointer"], result: "void" },
} as const satisfies Record<string, Deno.UnsafeCallbackDefinition>;

export type Signals = keyof typeof ffiDefinitions;
export type Definitions = CallbacksFromDefs<typeof ffiDefinitions>;
