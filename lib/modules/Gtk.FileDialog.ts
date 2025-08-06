export const GtkFileDialog = {
  gtk_file_dialog_open: {
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_open_finish: {
    parameters: ["pointer", "pointer", "pointer"],
    result: "pointer",
  },
  gtk_file_dialog_open_multiple: {
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_open_multiple_finish: {
    parameters: ["pointer", "pointer", "pointer"],
    result: "pointer",
  },
  gtk_file_dialog_save: {
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_save_finish: {
    parameters: ["pointer", "pointer", "pointer"],
    result: "pointer",
  },
  gtk_file_dialog_set_filters: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_new: {
    parameters: [],
    result: "pointer",
  },
  gtk_file_dialog_set_accept_label: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_set_default_filter: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_set_initial_file: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_set_initial_folder: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_set_initial_name: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gtk_file_dialog_set_title: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
