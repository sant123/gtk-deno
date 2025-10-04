project('gtk-deno', 'c', default_options: ['c_std=c23'])

gtk4 = dependency('gtk4')  # uses pkg-config under the hood

executable('app', 'main.c', dependencies: [gtk4])
executable('gtk_host', 'gtk_host.c', dependencies: [gtk4])
