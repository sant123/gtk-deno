# gtk-deno

Gtk4 widget bindings for Deno.

## Event-loop behavior

gtk-deno automatically services GLib while GTK-backed windows and dialogs are
alive; applications do not need to start or stop an event loop manually. The
integration always uses non-blocking GLib iterations and processes ready GLib
work in bounded batches. Active GLib work yields through a zero-delay timer so
Deno timers, promises, and I/O get regular event-loop turns; idle GLib polling
remains approximately every 16 ms.

Closing or disposing the final GTK-backed object stops the poll timer. Creating
a new object starts it again.

Run [`examples/EventLoop/GtkEventLoop.ts`](examples/EventLoop/GtkEventLoop.ts)
to observe GTK interaction alongside recurring Deno timers and promise
callbacks. It is intended for manual idle-CPU and responsiveness checks.

## Install

To install Gtk4 on your system, follow these steps:

### Fedora

```bash
sudo dnf install gtk4-devel
```

### Ubuntu

```bash
sudo apt install libgtk-4-dev
```

You can check which version you are using by running:

```bash
GTK_DEBUG= deno -E --allow-ffi jsr:@onyx/gtk
```

## Usage

### GtkFileDialog

This module contains 5 variants for selecting a file or folder:

#### GtkOpenFileDialog

```ts
import { GtkDialogResult, GtkOpenFileDialog } from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkOpenFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
```

#### GtkOpenMultipleFileDialog

```ts
import {
  GtkDialogResult,
  GtkOpenMultipleFileDialog,
} from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkOpenMultipleFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected files:", dialog.fileNames);
} else {
  console.log("No file choosen");
}
```

#### GtkSaveFileDialog

```ts
import { GtkDialogResult, GtkSaveFileDialog } from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkSaveFileDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
```

#### GtkSelectFolderDialog

```ts
import {
  GtkDialogResult,
  GtkSelectFolderDialog,
} from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkSelectFolderDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected folder:", dialog.selectedPath);
} else {
  console.log("No folder choosen");
}
```

#### GtkSelectMultipleFolderDialog

```ts
import {
  GtkDialogResult,
  GtkSelectMultipleFolderDialog,
} from "@onyx/gtk/GtkFileDialog";

using dialog = new GtkSelectMultipleFolderDialog();

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected folders:", dialog.selectedPaths);
} else {
  console.log("No folder choosen");
}
```

### GtkFileFilter

This module can be used with a file dialog variant:

```ts
import { GtkDialogResult, GtkOpenFileDialog } from "@onyx/gtk/GtkFileDialog";
import { GtkFileFilter } from "@onyx/gtk/GtkFileFilter";

using dialog = new GtkOpenFileDialog();

using patternJsonFilter = new GtkFileFilter();
patternJsonFilter.addPattern("*.json");

dialog.setDefaultFilter(patternJsonFilter);

if (await dialog.showDialog() === GtkDialogResult.OK) {
  console.log("Selected file:", dialog.fileName);
} else {
  console.log("No file choosen");
}
```

You can see more in the `examples` folder.

## Building

### Installing dependencies

You can use the Gtk4 submodule included in this repository. Follow these steps:

```bash
git clone https://github.com/sant123/gtk-deno
cd gtk-deno
git submodule update --init --recursive
cd third_party/gtk
```

#### Fedora

Install required tools:

```bash
sudo dnf install meson ninja-build
```

Install build dependencies for Gtk4:

```bash
sudo dnf builddep gtk4
```

If `builddep` is not available, you can install it with:

```bash
sudo dnf install dnf-plugins-core
```

### Preparing and compiling

Gtk4 uses Meson and Ninja for building:

```bash
meson setup builddir -Dbuildtype=release -Dprefix=/gtk4
```

This will take some time as it resolves dependencies found on your machine or
wrap files.

Compile the project:

```bash
meson compile -C builddir
```

This step will take longer, so be patient.

Install the compiled files:

```bash
meson install -C builddir --destdir=$(pwd)/../..
```

After installing, you should now have a `gtk4/` folder at the root of this
repository.

Go back to the project root:

```bash
cd ../..
```

### Testing your build

#### Fedora

You can test the freshly built Gtk4 version with:

```bash
GTK_DEBUG= GTK_LIB=gtk4/lib64/libgtk-4.so deno -E --allow-ffi lib/version.ts
```

This should print the Gtk4 version you just built.
