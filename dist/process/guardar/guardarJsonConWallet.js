"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.guardarJsonConWallet = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const guardarJsonConWallet = async (datos_BTC, ruta) => {
    try {
        // Ruta base: data/walletsConCash
        const dirPath = path_1.default.resolve(process.cwd(), "dist", "data", ruta);
        // Crear carpeta si no existe
        if (!fs_1.default.existsSync(dirPath)) {
            fs_1.default.mkdirSync(dirPath, { recursive: true });
        }
        // Nombre del archivo = dirección BTC
        const fileName = `${datos_BTC.direccion}.json`;
        const filePath = path_1.default.join(dirPath, fileName);
        // Guardar JSON (formateado)
        await fs_1.default.promises.writeFile(filePath, JSON.stringify(datos_BTC, null, 2), "utf-8");
        console.log(`✅ Wallet ${datos_BTC.direccion}, guardada en ${filePath}`);
    }
    catch (error) {
        console.error("❌ Error guardando wallet con cash:", error);
    }
};
exports.guardarJsonConWallet = guardarJsonConWallet;
