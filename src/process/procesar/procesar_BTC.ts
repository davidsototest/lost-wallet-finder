import { consultarSaldoWallet } from "../../consultas/consultarSaldoWallet";
import {
  rutaSonido,
  rutaSonido2,
} from "../combinar12Palabras";
import {
  generarWallet_BTC_NativeSegWit_P2WPKH,
} from "../generarWalletsBTC/generarWallet_BTC_NativeSegWit";
import { exec } from "child_process";
import { enviarMensajeTelegram } from "../telegram/telegram";
import { agregarWalletConCash } from "../guardar/escribirWalletConCash";


// funcion para procesar todo de BTC
export const procesar_BTC = async (semillas: string): Promise<void> => {
  // generar wallets
  const wallet_BTC = generarWallet_BTC_NativeSegWit_P2WPKH(semillas);

  // consultar saldo de ambas
  const saldoWallet_BTC = await consultarSaldoWallet(wallet_BTC.Direccion);

  //objeto BTC
  const datos_BTC = {
    frase: semillas,
    wallet_de: "BTC",
    direccion: wallet_BTC.Direccion,
    saldo: `confi: ${saldoWallet_BTC.confirmed}, unconf: ${saldoWallet_BTC.unconfirmed}`,
    fecha: new Date().toISOString(),
  };

  //valido si el saldo actual, recibido o sin confirmar existe.
  if (
    saldoWallet_BTC.confirmed > 0 ||
    saldoWallet_BTC.received > 0 ||
    saldoWallet_BTC.unconfirmed > 0
  ) {
    //encontrar wallet con balance positivo o por confirmar
    if (saldoWallet_BTC.confirmed > 0 || saldoWallet_BTC.unconfirmed > 0) {
      //reproducir sonido
      exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);

      //enviar por telegram
      await enviarMensajeTelegram(datos_BTC);

    }

    // Reproducir el sonido de alerta wallet valida vacia
    exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);

    await agregarWalletConCash(datos_BTC);
  }

  console.log(`Wallet_BTC: ${wallet_BTC.Direccion} > Saldo: ${saldoWallet_BTC.confirmed + saldoWallet_BTC.unconfirmed}
----------------------------------------------------------`);
};
