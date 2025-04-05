import { debug, resolveGtkLibrary } from "./utils.ts";
import { symbols } from "./symbols.ts";

const libPath = resolveGtkLibrary();
export const lib = Deno.dlopen(libPath, symbols);

if (debug) {
  const major = lib.symbols.gtk_get_major_version();
  const minor = lib.symbols.gtk_get_minor_version();
  const micro = lib.symbols.gtk_get_micro_version();

  console.log(`Gtk version: ${major}.${minor}.${micro}`);
}
