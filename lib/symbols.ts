import { GioApplication } from "./modules/Gio.Application.ts";
import { GioCancellable } from "./modules/Gio.Cancellable.ts";
import { GioFile } from "./modules/Gio.File.ts";
import { GioListModel } from "./modules/Gio.ListModel.ts";
import { GioListStore } from "./modules/Gio.ListStore.ts";
import { GLib } from "./modules/GLib.ts";
import { GLibError } from "./modules/GLib.Error.ts";
import { GLibMainContext } from "./modules/GLib.MainContext.ts";
import { GObject } from "./modules/GObject.ts";
import { GObjectObject } from "./modules/GObject.Object.ts";
import { Gtk } from "./modules/Gtk.ts";
import { GtkApplication } from "./modules/Gtk.Application.ts";
import { GtkApplicationWindow } from "./modules/Gtk.ApplicationWindow.ts";
import { GtkFileDialog } from "./modules/Gtk.FileDialog.ts";
import { GtkFileFilter } from "./modules/Gtk.FileFilter.ts";
import { GtkWindow } from "./modules/Gtk.Window.ts";

export const symbols = {
  ...GioApplication,
  ...GioCancellable,
  ...GioFile,
  ...GioListModel,
  ...GioListStore,
  ...GLib,
  ...GLibError,
  ...GLibMainContext,
  ...GObject,
  ...GObjectObject,
  ...Gtk,
  ...GtkApplication,
  ...GtkApplicationWindow,
  ...GtkFileDialog,
  ...GtkFileFilter,
  ...GtkWindow,
  gdk_display_get_default: {
    parameters: [],
    result: "pointer",
  },
  gdk_display_get_clipboard: {
    parameters: ["pointer"],
    result: "pointer",
  },
  gdk_clipboard_set_text: {
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  gdk_clipboard_store_async: {
    parameters: ["pointer", "i32", "pointer", "pointer", "pointer"],
    result: "void",
  },
  gdk_clipboard_store_finish: {
    parameters: ["pointer", "pointer", "pointer"],
    result: "bool",
  },
} satisfies Deno.ForeignLibraryInterface;
