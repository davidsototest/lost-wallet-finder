import { WalletResponseBTC } from "../../consultas/consultarSaldoWallet";
import { WalletResult } from "../generarWalletsBTC/generarWallet_BTC_NativeSegWit";
import { agregarWalletConCash } from "../guardar/escribirWalletConCash";
import { enviarMensajeTelegram } from "../telegram/telegram";
import { exec } from "child_process";
import {  rutaSonido,  rutaSonido2 } from "../combinar12Palabras";
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
          //reproducir sonido
          exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
    
          //enviar por telegram
          await enviarMensajeTelegram(datos_BTC);

          //sumar en variable console.log
          addToWalletsConCash(1)
    
        }
    
        // Reproducir el sonido de alerta wallet valida vacia
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);
    
        await agregarWalletConCash(datos_BTC);
      }

};
