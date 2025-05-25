"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarFraseValida = void 0;
const diccionarioBIP39_1 = require("../../data/diccionario/diccionarioBIP39");
const bip39_ts_1 = require("bip39-ts");
// Configuración inicial
const LONGITUD_DICCIONARIO = diccionarioBIP39_1.diccionarioMezclado.length;
const PALABRAS_POR_FRASE = 12;
// Generar frase aleatoria VÁLIDA (con checksum BIP39)
const generarFraseValida = () => {
    let frase;
    do {
        // 1. Crear array de 12 palabras aleatorias
        const palabras = Array.from({ length: PALABRAS_POR_FRASE }, () => diccionarioBIP39_1.diccionarioMezclado[Math.floor(Math.random() * LONGITUD_DICCIONARIO)]);
        // 2. Unir en una sola cadena
        frase = palabras.join(" ");
        // 3. Repetir mientras no sea un mnemonic válido
    } while (!(0, bip39_ts_1.validateMnemonic)(frase)); // ← validateMnemonic retorna true si el checksum es correcto :contentReference[oaicite:0]{index=0}
    return frase;
};
exports.generarFraseValida = generarFraseValida;
