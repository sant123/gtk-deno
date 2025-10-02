export const GLibMainContext = {
  g_main_context_iteration: {
    parameters: ["pointer", "bool"],
    result: "bool",
  },
  g_main_context_pending: {
    parameters: ["pointer"],
    result: "bool",
  },
} satisfies Deno.ForeignLibraryInterface;
