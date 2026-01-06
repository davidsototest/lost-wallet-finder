import { consultarWalletsVacias } from "./utils/consultarWalletsVacias";


// consultar wallets vacias a ver si ingreso dinero

const run = async (): Promise<void> => {
 
    await consultarWalletsVacias();
};

run();
