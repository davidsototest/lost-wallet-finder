import * as path from "path";
import * as bip39 from 'bip39';
import { leerSeguimientoIndice } from "./leer/leerSeguimientoIndice";
import { escribirSeguimientoIndice } from "./guardar/escribirSeguimientoIndice";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { guardarSeguimientoHistorico } from "./guardar/guardarSeguimientoHistorico";
import { procesar_BTC } from "./procesar/procesar_BTC";
import { procesar_TRON } from "./procesar/procesar_TRON";

//ruta del sonido
export const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
export const rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");


// -------------------------------------------------------------

// Función principal para generar combinaciones
export const generarCombinacion = async (): Promise<void> => {
  let indices = leerSeguimientoIndice();

  // Bucle para generar combinaciones
  while (true) {
    //mapeo cada palabra segun el indice guardado
    const palabras = indices.map((i) => diccionarioMezclado[i]);

    //separo las palabras por un espacio
    const semillas = palabras.join(" ");

    //valdiar que la frase sea valida
    if (!bip39.validateMnemonic(semillas)) {
        // console.warn(`Frase mnemónica inválida: ${semillas}`);
        // Incrementar el índice para la siguiente combinación
        for (let i = indices.length - 1; i >= 0; i--) {
          indices[i]++;
          if (indices[i] < diccionarioMezclado.length) {
            break;
          } else {
            indices[i] = 0;
            if (i === 0) {
              console.log("Se han generado todas las combinaciones posibles.");
              return;
            }
          }
        }
        escribirSeguimientoIndice(indices);
        guardarSeguimientoHistorico(indices);
        continue; // Saltar a la siguiente iteración
    };

    //procesar todo de BTC y TRON
    await Promise.all([
      procesar_BTC(semillas),
      // procesar_TRON(semillas),
    ]);

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
    guardarSeguimientoHistorico(indices);
  }
};
