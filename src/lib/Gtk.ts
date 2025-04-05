export const Gtk = {
  gtk_init: {
    parameters: [],
    result: "void",
  },
  gtk_get_major_version: {
    parameters: [],
    result: "u32",
  },
  gtk_get_minor_version: {
    parameters: [],
    result: "u32",
  },
  gtk_get_micro_version: {
    parameters: [],
    result: "u32",
  },
} satisfies Deno.ForeignLibraryInterface;
