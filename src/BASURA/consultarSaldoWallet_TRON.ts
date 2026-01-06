// import axios from "axios";
// import dotenv from "dotenv";
// import { setTimeout } from "timers/promises";
// dotenv.config();

// export interface WalletResponse {
//   transactions_in: number;
//   data: DataItem[];
// };

// export interface DataItem {
//   tokenAbbr: string;
//   balance: string;
// };

// // mis apikey
// const apiKeys = [ 
//   process.env.XTRONSCAN_APIKEY1, 
//   process.env.XTRONSCAN_APIKEY2,
//   process.env.XTRONSCAN_APIKEY3,
//   process.env.XTRONSCAN_APIKEY4,
//   process.env.XTRONSCAN_APIKEY5,
// ];

// let apiKeyIndex = 0;

// //alternar las apikey
// function getNextApiKey(): string {
//   const key = apiKeys[apiKeyIndex];
//   apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
//   return key!;
// };


// // Función asíncrona que recibe una dirección y consulta el API
// export const consultarSaldoWallet_TRON = async (
//   address: string
// ): Promise<WalletResponse> => {
//   try {
//     const baseUrl = process.env.APIGETSALDOWALLETTRON;
//     if (!baseUrl)
//       throw new Error("Variable de entorno APIGETSALDOWALLETTRON no definida");

//     const currentApiKey = getNextApiKey();

//     const axiosInstance = axios.create({
//       headers: {
//         "Content-Type": "application/json",
//         "TRON-PRO-API-KEY": currentApiKey,
//       },
//     });

//     const response = await axiosInstance.get(`${baseUrl}?address=${address}`);
//     const raw = response.data;

//     // Validamos si 'withPriceTokens' es un array
//     const tokens = Array.isArray(raw.withPriceTokens)
//       ? raw.withPriceTokens
//       : [];

//     const filteredData: DataItem[] = tokens.map((item: any) => ({
//       tokenAbbr: item.tokenAbbr,
//       balance: item.balance,
//     }));

//     return {
//       transactions_in: raw.transactions_in ?? 0,
//       data: filteredData,
//     };
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       const shouldRetry =
//         error.response?.status === 503 ||
//         error.code === "ECONNRESET" ||
//         error.code === "ETIMEDOUT";

//       if (shouldRetry) {
//         await setTimeout(1000);
//         return consultarSaldoWallet_TRON(address);
//       }
//       throw error;
//     }
//     throw new Error(
//       `Error inesperado: ${
//         error instanceof Error ? error.message : "Desconocido"
//       }`
//     );
//   }
// };


export {};