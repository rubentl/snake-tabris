const {
    ui,
    Canvas,
    Button,
    Composite
} = require('tabris');

const Juego = require('./snake');

let elJuego = new Juego({
    velocidad: 0.5,
    tamano: 10,
    color: "#ddd"
});

let canvas = new Canvas({
    id: 'canvasGame',
    left: 0,
    top: 0,
    right: 0,
    bottom: "#botones"
}).on("resize", ({
    target: canvas,
    width,
    height
}) => {
    let ctx = canvas.getContext("2d", width, height);
    elJuego.loop(ctx, width, height);
}).appendTo(ui.contentView);


let anchuraBoton = screen.width / 4;

let botones = new Composite({
    left: 0,
    bottom: 0,
    id: "botones",
    background: "#800"
}).appendTo(ui.contentView);

new Button({
    left: 0,
    top: 0,
    width: anchuraBoton,
    text: 'Izda'
}).on('select', () => elJuego.evento("Izda"))
  .appendTo(botones);
new Button({
    left: anchuraBoton + 2,
    top: 0,
    width: anchuraBoton,
    text: 'Arriba'
}).on('select', () => elJuego.evento("Arriba"))
  .appendTo(botones);
new Button({
    left: (2 * anchuraBoton) + 2,
    top: 0,
    width: anchuraBoton,
    text: 'Abajo'
}).on('select', () => elJuego.evento("Abajo"))
  .appendTo(botones);
new Button({
    left: (3 * anchuraBoton) + 2,
    top: 0,
    width: anchuraBoton,
    text: 'Dcha'
}).on('select', () => elJuego.evento("Dcha"))
  .appendTo(botones);
