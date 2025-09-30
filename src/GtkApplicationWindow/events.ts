import type { CallbacksFromDefs } from "types";

export const ffiDefinitions = {
  "close-request": { parameters: ["pointer", "pointer"], result: "bool" },
} as const satisfies Record<string, Deno.UnsafeCallbackDefinition>;

export type Signals = keyof typeof ffiDefinitions;
export type Definitions = CallbacksFromDefs<typeof ffiDefinitions>;
