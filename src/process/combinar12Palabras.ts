import * as path from "path";
import { generarWallet_BTC } from "./generarWallet_BTC";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { exec } from "child_process";
import { leerSeguimientoIndice } from "./leerSeguimientoIndice";
import { leerSeguimientoWalletCash } from "./leerSeguimientoWalletCash";
import { escribirSeguimientoIndice } from "./escribirSeguimientoIndice";
import { escribirWalletConCash } from "./escribirWalletConCash";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { enviarMensajeTelegram } from "./telegram/telegram";

//ruta del sonido
const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
const rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");

// Función principal para generar combinaciones
export const generarCombinacion = async (): Promise<void> => {
  let indices = leerSeguimientoIndice();
  let walletConCash = leerSeguimientoWalletCash();

  // Bucle para generar combinaciones
  while (true) {

    //mapeo cada palabra segun el indice guardado
    const palabras = indices.map((i) => diccionarioMezclado[i]);

    //separo las palabras por un espacio
    const semillas = palabras.join(" ");

    // Generar la wallet BTC usando la frase semilla
    const wallet_BTC = generarWallet_BTC(semillas);

    // Consultar el saldo de la wallet
    const saldoWallet = await consultarSaldoWallet(wallet_BTC.Direccion_bc1q);

    //valido si el saldo actual, recibido o sin confirmar existe.
    if (
      saldoWallet.confirmed > 0 ||
      saldoWallet.received > 0 ||
      saldoWallet.unconfirmed > 0
    ) {
      //encontrar wallet con balance positivo o por confirmar
      if (saldoWallet.confirmed > 0 || saldoWallet.unconfirmed) {
        //reproducir sonido
        exec(
          `powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`
        );

        //enviar mensaje por telegram
        enviarMensajeTelegram(
          semillas,
          wallet_BTC.Direccion_bc1q,
          String(saldoWallet.confirmed),
          String(saldoWallet.received),
          String(saldoWallet.unconfirmed)
        );
      }

      // Reproducir el sonido de alerta wallet valida vacia
      exec(
        `powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`
      );

      // Crear el nuevo registro: [fraseSemilla, funded_txo_sum, fechaCreacion]
      const nuevoRegistro: [string, string, string, string] = [
        semillas,
        `confirmado: ${saldoWallet.confirmed}, recibido: ${saldoWallet.confirmed}, sin confirmar: ${saldoWallet.unconfirmed}`,
        wallet_BTC.Direccion_bc1q,
        new Date().toISOString(),
      ];

      // Agregar el nuevo registro al array en memoria y actualizar el archivo
      walletConCash.push(nuevoRegistro);
      escribirWalletConCash(walletConCash);
    }

    console.log(
      `Wallet: ${wallet_BTC.Direccion_bc1q} > Saldo wallet: ${saldoWallet.confirmed}, Recibido: ${saldoWallet.received}, Sin confirmar: ${saldoWallet.unconfirmed}`
    );

    // Incrementar como un contador en base diccionarioMezclado.length
    for (let i = indices.length - 1; i >= 0; i--) {
      indices[i]++;
      if (indices[i] < diccionarioMezclado.length) {
        break; // No hay overflow, salir
      } else {
        indices[i] = 0; // Resetear y seguir con el siguiente a la izquierda
        if (i === 0) {
          console.log("Se han generado todas las combinaciones posibles.");
          return;
        }
      }
    };

    escribirSeguimientoIndice(indices);
  }
};
