export const GioListStore = {
  g_list_store_append: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  g_list_store_new: {
    parameters: ["u64"],
    result: "pointer",
  },
  g_list_store_splice: {
    parameters: ["pointer", "u32", "u32", "pointer", "u32"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
