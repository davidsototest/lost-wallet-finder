"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesar_BTC = void 0;
const consultarSaldoWallet_1 = require("../../services/consultarSaldoWallet");
const delay_1 = require("../delay");
const generarWallet_BTC_NativeSegWit_1 = require("../generarWalletsBTC/generarWallet_BTC_NativeSegWit");
const generarWallet_BTC_Taproot_1 = require("../generarWalletsBTC/generarWallet_BTC_Taproot");
const generarWallet_BTC_Wrapped_P2SH_1 = require("../generarWalletsBTC/generarWallet_BTC_Wrapped_P2SH");
const generarWallet_BTC_legacy_1 = require("../generarWalletsBTC/generarWallet_BTC_legacy");
const ValidarSaldo_1 = require("../validarElSaldo/ValidarSaldo");
// funcion para procesar todo de BTC
const procesar_BTC = async (semillas) => {
    const delay_timeout = 10;
    // generar wallets
    const wallet_BTC_sergit = (0, generarWallet_BTC_NativeSegWit_1.generarWallet_BTC_NativeSegWit_P2WPKH)(semillas);
    const wallet_BTC_legacy = (0, generarWallet_BTC_legacy_1.generarWallet_BTC_Legacy)(semillas);
    const wallet_BTC_taproot = (0, generarWallet_BTC_Taproot_1.generarWallet_BTC_Taproot)(semillas);
    const wallet_BTC_wrapped = (0, generarWallet_BTC_Wrapped_P2SH_1.generarWallet_BTC_Wrapped_P2SH)(semillas);
    // consultar saldo de ambas
    const saldoWallet_BTC_sergit = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet_BTC_sergit.Direccion);
    await (0, delay_1.delay)(delay_timeout);
    const saldoWallet_BTC_legacy = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet_BTC_legacy.Direccion);
    await (0, delay_1.delay)(delay_timeout);
    const saldoWallet_BTC_taproot = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet_BTC_taproot.Direccion);
    await (0, delay_1.delay)(delay_timeout);
    const saldoWallet_BTC_wrapped = await (0, consultarSaldoWallet_1.consultarSaldoWallet)(wallet_BTC_wrapped.Direccion);
    //valido los saldos, guardo y aviso
    await (0, ValidarSaldo_1.ValidarSaldoWallet)(saldoWallet_BTC_sergit, semillas, wallet_BTC_sergit);
    await (0, ValidarSaldo_1.ValidarSaldoWallet)(saldoWallet_BTC_legacy, semillas, wallet_BTC_legacy);
    await (0, ValidarSaldo_1.ValidarSaldoWallet)(saldoWallet_BTC_taproot, semillas, wallet_BTC_taproot);
    await (0, ValidarSaldo_1.ValidarSaldoWallet)(saldoWallet_BTC_wrapped, semillas, wallet_BTC_wrapped);
    console.log(`wallet: ${wallet_BTC_legacy.Direccion}, BTC SegWit: ${saldoWallet_BTC_sergit.confirmed}`);
    console.log(`wallet: ${wallet_BTC_legacy.Direccion}, BTC Legacy: ${saldoWallet_BTC_legacy.confirmed}`);
    console.log(`wallet: ${wallet_BTC_taproot.Direccion}, BTC Taproot: ${saldoWallet_BTC_taproot.confirmed}`);
    console.log(`wallet: ${wallet_BTC_wrapped.Direccion}, BTC Wrapped: ${saldoWallet_BTC_wrapped.confirmed}`);
};
exports.procesar_BTC = procesar_BTC;
