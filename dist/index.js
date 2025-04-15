"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { generarCombinacion } from "./process/combinar12Palabras";
const combinar12PalabrasRandom_1 = require("./process/combinar12PalabrasRandom");
const consultarWalletsVacias_1 = require("./process/consultarWalletsVacias");
const run = async () => {
    await (0, consultarWalletsVacias_1.consultarWalletsVacias)();
    // await generarCombinacion();
    await (0, combinar12PalabrasRandom_1.generarCombinacionRandom)();
};
run();
