import path from "path";
import { exec } from "child_process";
import { consultarSaldoWallet } from "../services/consultarSaldoWallet";
import { leerSeguimientoWalletCash, WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
import { enviarMensajeTelegram } from "./telegram/telegram";
import { consultarSaldoWallet_TRON } from "../consultas/consultarSaldoWallet_TRON";

//ruta del sonido
const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");

//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
export const consultarWalletsVacias = async (): Promise<void> => {
  const wallets = leerSeguimientoWalletCash();

  for (const wallet of wallets) {

    if(wallet.wallet_de === "BTC"){
      await validarBTC(wallet);
    } else {
      await validarTRON(wallet);
    };
  };
};


//validar si es BTC
const validarBTC = async (wallet: WalletConCashItem ): Promise<void> => {
  try {
    const resultado = await consultarSaldoWallet(wallet.direccion);
    
    console.log(`Dirección BTC: ${wallet.direccion}`);
    console.log(`Saldo confir: ${resultado.confirmed} > unconfir: ${resultado.unconfirmed} > recibe: ${resultado.received}`);
    console.log("----------------------------------------"); 

    if ( resultado.confirmed > 0 || resultado.unconfirmed > 0 ) {
      //reproducir sonido
      exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);

      //armar objeto
      const datosCompletos: WalletConCashItem = {
            frase: wallet.frase,
            wallet_de: `BTC`,
            direccion: wallet.direccion,
            saldo: `Confir: ${resultado.confirmed}, unconfir: ${resultado.unconfirmed}`,
            fecha: new Date().toISOString()
          }

      //enviar mensaje por telegram
      enviarMensajeTelegram(datosCompletos);
    }
  } catch (error) {
    console.error(`Error al consultar ${wallet.direccion}:`, error);
  }
};



//validar si es TRON
const validarTRON = async (wallet: WalletConCashItem ): Promise<void> => {
  try {
    const resultado = await consultarSaldoWallet_TRON(wallet.direccion);

    //validar que la respuesta no sea NULL
    if (resultado === null) {
      console.log(`Wallet sin nada que buscar . . .
                  ----------------------------------------------------------`);
      return; // Finaliza la ejecución de esta función
    }

    //guardar todas las monedas de DATA
    const walletsData = resultado.data;

    for (const walletData of walletsData) {
    
    console.log(`Dirección TRON: ${wallet.direccion}`);
    console.log(`moneda: ${walletData.tokenAbbr} > balance: ${walletData.balance}`);
    console.log("----------------------------------------"); 

      if ( Number(walletData.balance) > 0 || resultado.transactions_in > 0 ) {

          //reproducir sonido
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);

        //armar objeto
        const datosCompletos: WalletConCashItem = {
              frase: wallet.frase,
              wallet_de: `TRON = ${walletData.tokenAbbr}`,
              direccion: wallet.direccion,
              saldo: String(walletData.balance),
              fecha: new Date().toISOString()
            }

        //enviar mensaje por telegram
        enviarMensajeTelegram(datosCompletos);
        }
    }
  } catch (error) {
    console.error(`Error al consultar ${wallet.direccion}:`, error);
  }
}