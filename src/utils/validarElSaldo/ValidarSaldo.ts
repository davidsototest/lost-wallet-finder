import { WalletResponseBTC } from "../../services/consultarSaldoWallet";
import { enviarMensajeTelegram } from "../telegram/telegram";
import { addToWalletsConCash } from "../..";
import { WalletResult } from "../../interface/WalletResult.interface"; 
import { guardarJsonConWallet } from "../guardarWallets/guardarJsonConWallet";


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
          clavePrivada: walletBTC.Clave_privada,
          fecha: new Date().toISOString(),
        };
    
        //encontrar wallet con balance positivo o por confirmar
        if (wallet.confirmed > 0 || wallet.unconfirmed > 0) {
    
          //enviar por telegram
          await enviarMensajeTelegram(datos_BTC);

          //guardo la wallet en un archivo
          await guardarJsonConWallet(datos_BTC, "walletsConCash");

          //sumar en variable console.log
          addToWalletsConCash(1)
    
        }

        // guardado para wallets con movimientos
        await guardarJsonConWallet(datos_BTC, "walletsConMovimientos");
      }

};
