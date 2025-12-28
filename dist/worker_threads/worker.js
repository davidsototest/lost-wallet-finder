"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const combinar12Palabras_1 = require("../process/combinar12Palabras");
const getIndiceTask_1 = require("../services/getIndiceTask");
const telegram_1 = require("../process/telegram/telegram");
const { ip, workerId } = worker_threads_1.workerData;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const runWorker = async () => {
    while (true) {
        try {
            // Notificar inicio del bot
            (0, telegram_1.enviarMensajeTelegramStart)(`Bot iniciado exitosamente... IP: ${ip}, nucleo numero: ${workerId}`);
            // 🔹 pedir rango EXCLUSIVO para este núcleo
            const tarea = await (0, getIndiceTask_1.getIndiceTask)(ip, workerId);
            if (!tarea || !tarea.inicio || !tarea.fin) {
                await sleep(2000);
                continue;
            }
            const { inicio, fin } = tarea;
            const iLen = inicio.length;
            const fLen = fin.length;
            // guardar la data al inicio de cada ciclo
            worker_threads_1.parentPort.postMessage({
                type: "range_start",
                workerId,
                inicio: [inicio[0], inicio[Math.max(iLen - 2, 0)], inicio[iLen - 1]],
                fin: [fin[0], fin[Math.max(fLen - 2, 0)], fin[fLen - 1]],
            });
            // 🔥 trabajo pesado, procesar wallet
            await (0, combinar12Palabras_1.generarCombinacion)(inicio, fin);
            //   guardar los datos en el master al terminar
            worker_threads_1.parentPort.postMessage({
                type: "range_done",
                workerId,
                wallets: 1000,
            });
            // 🔹 notificar que ESTE rango terminó
            await (0, getIndiceTask_1.getIndiceTask)(ip, workerId, true);
        }
        catch (err) {
            console.error(`Worker ${workerId} error:`, err);
            await sleep(2000);
        }
    }
};
runWorker();
// (async () => {
//   const {
//     inicio,
//     fin,
//     workerId,
//   } = workerData;
//   await generarCombinacion(inicio, fin);
//   parentPort?.close();
// })();
