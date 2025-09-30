import type { CallbackFromDef } from "signal";

export const ffiDefinitions = {
  activate: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  "window-added": {
    parameters: ["pointer", "pointer", "pointer"],
    result: "void",
  },
  "window-removed": {
    parameters: ["pointer", "pointer", "pointer"],
    result: "void",
  },
} as const;

export type Signals = keyof typeof ffiDefinitions;

export type Definitions = {
  [K in Signals]: CallbackFromDef<typeof ffiDefinitions[K]>;
};
