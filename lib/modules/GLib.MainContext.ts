export const GLibMainContext = {
  g_main_context_iteration: {
    parameters: ["pointer", "bool"],
    result: "bool",
  },
} satisfies Deno.ForeignLibraryInterface;
