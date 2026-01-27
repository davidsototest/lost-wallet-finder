import { parentPort, workerData } from "worker_threads";
import { enviarMensajeTelegramStart } from "../utils/telegram/telegram";
import { generarCombinacionRandom } from "../utils/combinar12palabras/generarCombinacionRandom";

const { ip, workerId } = workerData;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

let finished = false;

const runWorker = async () => {
  enviarMensajeTelegramStart(
    `Bot iniciado exitosamente... IP: ${ip}, núcleo: ${workerId}`
  );

  while (true) {
    try {

      // 🔥 trabajo pesado
      await generarCombinacionRandom();

    } catch (err) {
      console.error(`Worker ${workerId} error:`, err);
      await sleep(2000);
    }
  }
};

runWorker();
