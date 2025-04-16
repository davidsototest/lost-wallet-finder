import path from "path";
import { exec } from "child_process";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { leerSeguimientoWalletCash, WalletConCashItem } from "./leer/leerSeguimientoWalletCash";
import { enviarMensajeTelegram } from "./telegram/telegram";
import { ValidarCeroEmoji } from "./emoji/validarCero";

const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");

//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
export const consultarWalletsVacias = async (): Promise<void> => {
  const wallets = leerSeguimientoWalletCash();

  for (const wallet of wallets) {
    const { 
      direccion_legacy,
      direccion_NativeSegWit, 
      direccion_Taproot,
      direccion_wrapped 
    } = wallet;

    try {
      const resultado_Legacy = await consultarSaldoWallet(direccion_legacy);
      const resultado_NativeSegWit = await consultarSaldoWallet(direccion_NativeSegWit);
      const resultado_Taproot = await consultarSaldoWallet(direccion_Taproot);
      const resultado_wrapped = await consultarSaldoWallet(direccion_wrapped);
      
      console.log(`Dirección_legacy: ${direccion_legacy}`);
      console.log("Saldo Actual:", resultado_Legacy.confirmed, ValidarCeroEmoji(resultado_Legacy.confirmed));
      console.log("Saldo Sin Confirmar:", resultado_Legacy.unconfirmed, ValidarCeroEmoji(resultado_Legacy.unconfirmed));
      console.log(`Dirección_NativeSegWit: ${direccion_NativeSegWit}`);
      console.log("Saldo Actual:", resultado_NativeSegWit.confirmed, ValidarCeroEmoji(resultado_NativeSegWit.confirmed));
      console.log("Saldo Sin Confirmar:", resultado_NativeSegWit.unconfirmed, ValidarCeroEmoji(resultado_NativeSegWit.unconfirmed));
      console.log(`Dirección_Taproot: ${direccion_Taproot}`);
      console.log("Saldo Actual:", resultado_Taproot.confirmed, ValidarCeroEmoji(resultado_Taproot.confirmed));
      console.log("Saldo Sin Confirmar:", resultado_Taproot.unconfirmed, ValidarCeroEmoji(resultado_Taproot.unconfirmed));
      console.log(`Dirección_Wrapped: ${direccion_wrapped}`);
      console.log("Saldo Actual:", resultado_wrapped.confirmed, ValidarCeroEmoji(resultado_wrapped.confirmed));
      console.log("Saldo Sin Confirmar:", resultado_wrapped.unconfirmed, ValidarCeroEmoji(resultado_wrapped.unconfirmed));
      console.log("----------------------------------------");

      if ( resultado_Legacy.confirmed > 0 || resultado_Legacy.unconfirmed > 0
          || resultado_NativeSegWit.confirmed > 0 || resultado_NativeSegWit.unconfirmed 
          || resultado_Taproot.confirmed > 0 || resultado_Taproot.unconfirmed > 0 
          || resultado_wrapped.confirmed > 0 || resultado_wrapped.unconfirmed > 0
        ) {
        //reproducir sonido
        exec(
          `powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`
        );

        //armar objeto
        const datosCompletos: WalletConCashItem = {
              frase: wallet.frase,
              direccion_legacy: wallet.direccion_legacy,
              saldoActual_legacy: resultado_Legacy.confirmed,
              saldoSinConfirm_legacy: resultado_Legacy.unconfirmed,
              saldoRecibido_legacy: resultado_Legacy.received,
              direccion_NativeSegWit: wallet.direccion_NativeSegWit,
              saldoActual_NativeSegWit: resultado_NativeSegWit.confirmed,
              saldoSinConfirm_NativeSegWit: resultado_NativeSegWit.unconfirmed,
              saldoRecibido_NativeSegWit: resultado_NativeSegWit.received,
              direccion_Taproot: wallet.direccion_Taproot,
              saldoActual_Taproot: resultado_Taproot.confirmed,
              saldoSinConfirm_Taproot: resultado_Taproot.unconfirmed,
              saldoRecibido_Taproot: resultado_Taproot.received,
              direccion_wrapped: wallet.direccion_wrapped,
              saldoActual_wrapped: resultado_wrapped.confirmed,
              saldoSinConfirm_wrapped: resultado_wrapped.unconfirmed,
              saldoRecibido_wrapped: resultado_wrapped.received,
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
