"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToWallets = exports.contador = exports.CPU_COUNT = exports.addToWalletsConCash = exports.walletsConCashVar = exports.coreStats = void 0;
exports.handleWorkerMessage = handleWorkerMessage;
const telegram_1 = require("./utils/telegram/telegram");
const getIp_1 = require("./utils/getIp");
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const worker_threads_1 = require("worker_threads");
const delay_1 = require("./utils/delay");
// central de datos
exports.coreStats = new Map();
// contador de wallets consultadas y con cash
exports.walletsConCashVar = 0;
const addToWalletsConCash = (amount) => {
    exports.walletsConCashVar += amount;
};
exports.addToWalletsConCash = addToWalletsConCash;
exports.CPU_COUNT = os_1.default.availableParallelism?.() ?? os_1.default.cpus().length;
// aqui debe ir la cantidad de wallets consultadas, cada vez que el nucleo
// manda a sumar 1000 a esta variable, solo cuando el nucleo termina.
exports.contador = 0;
const addToWallets = (amount) => {
    exports.contador += amount;
};
exports.addToWallets = addToWallets;
const run = async () => {
    const ip = (0, getIp_1.getLocalIp)() ?? "IP no encontrada";
    // saber cuantos nucleos tiene esta maquina
    console.log("Núcleos disponibles:", exports.CPU_COUNT);
    //notificar por telegram que se inició el proceso
    await (0, telegram_1.enviarMensajeTelegramStart)(`nueva maquina iniciada con ip: ${ip}, y cantidad de nucleos: ${exports.CPU_COUNT}`);
    // Iniciar workers
    const workers = [];
    // 1 Procesar combinaciones con los arrays recibidos por cada núcleo
    for (let i = 0; i < 1; i++) {
        // Asignar los datos de worker
        exports.coreStats.set(i, {
            workerId: i,
            inicio: null,
            fin: null,
            ciclos: 1,
            walletsProcesadas: 0,
            lastUpdate: Date.now(),
        });
        // Crear el worker
        new worker_threads_1.Worker(path_1.default.resolve(__dirname, "./worker_threads/worker.js"), {
            workerData: {
                ip,
                workerId: i,
            },
        });
        // Esperar 3 segundos antes de iniciar el siguiente worker
        // para que de tiempo que el servicio asigne un rango distinto
        await (0, delay_1.delay)(5000);
    }
    // imprimir data cada 10 segundos
    // setInterval(() => {
    //   console.clear();
    //   console.log("Estado de los núcleos:");
    //   let totalWallets = 0;
    //   coreStats.forEach(c => {
    //     totalWallets += c.walletsProcesadas;
    //   });
    //   // console.table(
    //   //   [...coreStats.values()].map((c) => ({
    //   //     core: c.workerId,
    //   //     range:
    //   //       c.inicio && c.fin
    //   //         ? `${c.inicio} / ${c.fin}`
    //   //         : "-",
    //   //     ciclos: c.ciclos,
    //   //     wallets: c.walletsProcesadas,
    //   //   }))
    //   // );
    //   // console.log("TOTAL wallets procesadas:", contador);
    //   // console.log("Wallets con cash:", walletsConCashVar);
    // }, 10000);
};
if (worker_threads_1.isMainThread) {
    run();
}
function handleWorkerMessage(msg) {
    const core = exports.coreStats.get(msg.workerId);
    if (!core)
        return;
    core.lastUpdate = Date.now();
    switch (msg.type) {
        case "range_start":
            core.inicio = msg.inicio;
            core.fin = msg.fin;
            // ✅ debug: validar que el mensaje llegó
            console.log(`Worker ${msg.workerId} envió range_start:`, msg.inicio, msg.fin);
            break;
        case "range_done":
            core.ciclos++;
            core.walletsProcesadas += msg.wallets;
            exports.contador += msg.wallets; // contador global
            break;
        case "heartbeat":
            // solo mantiene vivo
            break;
    }
}
