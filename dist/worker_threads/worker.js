"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const combinar12Palabras_1 = require("../process/combinar12Palabras");
const getIndiceTask_1 = require("../services/getIndiceTask");
const telegram_1 = require("../process/telegram/telegram");
const { ip, workerId } = worker_threads_1.workerData;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let finished = false;
const runWorker = async () => {
    (0, telegram_1.enviarMensajeTelegramStart)(`Bot iniciado exitosamente... IP: ${ip}, núcleo: ${workerId}`);
    while (true) {
        try {
            // 🔹 UNA sola llamada: devuelve rango válido
            const tarea = await (0, getIndiceTask_1.getIndiceTask)(ip, workerId, finished);
            finished = false; // reset inmediato
            if (!tarea?.inicio || !tarea?.fin) {
                await sleep(2000);
                continue;
            }
            const { inicio, fin } = tarea;
            const iLen = inicio.length;
            const fLen = fin.length;
            // 📤 informar inicio de rango
            worker_threads_1.parentPort.postMessage({
                type: "range_start",
                workerId,
                inicio: `${inicio[0]}, ${inicio[1]}, ${inicio[2]}... ${inicio[10]} ${inicio[11]}`,
                fin: `${fin[0]}, ${fin[1]}, ${fin[2]}... ${fin[10]} ${fin[11]}`,
            });
            // 🔥 trabajo pesado
            await (0, combinar12Palabras_1.generarCombinacion)(inicio, fin);
            // 📤 informar finalización
            worker_threads_1.parentPort.postMessage({
                type: "range_done",
                workerId,
                wallets: 147112,
            });
            // 🔁 en la SIGUIENTE iteración avisamos que terminó
            finished = true;
        }
        catch (err) {
            console.error(`Worker ${workerId} error:`, err);
            await sleep(2000);
        }
    }
};
runWorker();
