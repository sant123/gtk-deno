import { GtkApplication, GtkApplicationFlags } from "@onyx/gtk/GtkApplication";
import { GtkApplicationWindow } from "@onyx/gtk/GtkApplicationWindow";

const app = new GtkApplication(
  "org.gtk.example",
  GtkApplicationFlags.G_APPLICATION_DEFAULT_FLAGS,
);

app.connect("activate", () => {
  const win = new GtkApplicationWindow(app);

  win.title = "Window";
  win.setDefaultSize(200, 200);
  win.present();
});

app.run();
