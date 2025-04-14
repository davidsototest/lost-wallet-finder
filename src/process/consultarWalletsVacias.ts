import path from "path";
import { exec } from "child_process";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { leerSeguimientoWalletCash } from "./leer/leerSeguimientoWalletCash";
import { enviarMensajeTelegram } from "./telegram/telegram";

const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");

//funcion para sonsultar las wallets que ubicamos, pero vacias
// a ver si ingreso dinero
export const consultarWalletsVacias = async (): Promise<void> => {
  const wallets = leerSeguimientoWalletCash();

  for (const wallet of wallets) {
    const { direccion } = wallet;
    try {
      const resultado = await consultarSaldoWallet(direccion);
      const emoji = resultado.confirmed > 0 || resultado.unconfirmed ? "💊" : "";

      console.log(`Dirección: ${direccion} ${emoji}`);
      console.log("Saldo Actual:", resultado.confirmed);
      console.log("Saldo Sin Confirmar:", resultado.unconfirmed);
      console.log("----------------------------------------");

      if (resultado.confirmed > 0 || resultado.unconfirmed) {
        //reproducir sonido
        exec(
          `powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`
        );

        //enviar mensaje por telegram
        enviarMensajeTelegram(
          wallet.frase,
          wallet.direccion,
          String(resultado.confirmed),
          String(resultado.received),
          String(resultado.unconfirmed)
        );
      }
    } catch (error) {
      console.error(`Error al consultar ${direccion}:`, error);
    }
  }
};
