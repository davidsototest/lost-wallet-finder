"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fixedBox = exports.screen = void 0;
const blessed_1 = __importDefault(require("blessed"));
// Crear la pantalla principal
exports.screen = blessed_1.default.screen({
    smartCSR: true,
    title: 'Interfaz de Consola',
});
// Crear el área de salida desplazable
const logBox = blessed_1.default.box({
    top: 0,
    left: 0,
    width: '100%',
    height: '100%-1',
    tags: true,
    scrollable: true,
    alwaysScroll: true,
    scrollbar: {
        ch: ' ',
        // bg: 'blue',
    },
    border: {
        type: 'line',
    },
    style: {
        fg: 'white',
        bg: 'black',
        border: {
            fg: '#f0f0f0',
        },
    },
});
// Crear la caja fija en la parte inferior
exports.fixedBox = blessed_1.default.box({
    bottom: 0,
    left: 0,
    width: '100%',
    height: 1,
    content: 'Mensaje fijo en la parte inferior',
    style: {
        fg: 'white',
        bg: 'blue',
    },
});
// Añadir los elementos a la pantalla
exports.screen.append(logBox);
exports.screen.append(exports.fixedBox);
// Renderizar la pantalla
exports.screen.render();
// Función para agregar mensajes al log
function log(message) {
    logBox.pushLine(message);
    logBox.setScrollPerc(100); // Desplazar hacia abajo
    exports.screen.render();
}
// Redefinir console.log para usar la función log
console.log = log;
// Manejar la salida del programa
exports.screen.key(['C-c'], () => process.exit(0));
