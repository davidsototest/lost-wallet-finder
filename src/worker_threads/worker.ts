import { parentPort, workerData } from "worker_threads";
import { generarCombinacion } from "../process/combinar12Palabras";
import { getIndiceTask } from "../services/getIndiceTask";
import { enviarMensajeTelegramStart } from "../process/telegram/telegram";
import { coreStats } from "..";

const { ip, workerId } = workerData;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let finished = false;

const runWorker = async () => {
  enviarMensajeTelegramStart(
    `Bot iniciado exitosamente... IP: ${ip}, núcleo: ${workerId}`
  );

  while (true) {
    try {
      // 🔹 UNA sola llamada: devuelve rango válido
      const tarea = await getIndiceTask(ip, workerId, finished);

      finished = false; // reset inmediato

      if (!tarea?.inicio || !tarea?.fin) {
        await sleep(2000);
        continue;
      }

      const { inicio, fin } = tarea;

      const iLen = inicio.length;
      const fLen = fin.length;

      // 📤 informar inicio de rango
      parentPort!.postMessage({
        type: "range_start",
        workerId,
        inicio: `${inicio[0]}, ${inicio[1]}, ${inicio[2]}... ${inicio[10]} ${inicio[11]}`,
        fin: `${fin[0]}, ${fin[1]}, ${fin[2]}... ${fin[10]} ${fin[11]}`,
      });

      // 🔥 trabajo pesado
      await generarCombinacion(inicio, fin);

      // 📤 informar finalización
      parentPort!.postMessage({
        type: "range_done",
        workerId,
        wallets: 147112,
      });

      // 🔁 en la SIGUIENTE iteración avisamos que terminó
      finished = true;
    } catch (err) {
      console.error(`Worker ${workerId} error:`, err);
      await sleep(2000);
    }
  }
};

runWorker();
