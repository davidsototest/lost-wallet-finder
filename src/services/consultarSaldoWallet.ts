import axios from "axios";
import dotenv from "dotenv";
import { setTimeout } from "timers/promises";

export interface WalletResponseBTC {
  address: string;
  confirmed: number;
  unconfirmed: number;
  utxo: number;
  txs: number;
  received: number;
}

// Creamos una instancia de Axios con configuración personalizada
const axiosInstance = axios.create({
  headers: {
    // "Authorization": "Bearer BnjDLQ5rRtWCLnGM0KGOoXvGKFqwaGvzZIHQCDSLr54",
    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64)`,
    "Accept-Language": "en-US",
  },
});

// Función asíncrona que recibe una dirección y consulta el API
export const consultarSaldoWallet = async (
  address: string,
  retries = 3
): Promise<WalletResponseBTC> => {
  try {
    const baseUrl = "https://api.blockchain.info/haskoin-store/btc/address";
    //if (!baseUrl) throw new Error("Variable de entorno no definida");

    const response = await axiosInstance.get(`${baseUrl}/${address}/balance`);

    //console.log(`Respuesta recibida para la dirección ${address}:`, response.data);

    return response.data;
    
  } catch (error) {
    if (!axios.isAxiosError(error)) {
      throw error;
    }

    const status = error.response?.status;

    const shouldRetry =
      retries > 0 &&
      (status === 503 ||
        status === 429 ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT");

    // ❌ No reintentar → cortar ejecución
    if (!shouldRetry) {
      console.error("Error NO recuperable", { status, code: error.code });
      throw error;
    }

    console.warn(
      `Reintentando (${retries}) para ${address} - status ${status}`
    );

    // ⏱️ Espera 500 ms
    await setTimeout(500);

    return consultarSaldoWallet(address, retries - 1);
  }
};
