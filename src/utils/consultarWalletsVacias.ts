import path from "path";
import { exec } from "child_process";
import { consultarSaldoWallet } from "../services/consultarSaldoWallet";
import { enviarMensajeTelegram } from "./telegram/telegram";
import { leerWalletsDesdeCarpeta } from "./leerWalletsDesdeCarpeta";
import { delay } from "./delay";
import { WalletConCashItem } from "../interface/WalletConCashItem.interface";

//ruta del sonido
const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");

//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
export const consultarWalletsVacias = async (): Promise<void> => {
  const wallets = leerWalletsDesdeCarpeta();

  for (const wallet of wallets) {
    await validarBTC(wallet);
  }
};

//validar si es BTC
const validarBTC = async (wallet: WalletConCashItem): Promise<void> => {
  try {
    // delay por rate limit
    await delay(1000);

    const resultado = await consultarSaldoWallet(wallet.direccion);

    console.log(`Dirección BTC: ${wallet.direccion}`);
    console.log(
      `Saldo confir: ${resultado.confirmed} > unconfir: ${resultado.unconfirmed} > recibe: ${resultado.received}`
    );
    console.log("----------------------------------------");

    if (resultado.confirmed > 0 || resultado.unconfirmed > 0) {
      //reproducir sonido
      exec(
        `powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`
      );

      //armar objeto
      const datosCompletos: WalletConCashItem = {
        frase: wallet.frase,
        wallet_de: `BTC`,
        direccion: wallet.direccion,
        saldo: `Confir: ${resultado.confirmed}, unconfir: ${resultado.unconfirmed}`,
        fecha: new Date().toISOString(),
      };

      //enviar mensaje por telegram
      enviarMensajeTelegram(datosCompletos);
    }
  } catch (error) {
    console.error(`Error al consultar ${wallet.direccion}:`, error);
  }
};
