export const GioApplication = {
  g_application_activate: {
    parameters: ["pointer"],
    result: "void",
  },
  g_application_register: {
    parameters: ["pointer", "pointer", "pointer"],
    result: "bool",
  },
} satisfies Deno.ForeignLibraryInterface;
