export type SignalParams = {
  "close-request": [Deno.PointerValue<unknown>, Deno.PointerValue<unknown>];
};

export type SignalReturn = {
  "close-request": boolean;
};

export type Signals = keyof SignalParams;

export const ffiDefinitions = {
  "close-request": { parameters: ["pointer", "pointer"], result: "bool" },
} as const satisfies Record<string, Deno.UnsafeCallbackDefinition>;
