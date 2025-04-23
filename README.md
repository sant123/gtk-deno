# gtk-deno

Gtk4 bindings for Deno + widgets.

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
GTK_DEBUG= deno -E --allow-ffi lib/mod.ts
```

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

This will take some time as it resolves dependencies found on your machine or wrap files.

Compile the project:

```bash
meson compile -C builddir
```

This step will take longer, so be patient.

Install the compiled files:

```bash
meson install -C builddir --destdir=$(pwd)/../..
```

After installing, you should now have a `gtk4/` folder at the root of this repository.

Go back to the project root:

```bash
cd ../..
```

### Testing your build

#### Fedora

You can test the freshly built Gtk4 version with:

```bash
GTK_DEBUG= GTK_LIB=gtk4/lib64/libgtk-4.so deno -E --allow-ffi lib/mod.ts
```

This should print the Gtk4 version you just built.
