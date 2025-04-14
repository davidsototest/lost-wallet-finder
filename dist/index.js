"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const combinar12Palabras_1 = require("./process/combinar12Palabras");
const consultarWalletsVacias_1 = require("./process/consultarWalletsVacias");
const run = async () => {
    await (0, consultarWalletsVacias_1.consultarWalletsVacias)();
    await (0, combinar12Palabras_1.generarCombinacion)();
};
run();
