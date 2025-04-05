export const GLibError = {
  g_error_free: {
    parameters: ["pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
