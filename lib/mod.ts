import { resolveGtkLibrary } from "./utils.ts";
import { symbols } from "./symbols.ts";

const libPath: string = resolveGtkLibrary();
const lib = Deno.dlopen(libPath, symbols);

export { lib };
