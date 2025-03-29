export const GioListModel = {
  g_list_model_get_object: {
    parameters: ["pointer", "u32"],
    result: "pointer",
  },
} satisfies Deno.ForeignLibraryInterface;
