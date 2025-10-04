import { WalletResponseBTC } from "../../services/consultarSaldoWallet";
import { WalletResult } from "../generarWalletsBTC/generarWallet_BTC_NativeSegWit";
import { agregarWalletConCash } from "../guardar/escribirWalletConCash";
import { enviarMensajeTelegram } from "../telegram/telegram";
import { addToWalletsConCash } from "../..";


// Función para validar el saldo
export const ValidarSaldoWallet = async (wallet: WalletResponseBTC, semillas: string, walletBTC: WalletResult): Promise<void> => {
 
    //valido si el saldo actual, recibido o sin confirmar existe.
      if (
        wallet.confirmed > 0 ||
        wallet.received > 0 ||
        wallet.unconfirmed > 0
      ) {
    
        //objeto BTC
        const datos_BTC = {
          frase: semillas,
          wallet_de: "BTC",
          direccion: walletBTC.Direccion,
          saldo: `confi: ${wallet.confirmed}, unconf: ${wallet.unconfirmed}`,
          fecha: new Date().toISOString(),
        };
    
        //encontrar wallet con balance positivo o por confirmar
        if (wallet.confirmed > 0 || wallet.unconfirmed > 0) {
    
          //enviar por telegram
          await enviarMensajeTelegram(datos_BTC);

          //sumar en variable console.log
          addToWalletsConCash(1)
    
        }
    
        await agregarWalletConCash(datos_BTC);
      }

};
