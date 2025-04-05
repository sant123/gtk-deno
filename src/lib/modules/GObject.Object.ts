export const GObjectObject = {
  g_object_unref: {
    parameters: ["pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
