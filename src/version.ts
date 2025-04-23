import { version } from "lib";

if (import.meta.main) {
  const { micro, major, minor } = version;
  console.log(`Gtk version: ${major}.${minor}.${micro}`);
}

export { version };
