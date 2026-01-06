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
exports.generarWallet_BTC_Taproot = void 0;
const bip39 = __importStar(require("bip39"));
const bip32_1 = require("bip32");
const ecc = __importStar(require("tiny-secp256k1"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const bip32 = (0, bip32_1.BIP32Factory)(ecc);
bitcoin.initEccLib(ecc);
const NETWORK = bitcoin.networks.bitcoin;
// Función que recibe una frase mnemotécnica y retorna la billetera Taproot
const generarWallet_BTC_Taproot = (mnemonic) => {
    // Validar la frase mnemotécnica
    if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error("Frase mnemotécnica inválida");
    }
    // Generar la semilla y la clave raíz
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, NETWORK);
    // Utilizar el path BIP86 para Taproot
    const path = "m/86'/0'/0'/0/0";
    const child = root.derivePath(path);
    // Obtener la clave pública en formato x-only
    const xOnlyPubkey = child.publicKey.slice(1, 33);
    // Generar la dirección Taproot (P2TR)
    const { address } = bitcoin.payments.p2tr({
        internalPubkey: xOnlyPubkey,
        network: NETWORK,
    });
    if (!address || !address.startsWith("bc1p")) {
        throw new Error("Error al generar la dirección Taproot");
    }
    return {
        Direccion: address,
        Clave_privada: child.toWIF(),
    };
};
exports.generarWallet_BTC_Taproot = generarWallet_BTC_Taproot;
