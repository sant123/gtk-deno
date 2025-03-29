import { GioCancellable } from "./Gio.Cancellable.ts";
import { GioFile } from "./Gio.File.ts";
import { GioListModel } from "./Gio.ListModel.ts";
import { GLib } from "./GLib.ts";
import { GLibError } from "./GLib.Error.ts";
import { GLibMainContext } from "./GLib.MainContext.ts";
import { GObjectObject } from "./GObject.Object.ts";
import { Gtk } from "./Gtk.ts";
import { GtkFileDialog } from "./Gtk.FileDialog.ts";

export const lib = Deno.dlopen("libgtk-4.so", {
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
