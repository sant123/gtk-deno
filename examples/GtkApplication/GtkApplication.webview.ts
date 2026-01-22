import { Webview } from "@webview/webview";
import { GtkApplication, GtkApplicationFlags } from "@onyx/gtk/GtkApplication";
import { GtkApplicationWindow } from "@onyx/gtk/GtkApplicationWindow";

const html = `\
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        font-family: system-ui, sans-serif;
        text-align: center;
      }

      .btn {
        background: #57e389;
        border-radius: 4px;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.5rem 1rem;
        width: 40px;
      }

      .btn:hover {
        background: #26a269;
      }

      .btn:disabled {
        background: #e01b24;
        cursor: not-allowed;
      }

      .buttons-container {
        display: flex;
        gap: 10px;
        justify-content: center;
      }

      .counter {
        font-size: 2rem;
        margin: 1rem 0 0;
      }
    </style>
  </head>
  <body>
    <h1>Hello from Gtk + Webview!</h1>
    <img src="https://www.gtk.org/assets/img/logo-gtk-sm.png" />
    <p>This is a simple example of embedding a webview in a Gtk application.</p>

    <div class="buttons-container">
      <button class="btn decrease">-</button>
      <button class="btn increase">+</button>
    </div>

    <p class="counter"></p>

    <script type="module">
      const increaseElement = document.querySelector('.increase');
      const decreaseElement = document.querySelector('.decrease');
      const counterElement = document.querySelector('.counter');

      let counter = 0;
      counterElement.textContent = counter;

      function minCount() {
        decreaseElement.disabled = counter === 0;
      }

      increaseElement.addEventListener('click', () => {
        counterElement.textContent = ++counter;
        minCount();
      });

      decreaseElement.addEventListener('click', () => {
        counterElement.textContent = --counter;
        minCount();
      });

      minCount();
    </script>
  </body>
</html>\
`;

const app = new GtkApplication(
  "org.gtk.example.deno",
  GtkApplicationFlags.G_APPLICATION_DEFAULT_FLAGS,
);

app.connect("activate", () => {
  const win = new GtkApplicationWindow(app);

  const webview = new Webview(
    false,
    undefined,
    win.getUnsafePointer(),
  );

  webview.navigate(`data:text/html,${encodeURIComponent(html)}`);

  win.title = "Gtk Webview Example";
  win.setDefaultSize(800, 600);
  win.present();
});

app.run();
