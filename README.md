# gtk-deno

Gtk4 bindings for Deno + widgets

## Install

For installing Gtk4 on your distribution follow these steps:

### Fedora

- `sudo dnf install gtk4-devel`

You can check which version your are using this way:

- `GTK_DEBUG= deno -E --allow-ffi lib/mod.ts`

## Building

### Installing dependencies

You can use Gtk4 submodule present in this repository, please follow these steps:

- `git clone https://github.com/sant123/gtk-deno`
- `git submodule update --init --recursive`

#### Fedora

- `sudo dnf install meson ninja-build`
- `sudo dnf builddep gtk4`

If `builddep` isn't available, install it first:

- `sudo dnf install dnf-plugins-core`

### Prepare and compile

Gtk4 uses meson and ninja for building:

- `meson configure builddir -Dbuildtype=release -Dprefix=/gtk4`
- `meson setup builddir`

`setup` will take sometime while it resolve dependencies found in your machine or wrap files.

- `meson compile -C builddir`

`compile` will take longer, so be patient.

- `meson install -C builddir --destdir=$(pwd)/../..`

After installing you should now have a gtk4 folder in the root of this repository. So now you can run:

#### Fedora

- `GTK_DEBUG= GTK_LIB=gtk4/lib64/libgtk-4.so deno -E --allow-ffi lib/mod.ts`

This will print the Gtk4 version recently built.
