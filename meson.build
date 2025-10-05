project('gtk-deno', 'c', version: '0.1.0', default_options: ['c_std=c23'])

gtkdep = dependency('gtk4', required: true) # uses pkg-config under the hood

executable('example', 'native/example.c', dependencies: [gtkdep])

lib_inc = include_directories('native/include')

sources = files('native/gtk_deno.c', 'native/src/core.c', 'native/src/loop.c')

shared_library(
  'gtk_deno',
  sources,
  include_directories: lib_inc,
  dependencies: [gtkdep],
  c_args: ['-fvisibility=hidden', '-DGTK_DENO_BUILDING_DLL'],
)