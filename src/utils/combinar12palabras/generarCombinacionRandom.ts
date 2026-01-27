import { validateMnemonic } from "bip39-ts";
import { diccionarioMezclado } from "../../data/diccionario/diccionarioBIP39";
import { procesar_BTC } from "../procesar/procesar_BTC";
import crypto from "crypto";

export const generarCombinacionRandom = async (): Promise<void> => {

  const TOTAL_PALABRAS = diccionarioMezclado.length; // 2048

  while (true) {

    // 1️⃣ Crear 12 índices aleatorios
    const indices: number[] = [];

    for (let i = 0; i < 12; i++) {
      indices.push(crypto.randomInt(0, TOTAL_PALABRAS));
    }

    // 2️⃣ Convertir a palabras
    const palabras = indices.map(i => diccionarioMezclado[i]);
    const semilla = palabras.join(" ");

    // 3️⃣ Validar
    if (validateMnemonic(semilla)) {
      await procesar_BTC(semilla);
    }
  }
};
