"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combinar12PalabrasRandom_1 = require("./process/combinar12PalabrasRandom");
const consultarWalletsVacias_1 = require("./process/consultarWalletsVacias");
const run = async () => {
    // Llama a la función que consulta wallets vacías 
    await (0, consultarWalletsVacias_1.consultarWalletsVacias)();
    // Llama a la función que genera combinaciones aleatorias
    await (0, combinar12PalabrasRandom_1.generarCombinacionRandom)();
};
run();
