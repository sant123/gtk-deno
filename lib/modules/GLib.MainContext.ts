export const GLibMainContext = {
  g_main_context_iteration: {
    parameters: ["pointer", "i32"],
    result: "i32",
  },
} satisfies Deno.ForeignLibraryInterface;
