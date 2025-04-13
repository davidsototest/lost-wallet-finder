import axios from "axios";
import dotenv from "dotenv";
import { setTimeout } from "timers/promises";
dotenv.config();

interface WalletResponse {
  address: string;
  confirmed: number;
  unconfirmed: number;
  utxo: number;
  txs: number;
  received: number;
};

// Creamos una instancia de Axios con configuración personalizada
const axiosInstance = axios.create({
  headers: {
    // "Authorization": "Bearer BnjDLQ5rRtWCLnGM0KGOoXvGKFqwaGvzZIHQCDSLr54",
    "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64)`,
    "Accept-Language": "en-US",
  },
});

// Función asíncrona que recibe una dirección y consulta el API
export const consultarSaldoWallet = async (address: string): Promise<WalletResponse> => {
  try {
    const baseUrl = process.env.APIGETSALDOWALLET;
    if (!baseUrl) throw new Error("Variable de entorno no definida");

    const response = await axiosInstance.get(`${baseUrl}/${address}/balance`);
    
    return response.data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
      const shouldRetry = 
        error.response?.status === 503 ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT";
        
        await setTimeout(1000);
        return consultarSaldoWallet(address);
      } else {
        throw new Error(`Error de conexión: ${error instanceof Error ? error.message : "Desconocido"}`);
      }
    }
};
