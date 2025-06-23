"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToWallets = exports.contador = exports.addToWalletsConCash = exports.walletsConCashVar = void 0;
// worker.ts (o worker.js tras compilar en dist/)
const worker_threads_1 = require("worker_threads");
const combinar12Palabras_1 = require("./process/combinar12Palabras");
const combinar12PalabrasRandom_1 = require("./process/combinar12PalabrasRandom");
const consultarWalletsVacias_1 = require("./process/consultarWalletsVacias");
async function runTask(fnName) {
    switch (fnName) {
        case 'generarCombinacion':
            return (0, combinar12Palabras_1.generarCombinacion)();
        case 'generarCombinacionRandomII':
            return (0, combinar12PalabrasRandom_1.generarCombinacionRandomII)();
        case 'consultarWalletsVacias':
            return (0, consultarWalletsVacias_1.consultarWalletsVacias)();
        default:
            throw new Error(`Tarea desconocida: ${fnName}`);
    }
}
// Solo en contexto de worker (isMainThread === false)
if (!worker_threads_1.isMainThread) {
    runTask(worker_threads_1.workerData.fnName)
        .then(result => worker_threads_1.parentPort.postMessage({ result }))
        .catch(error => worker_threads_1.parentPort.postMessage({ error: error.message }));
}
// Contadores locales a cada worker
exports.walletsConCashVar = 0;
const addToWalletsConCash = (amount) => {
    exports.walletsConCashVar += amount;
};
exports.addToWalletsConCash = addToWalletsConCash;
exports.contador = 0;
const addToWallets = (amount) => {
    exports.contador += amount;
};
exports.addToWallets = addToWallets;
