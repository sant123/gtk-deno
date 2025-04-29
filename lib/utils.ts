const debug = Deno.env.has("GTK_DEBUG");

export interface GtkVersion {
  major: number;
  minor: number;
  micro: number;
}

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

export function getVersion(libPath: string): GtkVersion {
  const lib = Deno.dlopen(libPath, {
    gtk_get_major_version: {
      parameters: [],
      result: "u32",
    },
    gtk_get_minor_version: {
      parameters: [],
      result: "u32",
    },
    gtk_get_micro_version: {
      parameters: [],
      result: "u32",
    },
  });

  const major = lib.symbols.gtk_get_major_version();
  const minor = lib.symbols.gtk_get_minor_version();
  const micro = lib.symbols.gtk_get_micro_version();

  lib.close();

  return { major, minor, micro };
}
