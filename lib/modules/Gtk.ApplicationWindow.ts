export const GtkApplicationWindow = {
  gtk_application_window_new: {
    parameters: ["pointer"],
    result: "pointer",
  },
} satisfies Deno.ForeignLibraryInterface;
