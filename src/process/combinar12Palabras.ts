import { addToWallets } from "..";
import { diccionarioMezclado } from "../data/diccionario/diccionarioBIP39";
import { incrementArray } from "../utils/incrementArray";
import { procesar_BTC } from "./procesar/procesar_BTC";
import { validateMnemonic } from "bip39-ts";

/**
 * Genera combinaciones de palabras BIP39 entre un rango de índices
 * @param inicio Array de 12 números que indica el índice inicial
 * @param fin Array de 12 números que indica el índice final
 */
export const generarCombinacion = async (inicio: number[], fin: number[]): Promise<void> => {
  // Copiamos el array de inicio para manipularlo
  let indices = [...inicio];

  while (true) {

    // Mapeamos las palabras según los índices actuales
    const palabras = indices.map(i => diccionarioMezclado[i]);
    const semillas = palabras.join(" ");

    //sumar uno al contador
    addToWallets(2);

    // Validar que la frase sea mnemónica válida
    if (validateMnemonic(semillas)) {
      // Procesamos BTC (y TRON si quieres agregarlo)
      await procesar_BTC(semillas);
    }

    // Verificar si llegamos al fin
    let finAlcanzado = true;
    for (let i = 0; i < 12; i++) {
      if (indices[i] !== fin[i]) {
        finAlcanzado = false;
        break;
      }
    }

    if (finAlcanzado) {
      console.log("Se alcanzó el índice final. Combinaciones completadas.");
      break;
    }

    // Incrementar índices usando lógica de carry (base diccionario.length)
    indices = incrementArray(indices, 1);
  }
};
