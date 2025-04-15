// import { generarCombinacion } from "./process/combinar12Palabras";
import { generarCombinacionRandom } from "./process/combinar12PalabrasRandom";
import { consultarWalletsVacias } from "./process/consultarWalletsVacias";

const run = async (): Promise<void> => {
  await consultarWalletsVacias();
  // await generarCombinacion();
  await generarCombinacionRandom();
};

run();
