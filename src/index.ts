
// import { generarCombinacion } from "./process/combinar12Palabras";
import { generarCombinacionRandomII } from './process/combinar12PalabrasRandom';
import { consultarWalletsVacias } from "./process/consultarWalletsVacias";


const run = async (): Promise<void> => {

  // Llama a la función que consulta wallets vacías 
  await consultarWalletsVacias();

  // Llama a la función que genera combinaciones aleatorias
  await generarCombinacionRandomII();

  // llama a la funcion de generar combinaciones ordenadas
  // await generarCombinacion();
};

run();
