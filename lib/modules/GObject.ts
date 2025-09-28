export const GObject = {
  g_signal_connect_data: {
    parameters: ["pointer", "pointer", "pointer", "pointer", "pointer", "u32"],
    result: "u64",
  },
} satisfies Deno.ForeignLibraryInterface;
