const {
    ui,
    Canvas,
    Button,
    Composite,
    TextView,
    device
} = require('tabris');

const Juego = require('./snake');

let elJuego = new Juego({
    velocidad: 0.3,
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

let anchuraBoton = function() {
    let orient = device.orientation.split("-")[0];
    return (orient === "portrait") ?
        (screen.width / 4) :
        (screen.width / 5);
}

ui.drawer.enabled = true;
ui.drawer.on("open", () => {
    ui.drawer.find("#titulo").animate({
        transform: {
            scaleX: 1.5,
            scaleY: 1.5
        }
    }, {
        delay: 500,
        duration: 1000,
        repeat: 1,
        reverse: true,
        easing: "ease-out"
    })
});

new TextView({
    left: 0,
    id: "titulo",
    top: 30,
    right: 0,
    text: "The Snake",
    font: "30px bold monospace",
    alignment: "center",
    textColor: "#800"
}).appendTo(ui.drawer);

new Button({
    left: 5,
    right: 5,
    top: "prev() 30",
    background: "#800",
    textColor: "#FFF",
    text: "LENTO"
}).on("select", () => {
    elJuego.velocidad = 0.5;
    ui.drawer.close();
}).appendTo(ui.drawer);

new Button({
    left: 5,
    right: 5,
    top: 'prev() 5',
    background: "#800",
    textColor: "#FFF",
    text: "NORMAL"
}).on("select", () => {
    elJuego.velocidad = 0.3;
    ui.drawer.close();
}).appendTo(ui.drawer);

new Button({
    left: 5,
    right: 5,
    top: 'prev() 5',
    background: "#800",
    textColor: "#FFF",
    text: "RÁPIDO"
}).on("select", () => {
    elJuego.velocidad = 0.1;
    ui.drawer.close();
}).appendTo(ui.drawer);

new TextView({
    top: "prev() 30",
    left: 5,
    right: 5,
    textColor: "#800",
    text: "El típico juego de la serpiente. En realidad es un programa para probar el framework Tabris.js. Siéntete libre para ponerlo a prueba. Agradezco la información de fallos y las sugerencias."
}).appendTo(ui.drawer);

let botones = new Composite({
    left: 0,
    bottom: 0,
    right: 0,
    id: "botones",
    background: "#800"
}).on("resize", () => {
    botones.children("Button").set("width", anchuraBoton());
    botones.children("Button")[2].set("right", anchuraBoton());
    botones.children("Button")[1].set("left", anchuraBoton());
}).appendTo(ui.contentView);

new Button({
    left: 0,
    top: 0,
    width: anchuraBoton(),
    font: "bold 20px",
    text: String.fromCharCode(8592)
}).on('select', () => elJuego.evento("Izda")).appendTo(botones);
new Button({
    left: anchuraBoton(),
    top: 0,
    width: anchuraBoton(),
    font: "bold 20px",
    text: String.fromCharCode(8593)
}).on('select', () => elJuego.evento("Arriba")).appendTo(botones);
new Button({
    right: anchuraBoton(),
    top: 0,
    width: anchuraBoton(),
    font: "bold 20px",
    text: String.fromCharCode(8595)
}).on('select', () => elJuego.evento("Abajo")).appendTo(botones);
new Button({
    right: 0,
    top: 0,
    width: anchuraBoton(),
    font: "bold 20px",
    text: String.fromCharCode(8594)
}).on('select', () => elJuego.evento("Dcha")).appendTo(botones);

ui.drawer.open();
