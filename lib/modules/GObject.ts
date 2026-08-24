export const GObject = {
  g_signal_connect_data: {
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer", "u32"],
    result: "u64",
  },
  g_signal_handler_disconnect: {
    parameters: ["pointer", "u64"],
    result: "void",
  },
} satisfies Deno.ForeignLibraryInterface;
