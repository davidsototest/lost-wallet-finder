"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const telegram_1 = require("../utils/telegram/telegram");
const generarCombinacionRandom_1 = require("../utils/combinar12palabras/generarCombinacionRandom");
const { ip, workerId } = worker_threads_1.workerData;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let finished = false;
const runWorker = async () => {
    (0, telegram_1.enviarMensajeTelegramStart)(`Bot iniciado exitosamente... IP: ${ip}, núcleo: ${workerId}`);
    while (true) {
        try {
            // 🔥 trabajo pesado
            await (0, generarCombinacionRandom_1.generarCombinacionRandom)();
        }
        catch (err) {
            console.error(`Worker ${workerId} error:`, err);
            await sleep(2000);
        }
    }
};
runWorker();
