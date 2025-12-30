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
exports.generarCombinacionRandomII = exports.rutaSonido2 = exports.rutaSonido = void 0;
const path = __importStar(require("path"));
const procesar_BTC_1 = require("./procesar/procesar_BTC");
//import { procesar_TRON } from "./procesar/procesar_TRON";
const generarFraseValida_1 = require("./generarFrase/generarFraseValida");
//ruta del sonido
exports.rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
exports.rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");
// -------------------------------------------------------------
// Función principal para generar combinaciones
const generarCombinacionRandomII = async () => {
    //   let indices = leerSeguimientoIndice();
    // Bucle para generar combinaciones
    while (true) {
        //Generar frase semilla random ya validada
        const semillas = (0, generarFraseValida_1.generarFraseValida)();
        //procesar todo de BTC y TRON
        await Promise.all([
            (0, procesar_BTC_1.procesar_BTC)(semillas),
            //procesar_TRON(semillas),
        ]);
    }
};
exports.generarCombinacionRandomII = generarCombinacionRandomII;
