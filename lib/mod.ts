import { getVersion, type GtkVersion, resolveGtkLibrary } from "./utils.ts";
import { symbols } from "./symbols.ts";

const libPath: string = resolveGtkLibrary();
const version: GtkVersion = getVersion(libPath);

const lib = Deno.dlopen(libPath, symbols);

export { lib, version };
