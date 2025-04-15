import path from "path";
import { exec } from "child_process";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { leerSeguimientoWalletCash, WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
import { enviarMensajeTelegram } from "./telegram/telegram";

const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");

//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
export const consultarWalletsVacias = async (): Promise<void> => {
  const wallets = leerSeguimientoWalletCash();

  for (const wallet of wallets) {
    const { 
      direccion_NativeSegWit, 
      // direccion_Taproot 
    } = wallet;
    try {
      const resultado_NativeSegWit = await consultarSaldoWallet(direccion_NativeSegWit);
      // const resultado_Taproot = await consultarSaldoWallet(direccion_Taproot);
      const emoji = resultado_NativeSegWit.confirmed > 0 || resultado_NativeSegWit.unconfirmed > 0 ? "💊" : "";
                    // || resultado_Taproot.confirmed > 0 || resultado_Taproot.unconfirmed 

      console.log(`Dirección_NativeSegWit: ${direccion_NativeSegWit} ${emoji}`);
      console.log("Saldo Actual:", resultado_NativeSegWit.confirmed);
      console.log("Saldo Sin Confirmar:", resultado_NativeSegWit.unconfirmed);
      // console.log(`Dirección_Taproot: ${direccion_Taproot} ${emoji}`);
      // console.log("Saldo Actual:", resultado_Taproot.confirmed);
      // console.log("Saldo Sin Confirmar:", resultado_Taproot.unconfirmed);
      console.log("----------------------------------------");

      if (resultado_NativeSegWit.confirmed > 0 || resultado_NativeSegWit.unconfirmed 
          // || resultado_Taproot.confirmed > 0 || resultado_Taproot.unconfirmed > 0 
        ) {
        //reproducir sonido
        exec(
          `powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`
        );

        //armar objeto
        const datosCompletos: WalletConCashItem = {
              frase: wallet.frase,
              direccion_NativeSegWit: wallet.direccion_NativeSegWit,
              saldoActual_NativeSegWit: resultado_NativeSegWit.confirmed,
              saldoSinConfirm_NativeSegWit: resultado_NativeSegWit.unconfirmed,
              saldoRecibido_NativeSegWit: resultado_NativeSegWit.received,
              // direccion_Taproot: wallet.direccion_Taproot,
              // saldoActual_Taproot: resultado_Taproot.confirmed,
              // saldoSinConfirm_Taproot: resultado_Taproot.unconfirmed,
              // saldoRecibido_Taproot: resultado_Taproot.received,
              fecha: new Date().toISOString()
            }

        //enviar mensaje por telegram
        enviarMensajeTelegram(datosCompletos);
      }
    } catch (error) {
      console.error(`Error al consultar ${direccion_NativeSegWit}:`, error);
    }
  }
};
