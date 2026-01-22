project('gtk-deno', 'c', version: '0.1.0', default_options: ['c_std=c23'])

gtkdep = dependency('gtk4', required: true) # uses pkg-config under the hood

executable('example', 'native/example.c', dependencies: [gtkdep])