import { generarCombinacion } from "./process/combinar12Palabras";
import { enviarMensajeTelegramStart } from "./process/telegram/telegram";
import { getIndiceTask, TaskDocResponse } from "./services/getIndiceTask";
import { getLocalIp } from './utils/getIp';

// indice inicio y fin
export let indiceInicio: number[] = [];
export let indiceFin: number[] = [];

export let contadorCiclos = 0;

// contador de wallets consultadas y con cash
export let walletsConCashVar = 0;
export const addToWalletsConCash = (amount: number) => {
  walletsConCashVar += amount;
};

// contador de wallets consultadas
export let contador = 0;
export const addToWallets = (amount: number) => {
  contador += amount;
};

const run = async (): Promise<void> => {
  const ip = getLocalIp() ?? "IP no encontrada";

  // Notificar inicio del bot
  enviarMensajeTelegramStart("Bot iniciado exitosamente... IP: " + ip);

  while (true) {
    try {
      // 1️⃣ Consultar servicio para obtener índices (sin status)
      const tarea: TaskDocResponse = await getIndiceTask(ip);

      // 🔄 guardar indices
      indiceInicio = tarea.inicio;
      indiceFin = tarea.fin;

      // 🔄 Reiniciar contadores para nueva tarea
      contador = 0;
      walletsConCashVar = 0;
      contadorCiclos++;

      // 2️⃣ Procesar combinaciones con los arrays recibidos
      await generarCombinacion(tarea.inicio, tarea.fin);

      // 3️⃣ Notificar al servicio que terminó la tarea (status: true)
      await getIndiceTask(ip, true); // enviando status true para recibir nueva tarea

      // El ciclo continúa automáticamente
    } catch (err) {
      console.error('Error en el bucle del bot:', err);
      // Opcional: esperar unos segundos antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

run();
