import * as path from "path";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { exec } from "child_process";
import * as bip39 from 'bip39';
import { leerSeguimientoIndice } from "./leer/leerSeguimientoIndice";
import { WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
import { escribirSeguimientoIndice } from "./guardar/escribirSeguimientoIndice";
import { agregarWalletConCash } from "./guardar/escribirWalletConCash";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { enviarMensajeTelegram } from "./telegram/telegram";
import { guardarSeguimientoHistorico } from "./guardar/guardarSeguimientoHistorico";
import { generarWallet_BTC_Legacy } from "./generarWalletsBTC/generarWallet_BTC_legacy";
import { generarWallet_BTC_NativeSegWit_P2WPKH } from "./generarWalletsBTC/generarWallet_BTC_NativeSegWit";
import { generarWallet_BTC_Taproot } from "./generarWalletsBTC/generarWallet_BTC_Taproot";
import { generarWallet_BTC_Wrapped_P2SH } from "./generarWalletsBTC/generarWallet_BTC_Wrapped_P2SH";
import { fixedBox, screen } from "./dashboard/dashboard";

//ruta del sonido
const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
const rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");

// contador de wallets
let walletsEscaneadas = 0;
let walletsConSaldo = 0;
let saldos = 0;

// -------------------------------------------------------------

// Función principal para generar combinaciones
export const generarCombinacion = async (): Promise<void> => {
  let indices = leerSeguimientoIndice();

  // Bucle para generar combinaciones
  while (true) {
    //mapeo cada palabra segun el indice guardado
    const palabras = indices.map((i) => diccionarioMezclado[i]);

    //separo las palabras por un espacio
    const semillas = palabras.join(" ");

    //valdiar que la frase sea valida
    if (!bip39.validateMnemonic(semillas)) {
        // console.warn(`Frase mnemónica inválida: ${semillas}`);
        // Incrementar el índice para la siguiente combinación
        for (let i = indices.length - 1; i >= 0; i--) {
          indices[i]++;
          if (indices[i] < diccionarioMezclado.length) {
            break;
          } else {
            indices[i] = 0;
            if (i === 0) {
              console.log("Se han generado todas las combinaciones posibles.");
              return;
            }
          }
        }
        escribirSeguimientoIndice(indices);
        guardarSeguimientoHistorico(indices);
        continue; // Saltar a la siguiente iteración
    }      

    // generar wallets
    const wallet_BTC_Legacy = generarWallet_BTC_Legacy(semillas);
    const wallet_BTC_NativeSegWit = generarWallet_BTC_NativeSegWit_P2WPKH(semillas);
    const wallet_BTC_Taproot = generarWallet_BTC_Taproot(semillas);
    const wallet_BTC_wrapped = generarWallet_BTC_Wrapped_P2SH(semillas);

    // consultar saldo de ambas
    const saldoWallet_Legacy = await consultarSaldoWallet(wallet_BTC_Legacy.Direccion);
    const saldoWallet_NativeSegWit = await consultarSaldoWallet(wallet_BTC_NativeSegWit.Direccion);
    const saldoWallet_Taproot = await consultarSaldoWallet(wallet_BTC_Taproot.Direccion);
    const saldoWallet_wrapped = await consultarSaldoWallet(wallet_BTC_wrapped.Direccion);

    //armo el objeto que todos necesitan
    const datosCompletos: WalletConCashItem = {
        frase: semillas,
        direccion_legacy: wallet_BTC_Legacy.Direccion,
        saldoActual_legacy: saldoWallet_Legacy.confirmed,
        saldoSinConfirm_legacy: saldoWallet_Legacy.unconfirmed,
        saldoRecibido_legacy: saldoWallet_Legacy.received,
        direccion_NativeSegWit: wallet_BTC_NativeSegWit.Direccion,
        saldoActual_NativeSegWit: saldoWallet_NativeSegWit.confirmed,
        saldoSinConfirm_NativeSegWit: saldoWallet_NativeSegWit.unconfirmed,
        saldoRecibido_NativeSegWit: saldoWallet_NativeSegWit.received,
        direccion_Taproot: wallet_BTC_Taproot.Direccion,
        saldoActual_Taproot: saldoWallet_Taproot.confirmed,
        saldoSinConfirm_Taproot: saldoWallet_Taproot.unconfirmed,
        saldoRecibido_Taproot: saldoWallet_Taproot.received,
        direccion_wrapped: wallet_BTC_wrapped.Direccion,
        saldoActual_wrapped: saldoWallet_wrapped.confirmed,
        saldoSinConfirm_wrapped: saldoWallet_wrapped.unconfirmed,
        saldoRecibido_wrapped: saldoWallet_wrapped.received,
        fecha: new Date().toISOString()
      }

    //valido si el saldo actual, recibido o sin confirmar existe.
    if ( saldoWallet_Legacy.confirmed > 0 || saldoWallet_Legacy.received > 0 || saldoWallet_Legacy.unconfirmed > 0
        || saldoWallet_NativeSegWit.confirmed > 0 || saldoWallet_NativeSegWit.received > 0 || saldoWallet_NativeSegWit.unconfirmed > 0
        || saldoWallet_Taproot.confirmed > 0 || saldoWallet_Taproot.received > 0 || saldoWallet_Taproot.unconfirmed > 0 
        || saldoWallet_wrapped.confirmed > 0 || saldoWallet_wrapped.received > 0 || saldoWallet_wrapped.unconfirmed > 0
      ) {

        //encontrar wallet con balance positivo o por confirmar
      if ( saldoWallet_Legacy.confirmed > 0 || saldoWallet_Legacy.unconfirmed > 0
        || saldoWallet_NativeSegWit.confirmed > 0 || saldoWallet_NativeSegWit.unconfirmed > 0  
        || saldoWallet_Taproot.confirmed > 0 || saldoWallet_Taproot.unconfirmed > 0
        || saldoWallet_wrapped.confirmed > 0 || saldoWallet_wrapped.unconfirmed > 0
        ) {
        //reproducir sonido
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);

        //enviar por telegram
        enviarMensajeTelegram(datosCompletos);

        //actualizar contadores
        walletsConSaldo += 1;
        saldos = saldoWallet_Legacy.confirmed + saldoWallet_NativeSegWit.confirmed + saldoWallet_Taproot.confirmed + saldoWallet_wrapped.confirmed
      }

        // Reproducir el sonido de alerta wallet valida vacia
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);
      
        await agregarWalletConCash(datosCompletos);
    }

    walletsEscaneadas += 1;

    let emojiAlerta = saldoWallet_Legacy.confirmed > 0 
                          || saldoWallet_Legacy.unconfirmed > 0
                          || saldoWallet_NativeSegWit.confirmed > 0
                          || saldoWallet_NativeSegWit.unconfirmed > 0
                          || saldoWallet_Taproot.confirmed > 0
                          || saldoWallet_Taproot.unconfirmed > 0
                          || saldoWallet_wrapped.confirmed > 0
                          || saldoWallet_wrapped.unconfirmed > 0 ? "⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡⚡" : ""
    
        console.log(
          `${emojiAlerta}
          - Wallet_Legacy: ${wallet_BTC_Legacy.Direccion} > Saldo: ${saldoWallet_Legacy.confirmed}, Recibido: ${saldoWallet_Legacy.received}, Sin confirmar: ${saldoWallet_Legacy.unconfirmed}
          - Wallet_NativeSegWit: ${wallet_BTC_NativeSegWit.Direccion} > Saldo: ${saldoWallet_NativeSegWit.confirmed}, Recibido: ${saldoWallet_NativeSegWit.received}, Sin confirmar: ${saldoWallet_NativeSegWit.unconfirmed}
          - Wallet_Taproot: ${wallet_BTC_Taproot.Direccion} > Saldo: ${saldoWallet_Taproot.confirmed}, Recibido: ${saldoWallet_Taproot.received}, Sin confirmar: ${saldoWallet_Taproot.unconfirmed}
          - Wallet_wrapped: ${wallet_BTC_wrapped.Direccion} > Saldo: ${saldoWallet_wrapped.confirmed}, Recibido: ${saldoWallet_wrapped.received}, Sin confirmar: ${saldoWallet_wrapped.unconfirmed}
          ----------------------------------------------------------------------------------------------------------
          `
        );
    
        fixedBox.setContent(`walletsEscaneadas = ${walletsEscaneadas} >> walletsConSaldo = ${walletsConSaldo} >> Saldo = ${saldos}`);
        screen.render();

    // Incrementar como un contador en base diccionarioMezclado.length
    for (let i = indices.length - 1; i >= 0; i--) {
      indices[i]++;
      if (indices[i] < diccionarioMezclado.length) {
        break; // No hay overflow, salir
      } else {
        indices[i] = 0; // Resetear y seguir con el siguiente a la izquierda
        if (i === 0) {
          console.log("Se han generado todas las combinaciones posibles.");
          return;
        }
      }
    }

    escribirSeguimientoIndice(indices);
    guardarSeguimientoHistorico(indices);
  }
};
