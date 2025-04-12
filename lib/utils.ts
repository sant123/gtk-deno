export const debug = Deno.env.has("GTK_DEBUG");

export function getLibName(): string {
  const os = Deno.build.os;
  const prefix = os === "windows" ? "" : "lib";
  const suffix = os === "windows" ? ".dll" : os === "darwin" ? ".dylib" : ".so";

  return `${prefix}gtk-4${suffix}`;
}

export function resolveGtkLibrary(): string {
  if (Deno.env.has("GTK_LIB")) {
    if (debug) {
      console.log("Using GTK library from GTK_LIB:", Deno.env.get("GTK_LIB"));
    }
    return Deno.env.get("GTK_LIB")!;
  }

  const libName = getLibName();

  if (debug) {
    console.log("Using system GTK:", libName);
  }

  return libName;
}
