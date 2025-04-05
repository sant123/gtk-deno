export function getLibName(): string {
  const os = Deno.build.os;
  const prefix = os === "windows" ? "" : "lib";
  const suffix = os === "windows" ? ".dll" : os === "darwin" ? ".dylib" : ".so";

  return `${prefix}gtk-4${suffix}`;
}
