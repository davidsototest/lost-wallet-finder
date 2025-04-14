import { generarCombinacion } from "./process/combinar12Palabras";
import { consultarWalletsVacias } from "./process/consultarWalletsVacias";

const run = async (): Promise<void> => {
  await consultarWalletsVacias();
  await generarCombinacion();
};

run();
