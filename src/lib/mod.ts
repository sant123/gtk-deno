import { getLibName } from "./utils.ts";
import { GioCancellable } from "./Gio.Cancellable.ts";
import { GioFile } from "./Gio.File.ts";
import { GioListModel } from "./Gio.ListModel.ts";
import { GLib } from "./GLib.ts";
import { GLibError } from "./GLib.Error.ts";
import { GLibMainContext } from "./GLib.MainContext.ts";
import { GObjectObject } from "./GObject.Object.ts";
import { Gtk } from "./Gtk.ts";
import { GtkFileDialog } from "./Gtk.FileDialog.ts";

const libPath = Deno.env.get("GTK_LIB") ?? getLibName();

export const lib = Deno.dlopen(libPath, {
  ...GioCancellable,
  ...GioFile,
  ...GioListModel,
  ...GLib,
  ...GLibError,
  ...GLibMainContext,
  ...GObjectObject,
  ...Gtk,
  ...GtkFileDialog,
});

if (Deno.env.has("GTK_DEBUG")) {
  const major = lib.symbols.gtk_get_major_version();
  const minor = lib.symbols.gtk_get_minor_version();
  const micro = lib.symbols.gtk_get_micro_version();

  console.log(`Gtk version: ${major}.${minor}.${micro}`);
}
