export const GtkWindow = {
  gtk_window_present: {
    parameters: ["pointer"],
    result: "void",
  },
  gtk_window_set_default_size: {
    parameters: ["pointer", "i32", "i32"],
    result: "void",
  },
  gtk_window_set_title: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
