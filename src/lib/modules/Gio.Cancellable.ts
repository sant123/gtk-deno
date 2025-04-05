export const GioCancellable = {
  g_cancellable_cancel: {
    parameters: ["pointer"],
    result: "void",
  },
  g_cancellable_new: {
    parameters: [],
    result: "pointer",
  },
} satisfies Deno.ForeignLibraryInterface;
