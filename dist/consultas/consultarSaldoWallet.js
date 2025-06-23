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
;
// Creamos una instancia de Axios con configuración personalizada
const axiosInstance = axios_1.default.create({
    headers: {
        // "Authorization": "Bearer BnjDLQ5rRtWCLnGM0KGOoXvGKFqwaGvzZIHQCDSLr54",
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64)`,
        "Accept-Language": "en-US",
    },
});
// Función asíncrona que recibe una dirección y consulta el API
const consultarSaldoWallet = async (address) => {
    try {
        const baseUrl = process.env.APIGETSALDOWALLET;
        if (!baseUrl)
            throw new Error("Variable de entorno no definida");
        const response = await axiosInstance.get(`${baseUrl}/${address}/balance`);
        return response.data;
    }
    catch (error) {
        if (axios_1.default.isAxiosError(error)) {
            const shouldRetry = error.response?.status === 503 ||
                error.code === "ECONNRESET" ||
                error.code === "ETIMEDOUT";
            await (0, promises_1.setTimeout)(1000);
            return (0, exports.consultarSaldoWallet)(address);
        }
        else {
            throw new Error(`Error de conexión: ${error instanceof Error ? error.message : "Desconocido"}`);
        }
    }
};
exports.consultarSaldoWallet = consultarSaldoWallet;
