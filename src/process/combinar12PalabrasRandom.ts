import * as path from "path";
import { generarWallet_BTC } from "./generarWalletsBTC/generarWallet_BTC";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { exec } from "child_process";
import { WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
import { agregarWalletConCash } from "./guardar/escribirWalletConCash";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { enviarMensajeTelegram } from "./telegram/telegram";
import { validateMnemonic } from "bip39-ts";

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
    const wallet_BTC = generarWallet_BTC(semillas);
    const saldoWallet = await consultarSaldoWallet(wallet_BTC.Direccion_bc1q);

    if (saldoWallet.confirmed > 0 || saldoWallet.received > 0 || saldoWallet.unconfirmed > 0) {
      if (saldoWallet.confirmed > 0 || saldoWallet.unconfirmed) {
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
        enviarMensajeTelegram(
          semillas,
          wallet_BTC.Direccion_bc1q,
          String(saldoWallet.confirmed),
          String(saldoWallet.received),
          String(saldoWallet.unconfirmed)
        );
      }

      exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);

      const walletConCash: WalletConCashItem = {
        frase: semillas,
        estado: `confirmado: ${saldoWallet.confirmed}, recibido: ${saldoWallet.confirmed}, sin confirmar: ${saldoWallet.unconfirmed}`,
        direccion: wallet_BTC.Direccion_bc1q,
        fecha: new Date().toISOString()
      };

      await agregarWalletConCash(walletConCash);
    }

    console.log(
      `Wallet: ${wallet_BTC.Direccion_bc1q} > Saldo: ${saldoWallet.confirmed}, Recibido: ${saldoWallet.received}, Sin confirmar: ${saldoWallet.unconfirmed}`
    );
  }
};