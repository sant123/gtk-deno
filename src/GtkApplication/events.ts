export type SignalParams = {
  activate: [Deno.PointerValue<unknown>, Deno.PointerValue<unknown>];
};

export type Signals = keyof SignalParams;

export const ffiDefinitions = {
  activate: { parameters: ["pointer", "pointer"], result: "void" },
} as const;
