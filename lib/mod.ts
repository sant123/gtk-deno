import { getVersion, resolveGtkLibrary } from "./utils.ts";
import { symbols } from "./symbols.ts";

const libPath = resolveGtkLibrary();
const version = getVersion(libPath);

const lib = Deno.dlopen(libPath, symbols);

export { lib, version };
