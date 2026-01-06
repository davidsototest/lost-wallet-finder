import { enviarMensajeTelegramStart } from "./utils/telegram/telegram";
import { getLocalIp } from "./utils/getIp";
import os from "os";
import path from "path";
import { Worker, isMainThread } from "worker_threads";
import { delay } from "./utils/delay";

// interface de los datos de mapeo
export interface CoreStats {
  workerId: number;
  inicio: string | null;
  fin: string | null;
  ciclos: number;
  walletsProcesadas: number;
  lastUpdate: number;
}

// central de datos
export const coreStats = new Map<number, CoreStats>();

// contador de wallets consultadas y con cash
export let walletsConCashVar = 0;
export const addToWalletsConCash = (amount: number) => {
  walletsConCashVar += amount;
};
export const CPU_COUNT = os.availableParallelism?.() ?? os.cpus().length;

// aqui debe ir la cantidad de wallets consultadas, cada vez que el nucleo
// manda a sumar 1000 a esta variable, solo cuando el nucleo termina.
export let contador = 0;
export const addToWallets = (amount: number) => {
  contador += amount;
};

const run = async (): Promise<void> => {
  const ip = getLocalIp() ?? "IP no encontrada";

  // saber cuantos nucleos tiene esta maquina
  console.log("Núcleos disponibles:", CPU_COUNT);

  //notificar por telegram que se inició el proceso
  await enviarMensajeTelegramStart(`nueva maquina iniciada con ip: ${ip}, y cantidad de nucleos: ${CPU_COUNT}`);

  // Iniciar workers
  const workers: Promise<void>[] = [];

  // 1 Procesar combinaciones con los arrays recibidos por cada núcleo
  for (let i = 0; i < 1; i++) {
    // Asignar los datos de worker
    coreStats.set(i, {
      workerId: i,
      inicio: null,
      fin: null,
      ciclos: 1,
      walletsProcesadas: 0,
      lastUpdate: Date.now(),
    });

    // Crear el worker
    new Worker(path.resolve(__dirname, "./worker_threads/worker.js"), {
      workerData: {
        ip,
        workerId: i,
      },
    });

    // Esperar 3 segundos antes de iniciar el siguiente worker
    // para que de tiempo que el servicio asigne un rango distinto
    await delay(5000);
  }

  // imprimir data cada 10 segundos
  setInterval(() => {
    console.clear();
    console.log("Estado de los núcleos:");

    let totalWallets = 0;
    coreStats.forEach(c => {
      totalWallets += c.walletsProcesadas;
    });
    
    console.table(
      [...coreStats.values()].map((c) => ({
        core: c.workerId,
        range:
          c.inicio && c.fin
            ? `${c.inicio} / ${c.fin}`
            : "-",
        ciclos: c.ciclos,
        wallets: c.walletsProcesadas,
      }))
    );

    console.log("TOTAL wallets procesadas:", contador);
    console.log("Wallets con cash:", walletsConCashVar);
  }, 10000);
};

if (isMainThread) {
  run();
}


/////////////////////////////////////////////////////////

type WorkerMessage =
  | { type: "range_start"; workerId: number; inicio: string; fin: string }
  | { type: "range_done"; workerId: number; wallets: number }
  | { type: "heartbeat"; workerId: number };

export function handleWorkerMessage(msg: WorkerMessage) {
  const core = coreStats.get(msg.workerId);
  if (!core) return;

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
      contador += msg.wallets; // contador global
      break;

    case "heartbeat":
      // solo mantiene vivo
      break;
  }
}
