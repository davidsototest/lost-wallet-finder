"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToWallets = exports.contador = exports.addToWalletsConCash = exports.walletsConCashVar = void 0;
const combinar12PalabrasRandom_1 = require("./process/combinar12PalabrasRandom");
const consultarWalletsVacias_1 = require("./process/consultarWalletsVacias");
// sumar las wallets con cash
exports.walletsConCashVar = 0;
const addToWalletsConCash = (amount) => {
    exports.walletsConCashVar += amount;
};
exports.addToWalletsConCash = addToWalletsConCash;
// contador de cuantas wallets validamos
exports.contador = 0;
const addToWallets = (amount) => {
    exports.contador += amount;
};
exports.addToWallets = addToWallets;
const run = async () => {
    // Llama a la función que consulta wallets vacías 
    await (0, consultarWalletsVacias_1.consultarWalletsVacias)();
    // Llama a la función que genera combinaciones aleatorias
    // await generarCombinacionRandomII();
    // velocidad por dos
    await Promise.all([
        (0, combinar12PalabrasRandom_1.generarCombinacionRandomII)(),
        // generarCombinacion(),
        (0, combinar12PalabrasRandom_1.generarCombinacionRandomII)(),
        (0, combinar12PalabrasRandom_1.generarCombinacionRandomII)(),
        (0, combinar12PalabrasRandom_1.generarCombinacionRandomII)(),
        // generarCombinacionRandomII(),
        // generarCombinacionRandomII(),
        // generarCombinacionRandomII()
    ]);
    // llama a la funcion de generar combinaciones ordenadas
    // await generarCombinacion();
};
run();
