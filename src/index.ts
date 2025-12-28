import { enviarMensajeTelegramStart } from "./process/telegram/telegram";
import { getLocalIp } from "./utils/getIp";
import os from "os";
import path from "path";
import { Worker, isMainThread } from "worker_threads";


export type Indices = number[];

// interface de los datos de mapeo
export interface CoreStats {
  workerId: number;
  inicio: Indices | null;
  fin: Indices | null;
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

  console.log("Núcleos disponibles:", CPU_COUNT);

  // Iniciar workers
  const workers: Promise<void>[] = [];

  // 1 Procesar combinaciones con los arrays recibidos por cada núcleo
  for (let i = 0; i < CPU_COUNT; i++) {
    // Asignar los datos de worker
    coreStats.set(i, {
      workerId: i,
      inicio: null,
      fin: null,
      ciclos: 1,
      walletsProcesadas: 0,
      lastUpdate: Date.now(),
    });

    new Worker(path.resolve(__dirname, "./worker_threads/worker.js"), {
      workerData: {
        ip,
        workerId: i,
      },
    });
  }

  // imprimir data cada 10 segundos
  setInterval(() => {
    console.table(
      [...coreStats.values()].map((c) => ({
        core: c.workerId,
        range:
          c.inicio && c.fin
            ? `[${c.inicio[0]},${c.inicio.at(1)}]..[${c.inicio[2]} / ${c.fin[0]},${c.fin[1]}]..[${c.fin[2]}]`
            : "-",
        ciclos: c.ciclos,
        wallets: c.walletsProcesadas,
      }))
    );

    console.log("TOTAL wallets procesadas:", contador);
  }, 10000);
};

if (isMainThread) {
  run();
}


/////////////////////////////////////////////////////////

type WorkerMessage =
  | { type: "range_start"; workerId: number; inicio: number[]; fin: number[] }
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
