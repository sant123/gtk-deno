import type { CallbackFromDef } from "signal";

export const ffiDefinitions = {
  "close-request": {
    parameters: ["pointer", "pointer"],
    result: "bool",
  },
} as const;

export type Signals = keyof typeof ffiDefinitions;

export type Definitions = {
  [K in Signals]: CallbackFromDef<typeof ffiDefinitions[K]>;
};
