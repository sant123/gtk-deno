export const GLib = {
  g_free: {
    parameters: ["pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
