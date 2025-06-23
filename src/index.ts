
import { generarCombinacion } from "./process/combinar12Palabras";
import { generarCombinacionRandomII } from './process/combinar12PalabrasRandom';
import { consultarWalletsVacias } from "./process/consultarWalletsVacias";

// sumar las wallets con cash
export let walletsConCashVar = 0;
export const addToWalletsConCash = (amount: number) => {
  walletsConCashVar += amount;
};

 // contador de cuantas wallets validamos
export let contador = 0;
export const addToWallets = (amount: number) => {
  contador += amount;
};

const run = async (): Promise<void> => {

  // Llama a la función que consulta wallets vacías 
  await consultarWalletsVacias();

  // velocidad por dos
  await Promise.all([
    generarCombinacionRandomII(),
    generarCombinacion(),
    generarCombinacionRandomII(),
    generarCombinacionRandomII(),
    generarCombinacionRandomII(),
    generarCombinacionRandomII(),
    generarCombinacionRandomII(),
    generarCombinacionRandomII(),
    generarCombinacionRandomII(),
  ]);
};

run();


