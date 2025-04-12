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
// index.ts
const bip39 = __importStar(require("bip39"));
const bip32_1 = require("bip32");
const ecc = __importStar(require("tiny-secp256k1"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
// Reemplaza la siguiente cadena por tus 12 palabras separadas por espacio
const mnemonic = "sort ahead squirrel ridge mouse pear crawl bleak comfort perfect cloth result";
// Valida que el mnemonic sea correcto
if (!bip39.validateMnemonic(mnemonic)) {
    console.error("El mnemonic proporcionado no es válido.");
    process.exit(1);
}
// Convierte el mnemonic a una semilla (seed)
const seed = bip39.mnemonicToSeedSync(mnemonic);
// Inicializa bip32 con tiny-secp256k1
const bip32 = (0, bip32_1.BIP32Factory)(ecc);
// Crea el nodo raíz a partir de la semilla, especificando la red Bitcoin (mainnet)
const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
// Deriva una ruta de ejemplo siguiendo el estándar BIP44, por ejemplo: m/44'/0'/0'/0/0
const derivationPath = "m/44'/0'/0'/0/0";
const child = root.derivePath(derivationPath);
// Genera la dirección pública en formato P2PKH (la dirección tradicional de Bitcoin)
const pubkeyBuffer = Buffer.from(child.publicKey);
const { address } = bitcoin.payments.p2pkh({
    pubkey: pubkeyBuffer,
    network: bitcoin.networks.bitcoin,
});
console.log("Dirección BTC generada:", address);
