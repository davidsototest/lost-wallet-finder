"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.procesar_TRON = void 0;
const combinar12Palabras_1 = require("../combinar12Palabras");
const child_process_1 = require("child_process");
const telegram_1 = require("../telegram/telegram");
const escribirWalletConCash_1 = require("../guardar/escribirWalletConCash");
const generarWallet_TRON_1 = require("../generarWalletsTRON/generarWallet_TRON");
const consultarSaldoWallet_TRON_1 = require("../../consultas/consultarSaldoWallet_TRON");
//funcion para procesar todo de TRON
const procesar_TRON = async (semillas) => {
    const wallets_TRON = (0, generarWallet_TRON_1.generarWallets_TRON)(semillas);
    let contadorWallets = 0;
    //iterar sobre todas las wallets que creo
    for (const wallet_TRON of wallets_TRON) {
        try {
            const saldoWallets_TRON = await (0, consultarSaldoWallet_TRON_1.consultarSaldoWallet_TRON)(wallet_TRON.Direccion);
            let saldoWallet_TRON = saldoWallets_TRON.data;
            contadorWallets += 1;
            //iterar sobre todas las respuestas de saldo
            for (const saldoWallet of saldoWallet_TRON) {
                const datos_TRON = {
                    frase: semillas,
                    wallet_de: `TRON = ${saldoWallet.tokenAbbr}`,
                    direccion: wallet_TRON.Direccion,
                    saldo: String(saldoWallet.balance),
                    fecha: new Date().toISOString(),
                };
                if (Number(saldoWallet.balance) > 0 || saldoWallets_TRON.transactions_in > 0) {
                    //solo si hay balance positivo
                    if (Number(saldoWallet.balance) > 0) {
                        (0, child_process_1.exec)(`powershell -c (New-Object Media.SoundPlayer '${combinar12Palabras_1.rutaSonido}').PlaySync();`);
                        //enviar por telegram
                        await (0, telegram_1.enviarMensajeTelegram)(datos_TRON);
                        //aregar wallet al json de respaldo
                        await (0, escribirWalletConCash_1.agregarWalletConCash)(datos_TRON);
                    }
                    ;
                    //guardar la wallet sin saldo pero con transacciones pasadas
                    await (0, escribirWalletConCash_1.agregarWalletConCash)(datos_TRON);
                }
                ;
                // console.log(`Wallet_TRON: ${wallet_TRON.Direccion} > balance: ${saldoWallet.balance} > ${contadorWallets}`);
            }
        }
        catch (err) {
            console.error("Error procesando wallet:", err);
        }
    }
};
exports.procesar_TRON = procesar_TRON;
