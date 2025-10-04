"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToWallets = exports.contador = exports.addToWalletsConCash = exports.walletsConCashVar = exports.contadorCiclos = exports.indiceFin = exports.indiceInicio = void 0;
const combinar12Palabras_1 = require("./process/combinar12Palabras");
const telegram_1 = require("./process/telegram/telegram");
const getIndiceTask_1 = require("./services/getIndiceTask");
const getIp_1 = require("./utils/getIp");
// indice inicio y fin
exports.indiceInicio = [];
exports.indiceFin = [];
exports.contadorCiclos = 0;
// contador de wallets consultadas y con cash
exports.walletsConCashVar = 0;
const addToWalletsConCash = (amount) => {
    exports.walletsConCashVar += amount;
};
exports.addToWalletsConCash = addToWalletsConCash;
// contador de wallets consultadas
exports.contador = 0;
const addToWallets = (amount) => {
    exports.contador += amount;
};
exports.addToWallets = addToWallets;
const run = async () => {
    const ip = (0, getIp_1.getLocalIp)() ?? "IP no encontrada";
    // Notificar inicio del bot
    (0, telegram_1.enviarMensajeTelegramStart)("Bot iniciado exitosamente... IP: " + ip);
    while (true) {
        try {
            // 1️⃣ Consultar servicio para obtener índices (sin status)
            const tarea = await (0, getIndiceTask_1.getIndiceTask)(ip);
            // 🔄 guardar indices
            exports.indiceInicio = tarea.inicio;
            exports.indiceFin = tarea.fin;
            // 🔄 Reiniciar contadores para nueva tarea
            exports.contador = 0;
            exports.walletsConCashVar = 0;
            exports.contadorCiclos++;
            // 2️⃣ Procesar combinaciones con los arrays recibidos
            await (0, combinar12Palabras_1.generarCombinacion)(tarea.inicio, tarea.fin);
            // 3️⃣ Notificar al servicio que terminó la tarea (status: true)
            await (0, getIndiceTask_1.getIndiceTask)(ip, true); // enviando status true para recibir nueva tarea
            // El ciclo continúa automáticamente
        }
        catch (err) {
            console.error('Error en el bucle del bot:', err);
            // Opcional: esperar unos segundos antes de reintentar
            await new Promise(resolve => setTimeout(resolve, 5000));
        }
    }
};
run();
