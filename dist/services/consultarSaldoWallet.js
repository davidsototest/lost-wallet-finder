"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.consultarSaldoWallet = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
const promises_1 = require("timers/promises");
dotenv_1.default.config();
// Creamos una instancia de Axios con configuración personalizada
const axiosInstance = axios_1.default.create({
    headers: {
        // "Authorization": "Bearer BnjDLQ5rRtWCLnGM0KGOoXvGKFqwaGvzZIHQCDSLr54",
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64)`,
        "Accept-Language": "en-US",
    },
});
// Función asíncrona que recibe una dirección y consulta el API
const consultarSaldoWallet = async (address, retries = 3) => {
    try {
        const baseUrl = process.env.APIGETSALDOWALLET;
        //if (!baseUrl) throw new Error("Variable de entorno no definida");
        const response = await axiosInstance.get(`${baseUrl}/${address}/balance`);
        //console.log(`Respuesta recibida para la dirección ${address}:`, response.data);
        return response.data;
    }
    catch (error) {
        if (!axios_1.default.isAxiosError(error)) {
            throw error;
        }
        const status = error.response?.status;
        const shouldRetry = retries > 0 &&
            (status === 503 ||
                status === 429 ||
                error.code === "ECONNRESET" ||
                error.code === "ETIMEDOUT");
        // ❌ No reintentar → cortar ejecución
        if (!shouldRetry) {
            console.error("Error NO recuperable", { status, code: error.code });
            throw error;
        }
        console.warn(`Reintentando (${retries}) para ${address} - status ${status}`);
        // ⏱️ Espera 500 ms
        await (0, promises_1.setTimeout)(500);
        return (0, exports.consultarSaldoWallet)(address, retries - 1);
    }
};
exports.consultarSaldoWallet = consultarSaldoWallet;
