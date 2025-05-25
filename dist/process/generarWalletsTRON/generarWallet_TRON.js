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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generarWallets_TRON = void 0;
const bip39 = __importStar(require("bip39"));
const bip32_1 = require("bip32");
const ecc = __importStar(require("tiny-secp256k1"));
const bitcoin = __importStar(require("bitcoinjs-lib"));
const ecpair_1 = __importDefault(require("ecpair"));
const ethUtil = __importStar(require("ethereumjs-util"));
const buffer_1 = require("buffer");
const bip32 = (0, bip32_1.BIP32Factory)(ecc);
const ECPair = (0, ecpair_1.default)(ecc);
const generarWallets_TRON = (mnemonic) => {
    if (!bip39.validateMnemonic(mnemonic))
        throw new Error("Mnemónico inválido");
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed);
    const wallets = [];
    const PURPOSE = 44 + 0x80000000;
    const COIN_TYPE = 195 + 0x80000000;
    const ACCOUNT = 0 + 0x80000000;
    const CHANGE = 0;
    for (let n = 0; n < 1; n++) {
        const node = root
            .derive(PURPOSE)
            .derive(COIN_TYPE)
            .derive(ACCOUNT)
            .derive(CHANGE)
            .derive(n);
        // Aquí usamos ECPair de ecpair en lugar de bitcoin.ECPair
        const keyPair = ECPair.fromPrivateKey(node.privateKey, { compressed: false });
        // … cálculo de dirección igual que antes …
        const pubkeyBuffer = buffer_1.Buffer.from(keyPair.publicKey);
        const ethPubkey = ethUtil.importPublic(pubkeyBuffer);
        const addrBuf = ethUtil.publicToAddress(ethPubkey);
        const address = bitcoin.address.toBase58Check(addrBuf, 0x41);
        const privHex = keyPair.privateKey.toString();
        wallets.push({ Direccion: address, Clave_privada: privHex });
    }
    return wallets;
};
exports.generarWallets_TRON = generarWallets_TRON;
