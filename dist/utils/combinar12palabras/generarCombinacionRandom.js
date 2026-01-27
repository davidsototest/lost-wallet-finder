"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarCombinacionRandom = void 0;
const bip39_ts_1 = require("bip39-ts");
const diccionarioBIP39_1 = require("../../data/diccionario/diccionarioBIP39");
const procesar_BTC_1 = require("../procesar/procesar_BTC");
const crypto_1 = __importDefault(require("crypto"));
const generarCombinacionRandom = async () => {
    const TOTAL_PALABRAS = diccionarioBIP39_1.diccionarioMezclado.length; // 2048
    while (true) {
        // 1️⃣ Crear 12 índices aleatorios
        const indices = [];
        for (let i = 0; i < 12; i++) {
            indices.push(crypto_1.default.randomInt(0, TOTAL_PALABRAS));
        }
        // 2️⃣ Convertir a palabras
        const palabras = indices.map(i => diccionarioBIP39_1.diccionarioMezclado[i]);
        const semilla = palabras.join(" ");
        // 3️⃣ Validar
        if ((0, bip39_ts_1.validateMnemonic)(semilla)) {
            await (0, procesar_BTC_1.procesar_BTC)(semilla);
        }
    }
};
exports.generarCombinacionRandom = generarCombinacionRandom;
