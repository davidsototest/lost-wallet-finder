import * as path from "path";
import { generarWallet_BTC_NativeSegWit } from "./generarWalletsBTC/generarWallet_BTC_NativeSegWit";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { exec } from "child_process";
import { WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
import { agregarWalletConCash } from "./guardar/escribirWalletConCash";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { enviarMensajeTelegram } from "./telegram/telegram";
import { validateMnemonic } from "bip39-ts";
import { generarWallet_BTC_Taproot } from "./generarWalletsBTC/generarWallet_BTC_Taproot";

// Configuración inicial
const LONGITUD_DICCIONARIO = diccionarioMezclado.length;
const PALABRAS_POR_FRASE = 12;
const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
const rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");

// Generar frase aleatoria VÁLIDA (con checksum BIP39)
const generarFraseValida = (): string => {
  let frase: string;
  do {
    const palabras = Array.from({ length: PALABRAS_POR_FRASE }, () => 
      diccionarioMezclado[Math.floor(Math.random() * LONGITUD_DICCIONARIO)]
    );
    frase = palabras.join(" ");
  } while (!validateMnemonic(frase)); // <-- Validación del checksum

  return frase;
};

// Función principal con validación
export const generarCombinacionRandom = async (): Promise<void> => {
  while (true) {
    const semillas = generarFraseValida(); // <-- Solo frases válidas

    // generar wallet de nativeSegwit y Taproot
    const wallet_BTC_NativeSegWit = generarWallet_BTC_NativeSegWit(semillas);
    const wallet_BTC_Taproot = generarWallet_BTC_Taproot(semillas);

    // consultar saldo de ambas
    const saldoWallet_NativeSegWit = await consultarSaldoWallet(wallet_BTC_NativeSegWit.Direccion_bc1q);
    const saldoWallet_Taproot = await consultarSaldoWallet(wallet_BTC_Taproot.Direccion_bc1p);

    //armo el objeto que todos necesitan
    const datosCompletos: WalletConCashItem = {
      frase: semillas,
      direccion_NativeSegWit: wallet_BTC_NativeSegWit.Direccion_bc1q,
      saldoActual_NativeSegWit: saldoWallet_NativeSegWit.confirmed,
      saldoSinConfirm_NativeSegWit: saldoWallet_NativeSegWit.unconfirmed,
      saldoRecibido_NativeSegWit: saldoWallet_NativeSegWit.received,
      direccion_Taproot: wallet_BTC_Taproot.Direccion_bc1p,
      saldoActual_Taproot: saldoWallet_Taproot.confirmed,
      saldoSinConfirm_Taproot: saldoWallet_Taproot.unconfirmed,
      saldoRecibido_Taproot: saldoWallet_Taproot.received,
      fecha: new Date().toISOString()
    }

    if (saldoWallet_NativeSegWit.confirmed > 0 || saldoWallet_NativeSegWit.received > 0 || saldoWallet_NativeSegWit.unconfirmed > 0
        || saldoWallet_Taproot.confirmed > 0 || saldoWallet_Taproot.received > 0 || saldoWallet_Taproot.unconfirmed > 0 ) {

      if (saldoWallet_NativeSegWit.confirmed > 0 || saldoWallet_NativeSegWit.unconfirmed > 0 || saldoWallet_Taproot.confirmed > 0 || saldoWallet_Taproot.unconfirmed > 0) {
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
        enviarMensajeTelegram(datosCompletos);
      }

      exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);

      await agregarWalletConCash(datosCompletos);
    }

    console.log(
      `
      Wallet_NativeSegWit: ${wallet_BTC_NativeSegWit.Direccion_bc1q} > Saldo: ${saldoWallet_NativeSegWit.confirmed}, Recibido: ${saldoWallet_NativeSegWit.received}, Sin confirmar: ${saldoWallet_NativeSegWit.unconfirmed}
      Wallet_Taproot: ${wallet_BTC_Taproot.Direccion_bc1p} > Saldo: ${saldoWallet_Taproot.confirmed}, Recibido: ${saldoWallet_Taproot.received}, Sin confirmar: ${saldoWallet_Taproot.unconfirmed}
      ----------------------------------------------------------------------------------------------------------
      `
    );
  }
};