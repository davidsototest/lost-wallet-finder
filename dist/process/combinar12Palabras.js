"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarCombinacion = void 0;
const diccionarioBIP39_1 = require("../data/diccionario/diccionarioBIP39");
const incrementArray_1 = require("../utils/incrementArray");
const procesar_BTC_1 = require("./procesar/procesar_BTC");
const bip39_ts_1 = require("bip39-ts");
/**
 * Genera combinaciones de palabras BIP39 entre un rango de índices
 * @param inicio Array de 12 números que indica el índice inicial
 * @param fin Array de 12 números que indica el índice final
 */
const generarCombinacion = async (inicio, fin) => {
    // Copiamos el array de inicio para manipularlo
    let indices = [...inicio];
    while (true) {
        // Mapeamos las palabras según los índices actuales
        const palabras = indices.map(i => diccionarioBIP39_1.diccionarioMezclado[i]);
        const semillas = palabras.join(" ");
        // Validar que la frase sea mnemónica válida
        if ((0, bip39_ts_1.validateMnemonic)(semillas)) {
            // Procesamos BTC (y TRON si quieres agregarlo)
            await (0, procesar_BTC_1.procesar_BTC)(semillas);
        }
        // Verificar si llegamos al fin
        let finAlcanzado = true;
        for (let i = 0; i < 12; i++) {
            if (indices[i] !== fin[i]) {
                finAlcanzado = false;
                break;
            }
        }
        if (finAlcanzado) {
            console.log("Se alcanzó el índice final. Combinaciones completadas.");
            break;
        }
        // Incrementar índices usando lógica de carry (base diccionario.length)
        indices = (0, incrementArray_1.incrementArray)(indices, 1);
    }
};
exports.generarCombinacion = generarCombinacion;
