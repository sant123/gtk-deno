export const GtkFileFilter = {
  gtk_file_filter_new: {
    parameters: [],
    result: "pointer",
  },
  gtk_file_filter_add_mime_type: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_filter_add_pattern: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_filter_add_suffix: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
