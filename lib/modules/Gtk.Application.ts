export const GtkApplication = {
  gtk_application_new: {
    parameters: ["pointer", "u32"],
    result: "pointer",
  },
} satisfies Deno.ForeignLibraryInterface;
