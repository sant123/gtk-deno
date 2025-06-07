export const GioFile = {
  g_list_store_new: {
    parameters: ["u64"],
    result: "pointer",
  },
} satisfies Deno.ForeignLibraryInterface;
