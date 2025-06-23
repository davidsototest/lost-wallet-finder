"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesar_BTC = void 0;
const __1 = require("../..");
const consultarSaldoWallet_1 = require("../../consultas/consultarSaldoWallet");
const generarWallet_BTC_NativeSegWit_1 = require("../generarWalletsBTC/generarWallet_BTC_NativeSegWit");
const generarWallet_BTC_legacy_1 = require("../generarWalletsBTC/generarWallet_BTC_legacy");
const ValidarSaldo_1 = require("../validarElSaldo/ValidarSaldo");
// funcion para procesar todo de BTC
const procesar_BTC = async (semillas) => {
    // generar wallets
    const wallet_BTC_sergit = (0, generarWallet_BTC_NativeSegWit_1.generarWallet_BTC_NativeSegWit_P2WPKH)(semillas);
    const wallet_BTC_legacy = (0, generarWallet_BTC_legacy_1.generarWallet_BTC_Legacy)(semillas);
    // console.log(semillas);
    // consultar saldo de ambas
    const saldoWallet_BTC_sergit = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet_BTC_sergit.Direccion);
    const saldoWallet_BTC_legacy = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet_BTC_legacy.Direccion);
    //valido los saldos, guardo y aviso
    await (0, ValidarSaldo_1.ValidarSaldoWallet)(saldoWallet_BTC_sergit, semillas, wallet_BTC_sergit);
    await (0, ValidarSaldo_1.ValidarSaldoWallet)(saldoWallet_BTC_legacy, semillas, wallet_BTC_legacy);
    console.clear();
    console.log(`Wallets consultadas: ${__1.contador}`);
    console.log(`Wallets con saldo: ${__1.walletsConCashVar}`);
    // console.log(`Wallet_Legacy: ${wallet_BTC_legacy.Direccion} > Saldo: ${saldoWallet_BTC_legacy.confirmed + saldoWallet_BTC_legacy.unconfirmed}`);
    // console.log(`Wallet_Sergit: ${wallet_BTC_sergit.Direccion} > Saldo: ${saldoWallet_BTC_sergit.confirmed + saldoWallet_BTC_sergit.unconfirmed}`);
    // console.log("----------------------------------------------------------------");
};
exports.procesar_BTC = procesar_BTC;
