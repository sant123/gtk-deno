import { getVersion, type GtkVersion, resolveGtkLibrary } from "./utils.ts";
import { symbols } from "./symbols.ts";

const libPath: string = resolveGtkLibrary();

/** Current GTK version */
const version: GtkVersion = getVersion(libPath);

if (import.meta.main) {
  const { micro, major, minor } = version;
  console.log(`Gtk version: ${major}.${minor}.${micro}`);
}

/** Gtk with all symbols registered */
const lib = Deno.dlopen(libPath, symbols);

export { lib, version };
