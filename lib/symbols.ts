import { GioCancellable } from "./modules/Gio.Cancellable.ts";
import { GioFile } from "./modules/Gio.File.ts";
import { GioListModel } from "./modules/Gio.ListModel.ts";
import { GLib } from "./modules/GLib.ts";
import { GLibError } from "./modules/GLib.Error.ts";
import { GLibMainContext } from "./modules/GLib.MainContext.ts";
import { GObjectObject } from "./modules/GObject.Object.ts";
import { Gtk } from "./modules/Gtk.ts";
import { GtkFileDialog } from "./modules/Gtk.FileDialog.ts";

export const symbols = {
  ...GioCancellable,
  ...GioFile,
  ...GioListModel,
  ...GLib,
  ...GLibError,
  ...GLibMainContext,
  ...GObjectObject,
  ...Gtk,
  ...GtkFileDialog,
};
