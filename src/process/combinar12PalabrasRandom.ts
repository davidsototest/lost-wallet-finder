// import * as path from "path";
// import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
// import { exec } from "child_process";
// import { WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
// import { agregarWalletConCash } from "./guardar/escribirWalletConCash";
// import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
// import { enviarMensajeTelegram } from "./telegram/telegram";
// import { validateMnemonic } from "bip39-ts";
// import { generarWallet_BTC_NativeSegWit_P2WPKH } from "./generarWalletsBTC/generarWallet_BTC_NativeSegWit";
// import { generarWallet_BTC_Taproot } from "./generarWalletsBTC/generarWallet_BTC_Taproot";
// import { generarWallet_BTC_Legacy } from "./generarWalletsBTC/generarWallet_BTC_legacy";
// import { generarWallet_BTC_Wrapped_P2SH } from "./generarWalletsBTC/generarWallet_BTC_Wrapped_P2SH";
// import { fixedBox, screen } from "./dashboard/dashboard";


// // contador de wallets
// let walletsEscaneadas = 0;
// let walletsConSaldo = 0;
// let saldos = 0;

// // -------------------------------------------------------------

// // Configuración inicial
// const LONGITUD_DICCIONARIO = diccionarioMezclado.length;
// const PALABRAS_POR_FRASE = 12;
// const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
// const rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");

// // Generar frase aleatoria VÁLIDA (con checksum BIP39)
// const generarFraseValida = (): string => {
//   let frase: string;
//   do {
//     const palabras = Array.from({ length: PALABRAS_POR_FRASE }, () => 
//       diccionarioMezclado[Math.floor(Math.random() * LONGITUD_DICCIONARIO)]
//     );
//     frase = palabras.join(" ");
//   } while (!validateMnemonic(frase)); // <-- Validación del checksum

//   return frase;
// };

// // Función principal con validación
// export const generarCombinacionRandom = async (): Promise<void> => {
//   while (true) {
//     const semillas = generarFraseValida(); // <-- Solo frases válidas

//     // generar wallet de nativeSegwit y Taproot
//     const wallet_BTC_Legacy = generarWallet_BTC_Legacy(semillas);
//     const wallet_BTC_NativeSegWit = generarWallet_BTC_NativeSegWit_P2WPKH(semillas);
//     const wallet_BTC_Taproot = generarWallet_BTC_Taproot(semillas);
//     const wallet_BTC_wrapped = generarWallet_BTC_Wrapped_P2SH(semillas);
    

//     // consultar saldo de ambas
//     const saldoWallet_Legacy = await consultarSaldoWallet(wallet_BTC_Legacy.Direccion);
//     const saldoWallet_NativeSegWit = await consultarSaldoWallet(wallet_BTC_NativeSegWit.Direccion);
//     const saldoWallet_Taproot = await consultarSaldoWallet(wallet_BTC_Taproot.Direccion);
//     const saldoWallet_wrapped = await consultarSaldoWallet(wallet_BTC_wrapped.Direccion);

//     //armo el objeto que todos necesitan
//     const datosCompletos: WalletConCashItem = {
//       frase: semillas,
//       direccion_legacy: wallet_BTC_Legacy.Direccion,
//       saldoActual_legacy: saldoWallet_Legacy.confirmed,
//       saldoSinConfirm_legacy: saldoWallet_Legacy.unconfirmed,
//       saldoRecibido_legacy: saldoWallet_Legacy.received,
//       direccion_NativeSegWit: wallet_BTC_NativeSegWit.Direccion,
//       saldoActual_NativeSegWit: saldoWallet_NativeSegWit.confirmed,
//       saldoSinConfirm_NativeSegWit: saldoWallet_NativeSegWit.unconfirmed,
//       saldoRecibido_NativeSegWit: saldoWallet_NativeSegWit.received,
//       direccion_Taproot: wallet_BTC_Taproot.Direccion,
//       saldoActual_Taproot: saldoWallet_Taproot.confirmed,
//       saldoSinConfirm_Taproot: saldoWallet_Taproot.unconfirmed,
//       saldoRecibido_Taproot: saldoWallet_Taproot.received,
//       direccion_wrapped: wallet_BTC_wrapped.Direccion,
//       saldoActual_wrapped: saldoWallet_wrapped.confirmed,
//       saldoSinConfirm_wrapped: saldoWallet_wrapped.unconfirmed,
//       saldoRecibido_wrapped: saldoWallet_wrapped.received,
//       fecha: new Date().toISOString()
//     }

//     if ( saldoWallet_Legacy.confirmed > 0 || saldoWallet_Legacy.received > 0 || saldoWallet_Legacy.unconfirmed > 0
//         || saldoWallet_NativeSegWit.confirmed > 0 || saldoWallet_NativeSegWit.received > 0 || saldoWallet_NativeSegWit.unconfirmed > 0
//         || saldoWallet_Taproot.confirmed > 0 || saldoWallet_Taproot.received > 0 || saldoWallet_Taproot.unconfirmed > 0 
//         || saldoWallet_wrapped.confirmed > 0 || saldoWallet_wrapped.received > 0 || saldoWallet_wrapped.unconfirmed > 0
//       ) {

//       if ( saldoWallet_Legacy.confirmed > 0 || saldoWallet_Legacy.unconfirmed > 0
//         || saldoWallet_NativeSegWit.confirmed > 0 || saldoWallet_NativeSegWit.unconfirmed > 0  
//         || saldoWallet_Taproot.confirmed > 0 || saldoWallet_Taproot.unconfirmed > 0
//         || saldoWallet_wrapped.confirmed > 0 || saldoWallet_wrapped.unconfirmed > 0
//         ) {
//         exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
//         enviarMensajeTelegram(datosCompletos);
//         walletsConSaldo += 1;
//         saldos = saldoWallet_Legacy.confirmed + saldoWallet_NativeSegWit.confirmed + saldoWallet_Taproot.confirmed + saldoWallet_wrapped.confirmed
//       }

//       exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);

//       await agregarWalletConCash(datosCompletos);
//     }

//     walletsEscaneadas += 4;

//     let emojiAlerta = saldoWallet_Legacy.confirmed > 0 
//                       || saldoWallet_Legacy.unconfirmed > 0
//                       || saldoWallet_NativeSegWit.confirmed > 0
//                       || saldoWallet_NativeSegWit.unconfirmed > 0
//                       || saldoWallet_Taproot.confirmed > 0
//                       || saldoWallet_Taproot.unconfirmed > 0
//                       || saldoWallet_wrapped.confirmed > 0
//                       || saldoWallet_wrapped.unconfirmed > 0 ? "⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡" : ""

//     console.log(
//       `${emojiAlerta}
//       - Wallet_Legacy: ${wallet_BTC_Legacy.Direccion} > Saldo: ${saldoWallet_Legacy.confirmed}, Recibido: ${saldoWallet_Legacy.received}, Sin confirmar: ${saldoWallet_Legacy.unconfirmed}
//       - Wallet_NativeSegWit: ${wallet_BTC_NativeSegWit.Direccion} > Saldo: ${saldoWallet_NativeSegWit.confirmed}, Recibido: ${saldoWallet_NativeSegWit.received}, Sin confirmar: ${saldoWallet_NativeSegWit.unconfirmed}
//       - Wallet_Taproot: ${wallet_BTC_Taproot.Direccion} > Saldo: ${saldoWallet_Taproot.confirmed}, Recibido: ${saldoWallet_Taproot.received}, Sin confirmar: ${saldoWallet_Taproot.unconfirmed}
//       - Wallet_wrapped: ${wallet_BTC_wrapped.Direccion} > Saldo: ${saldoWallet_wrapped.confirmed}, Recibido: ${saldoWallet_wrapped.received}, Sin confirmar: ${saldoWallet_wrapped.unconfirmed}
//       ----------------------------------------------------------------------------------------------------------
//       `
//     );

//     fixedBox.setContent(`walletsEscaneadas = ${walletsEscaneadas} >> walletsConSaldo = ${walletsConSaldo} >> Saldo = ${saldos}`);
//     screen.render();
//     // console.log(generarMensajeLog(datosCompletos));
//   } 
// };

export {}
