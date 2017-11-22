module.exports = Juego;

const {AlertDialog} = require("tabris");

/***************************************************************************************
 * Objeto Objeto
 * Param: {tamano,color}
 * Methods: choca que recibe como parámetro un objeto y devuelve verdadero
 * si hay colisión entre ellos, en caso contrario falso.
 * dibujar que es la rutina básica de dibujo de todos los objetos
 ***************************************************************************************/
var Objeto = function(o) {
    this.tamano = o.tamano;
    this.color = o.color;
    this.choca = function(obj) {
        var diferenciaX = Math.abs(this.x - obj.x);
        var diferenciaY = Math.abs(this.y - obj.y);
        return (diferenciaX >= 0 &&
            diferenciaX < this.tamano &&
            diferenciaY >= 0 &&
            diferenciaY < this.tamano);
    }
}
// obj = {ctx,width,height}
Objeto.prototype.dibujar = function(obj) {
    this.width = obj.width;
    this.height = obj.height;
    obj.ctx.fillStyle = this.color;
    obj.ctx.fillRect(this.x, this.y, this.tamano, this.tamano);
}

/****************************************************************************************
 *  Objeto Snake
 *  Param:  {x,y,tamano,color}
 *  Methods: setXY para establecer las nuevas coordenadas. nuevaCola para añadir
 *  un objeto nuevo en la cola. getCola para obtener la cola. dibujar que redefine
 *  el método de su padre Objeto
 *  La clave del movimiento de la serpiente está en el la recursividad conseguida
 *  con el puntero cola. Conseguimos una lista enlazada de objetos Snake. El
 *  movimiento se consigue al asignar la posición del anterior al siguiente en la
 *  cola.
 ****************************************************************************************/
var Snake = function(o) {
    Objeto.call(this, o);
    this.x = o.x;
    this.y = o.y;
    this.cola = null;
    // A la cola le ponemos la coordenada que tiene su antecesor antes de
    // asignar las nuevas coordenadas.
    this.setXY = function(x, y) {
        if (this.cola != null) this.cola.setXY(this.x, this.y);
        this.x = x;
        this.y = y;
    }
        // Si es la última cola le añadimos una nueva. Si no llamamos otra vez al
        // método de modo recursivo.
    this.nuevaCola = function() {
        if (this.cola == null) {
            this.cola = new Snake({
                x: this.x,
                y: this.y,
                tamano: this.tamano,
                color: this.color
            });
        } else {
            this.cola.nuevaCola();
        }
    }
    this.getCola = function() {
        return this.cola;
    }
}
Snake.prototype = Object.create(Objeto.prototype);
Snake.prototype.constructor = Snake;
// Si hay cola, se llama a esta para que se dibuje
// obj = {ctx,width,height}
Snake.prototype.dibujar = function(obj) {
    if (this.cola != null) this.cola.dibujar(obj)
    Objeto.prototype.dibujar.call(this, obj);
}

/********************************************************************************************
 * Objeto Comida
 * Param: {x,y,tamano,color}
 * Methods: aleatorio para dar coordenadas aleatorias dentro del canvas y
 * nuevoSitio para asignar las coordenadas a las variables.
 */
var Comida = function(o) {
    Objeto.call(this, o);
    this.x = o.x;
    this.y = o.y;
    this.aleatorio = function() {
        return {
            x: (Math.random() * (this.width / this.tamano) | 0) * this.tamano,
            y: (Math.random() * (this.height / this.tamano) | 0) * this.tamano
        }
    }
    this.nuevoSitio = function() {
        var dim = this.aleatorio();
        this.x = dim.x;
        this.y = dim.y;
    }
}
Comida.prototype = Object.create(Objeto.prototype);
Comida.prototype.constructor = Comida;

/**********************************************************************************************
 * Objeto Juego:
 * Es el que controla la dinámica del juego y las relaciones entre la comida y la
 * serpiente y entre la serpiente y los bordes.
 * Se encarga de crear los objetos Comida y Snake.
 * obj = {tamano,color,velocidad}
 **********************************************************************************************/
function Juego(obj) {
    this.velocidad = obj.velocidad || 0.2;
    this._velOrigen = this.velocidad;
    this.tamano = obj.tamano || 10;
    this.color = obj.color || "#fff";
    this.isActivo = false;
    this.sierpe = new Snake({
        x: 50,
        y: 70,
        tamano: this.tamano,
        color: "#000000"
    });
    this.comida = new Comida({
        x: 200,
        y: 300,
        tamano: this.tamano,
        color: "#ff0000"
    });
    this.puntos = 0;
    this.dirX = true;
    this.dirY = true;
    this.incX = 0;
    this.incY = 0;
    this.animacion = null;
    var _this = this;
        // Choca la serpiente consigo misma?
        // Para saberlo compruebo que colisionan la cabeza(sierpe) con 
        // alguna de sus colas.
    this.autoChoque = function() {
        var temp = null;
        // Hay que atrapar el error al conseguir la cola por si no hay
        try {
            temp = this.sierpe.getCola().getCola();
        } catch (err) {
            temp = null;
        }
        // mientras haya cola hay que comprobar las colisiones
        while (temp != null) {
            if (this.sierpe.choca(temp)) {
                this.fin();
            } else {
                temp = temp.getCola();
            }
        }
    }
        // Choca la serpiente contra la pared?
    this.paredChoque = function() {
        if (this.sierpe.x < 0 ||
            this.sierpe.x > (this.width - this.sierpe.tamano) ||
            this.sierpe.y < 0 ||
            this.sierpe.y > (this.height - this.sierpe.tamano)) {
            this.fin();
        }
    }
    this.dibujar = function() {
        this.ctx.fillStyle = this.color;
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.sierpe.dibujar({
            ctx: this.ctx,
            width: this.width, 
            height: this.height
        });
        this.comida.dibujar({
            ctx: this.ctx, 
            width: this.width, 
            height: this.height
        });
    }
    this.mover = function() {
        var nx = this.sierpe.x + this.incX;
        var ny = this.sierpe.y + this.incY;
        this.sierpe.setXY(nx, ny);
    }
    this.addPunto = function() {
        this.puntos += 1;
    }
    this.resetPunto = function() {
        this.puntos = 0;
    }
    this.fps = function() {
        return 1000 * _this.velocidad; // 1000 ms
    }
    this.loop = function(ctx, width, height) {
        _this.ctx = ctx;
        _this.width = width;
        _this.height = height;
        _this.comida.width = _this.width;
        _this.comida.height = _this.height;
        _this.sierpe.width = _this.width;
        _this.sierpe.height = _this.height;
        _this.comida.nuevoSitio();
        if (!_this.isActivo){
            _this.isActivo = true;
            _this._loop();
        }
    }
    // ciclo principal de dibujado y actualización
    // basado en setTimeout
    this._loop = function() {
        _this.autoChoque();
        _this.paredChoque();
        _this.dibujar();
        _this.mover();
        if (_this.sierpe.choca(_this.comida)) {
            _this.comida.nuevoSitio();
            _this.sierpe.nuevaCola();
            _this.addPunto();
            if (_this.fps() > 0){
                _this.velocidad -= 0.02;
            }
        }
        _this.animacion = setTimeout(_this._loop, _this.fps());
    }
        // Gracias al evento de los botones puedo modificar las variables
        // de dirección dirX y dirY y los incrementos para las coordenadas
        // incX e incY
        // La dirección marcar el eje por el que se puede mover y los incrementos
        // determinan los nuevos valores de las coordenadas que vienen dados por
        // el tamaño, tanto en valores positivos como negativos dependiendo de la
        // dirección
    this.evento = function(evt) {
        var cod = evt;
        // si está en el eje X sólo puede moverse en el eje Y
        if (_this.dirX) {
            if (cod == "Arriba") { // flecha arriba
                _this.incY = -_this.tamano;
                _this.incX = 0;
                _this.dirX = false;
                _this.dirY = true;
            }
            if (cod == "Abajo") { // flecha abajo
                _this.incY = _this.tamano;
                _this.incX = 0;
                _this.dirX = false;
                _this.dirY = true;
            }
        }
        // si está en el eje Y sólo puede moverse en el eje X
        if (_this.dirY) {
            if (cod == "Izda") { // flecha izquierda
                _this.incY = 0;
                _this.incX = -_this.tamano;
                _this.dirY = false;
                _this.dirX = true;
            }
            if (cod == "Dcha") { // flecha derecha
                _this.incY = 0;
                _this.incX = _this.tamano;
                _this.dirY = false;
                _this.dirX = true;
            }
        }
    }
    this.fin = function() {
        this.incX = 0;
        this.incY = 0;
        this.dirX = true;
        this.dirY = true;
        this.sierpe = new Snake({
            x: 50,
            y: 70,
            tamano: this.tamano,
            color: "#000000"
        });
        this.comida = new Comida({
            x: 200,
            y: 300,
            tamano: this.tamano,
            color: "#ff0000"
        });
        this.isActivo = false;
        let dialog = new AlertDialog({
            message: "¡¡ Perdiste !!\nCon " + this.puntos + " puntos.",
            buttons: {ok: "Entendido"}
        });
        dialog.open();
        this.velocidad = this._velOrigen;
        clearTimeout(this.animacion);
        this.resetPunto();
    }
}

