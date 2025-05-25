"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarCombinacion = exports.rutaSonido2 = exports.rutaSonido = void 0;
const path = __importStar(require("path"));
const bip39 = __importStar(require("bip39"));
const leerSeguimientoIndice_1 = require("./leer/leerSeguimientoIndice");
const escribirSeguimientoIndice_1 = require("./guardar/escribirSeguimientoIndice");
const diccionarioBIP39_1 = require("../data/diccionario/diccionarioBIP39");
const guardarSeguimientoHistorico_1 = require("./guardar/guardarSeguimientoHistorico");
const procesar_BTC_1 = require("./procesar/procesar_BTC");
const procesar_TRON_1 = require("./procesar/procesar_TRON");
//ruta del sonido
exports.rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
exports.rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");
// -------------------------------------------------------------
// Función principal para generar combinaciones
const generarCombinacion = async () => {
    let indices = (0, leerSeguimientoIndice_1.leerSeguimientoIndice)();
    // Bucle para generar combinaciones
    while (true) {
        //mapeo cada palabra segun el indice guardado
        const palabras = indices.map((i) => diccionarioBIP39_1.diccionarioMezclado[i]);
        //separo las palabras por un espacio
        const semillas = palabras.join(" ");
        //valdiar que la frase sea valida
        if (!bip39.validateMnemonic(semillas)) {
            // console.warn(`Frase mnemónica inválida: ${semillas}`);
            // Incrementar el índice para la siguiente combinación
            for (let i = indices.length - 1; i >= 0; i--) {
                indices[i]++;
                if (indices[i] < diccionarioBIP39_1.diccionarioMezclado.length) {
                    break;
                }
                else {
                    indices[i] = 0;
                    if (i === 0) {
                        console.log("Se han generado todas las combinaciones posibles.");
                        return;
                    }
                }
            }
            (0, escribirSeguimientoIndice_1.escribirSeguimientoIndice)(indices);
            (0, guardarSeguimientoHistorico_1.guardarSeguimientoHistorico)(indices);
            continue; // Saltar a la siguiente iteración
        }
        ;
        //procesar todo de BTC y TRON
        await Promise.all([
            (0, procesar_BTC_1.procesar_BTC)(semillas),
            (0, procesar_TRON_1.procesar_TRON)(semillas),
        ]);
        // Incrementar como un contador en base diccionarioMezclado.length
        for (let i = indices.length - 1; i >= 0; i--) {
            indices[i]++;
            if (indices[i] < diccionarioBIP39_1.diccionarioMezclado.length) {
                break; // No hay overflow, salir
            }
            else {
                indices[i] = 0; // Resetear y seguir con el siguiente a la izquierda
                if (i === 0) {
                    console.log("Se han generado todas las combinaciones posibles.");
                    return;
                }
            }
        }
        ;
        (0, escribirSeguimientoIndice_1.escribirSeguimientoIndice)(indices);
        (0, guardarSeguimientoHistorico_1.guardarSeguimientoHistorico)(indices);
    }
};
exports.generarCombinacion = generarCombinacion;
