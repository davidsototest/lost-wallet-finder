"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarSaldoWallet_TRON = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = require("timers/promises");
dotenv_1.default.config();
;
;
// mis apikey
const apiKeys = [
    process.env.XTRONSCAN_APIKEY1,
    process.env.XTRONSCAN_APIKEY2,
    process.env.XTRONSCAN_APIKEY3,
    process.env.XTRONSCAN_APIKEY4,
    process.env.XTRONSCAN_APIKEY5,
];
let apiKeyIndex = 0;
//alternar las apikey
function getNextApiKey() {
    const key = apiKeys[apiKeyIndex];
    apiKeyIndex = (apiKeyIndex + 1) % apiKeys.length;
    return key;
}
;
// Función asíncrona que recibe una dirección y consulta el API
const consultarSaldoWallet_TRON = async (address) => {
    try {
        const baseUrl = process.env.APIGETSALDOWALLETTRON;
        if (!baseUrl)
            throw new Error("Variable de entorno APIGETSALDOWALLETTRON no definida");
        const currentApiKey = getNextApiKey();
        const axiosInstance = axios_1.default.create({
            headers: {
                "Content-Type": "application/json",
                "TRON-PRO-API-KEY": currentApiKey,
            },
        });
        const response = await axiosInstance.get(`${baseUrl}?address=${address}`);
        const raw = response.data;
        // Validamos si 'withPriceTokens' es un array
        const tokens = Array.isArray(raw.withPriceTokens)
            ? raw.withPriceTokens
            : [];
        const filteredData = tokens.map((item) => ({
            tokenAbbr: item.tokenAbbr,
            balance: item.balance,
        }));
        return {
            transactions_in: raw.transactions_in ?? 0,
            data: filteredData,
        };
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const shouldRetry = error.response?.status === 503 ||
                error.code === "ECONNRESET" ||
                error.code === "ETIMEDOUT";
            if (shouldRetry) {
                await (0, promises_1.setTimeout)(1000);
                return (0, exports.consultarSaldoWallet_TRON)(address);
            }
            throw error;
        }
        throw new Error(`Error inesperado: ${error instanceof Error ? error.message : "Desconocido"}`);
    }
};
exports.consultarSaldoWallet_TRON = consultarSaldoWallet_TRON;
