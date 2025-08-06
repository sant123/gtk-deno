export const GioListStore = {
  g_list_store_append: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  g_list_store_new: {
    parameters: ["u64"],
    result: "pointer",
  },
  g_list_store_remove_all: {
    parameters: ["pointer"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
