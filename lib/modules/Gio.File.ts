export const GioFile = {
  g_file_get_path: {
    parameters: ["pointer"],
    result: "pointer",
  },
  g_file_new_for_path: {
    parameters: ["pointer"],
    result: "pointer",
  },
} satisfies Deno.ForeignLibraryInterface;
