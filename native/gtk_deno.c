#include "gtk-deno/export.h"
#include "gtk-deno/loop.h"
#include <gtk/gtk.h>
#include <string.h>

GTK_DENO void main_gtk_init(void) {
  gtk_init();
}

static void print_hello(GtkWidget *widget, gpointer data) {
  g_print("Hello World\n");
  main_loop_quit();
}

static void activate(GtkApplication *app, gpointer user_data) {
  GtkWidget *window;
  GtkWidget *button;
  GtkWidget *box;

  window = gtk_application_window_new(app);
  gtk_window_set_title(GTK_WINDOW(window), "Window");
  gtk_window_set_default_size(GTK_WINDOW(window), 200, 200);

  box = gtk_box_new(GTK_ORIENTATION_VERTICAL, 0);
  gtk_widget_set_halign(box, GTK_ALIGN_CENTER);
  gtk_widget_set_valign(box, GTK_ALIGN_CENTER);

  gtk_window_set_child(GTK_WINDOW(window), box);

  button = gtk_button_new_with_label("Hello World");

  g_signal_connect(button, "clicked", G_CALLBACK(print_hello), NULL);
  g_signal_connect_swapped(button, "clicked", G_CALLBACK(gtk_window_destroy),
                           window);

  gtk_box_append(GTK_BOX(box), button);

  gtk_window_present(GTK_WINDOW(window));
}

gboolean run_app_main(gpointer _) {
  GtkApplication *app;

  app = gtk_application_new("gtk.deno.example", G_APPLICATION_DEFAULT_FLAGS);
  g_signal_connect(app, "activate", G_CALLBACK(activate), NULL);
  g_application_register(G_APPLICATION(app), NULL, NULL);
  g_application_activate(G_APPLICATION(app));

  return false;
}

GTK_DENO void worker_run_app(void) {
  g_main_context_invoke(NULL, run_app_main, NULL);
}
