"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leerWalletsDesdeCarpeta = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Función para leer wallets desde la carpeta dist/data/walletsConMovimientos
// son wallets que ya tienen movimientos, las guardamos ahi para luego consultarlas
const leerWalletsDesdeCarpeta = () => {
    const wallets = [];
    // Ruta: dist/data/walletsConMovimientos
    const dirPath = path_1.default.resolve(process.cwd(), "dist", "data", "walletsConMovimientos");
    if (!fs_1.default.existsSync(dirPath)) {
        console.warn("⚠️ Carpeta walletsConMovimientos no existe");
        return wallets;
    }
    const files = fs_1.default.readdirSync(dirPath).filter(f => f.endsWith(".json"));
    for (const file of files) {
        try {
            const filePath = path_1.default.join(dirPath, file);
            const content = fs_1.default.readFileSync(filePath, "utf-8");
            const wallet = JSON.parse(content);
            // Validación mínima
            if (wallet?.direccion && wallet?.wallet_de) {
                wallets.push(wallet);
            }
        }
        catch (err) {
            console.error(`❌ Error leyendo ${file}:`, err);
        }
    }
    return wallets;
};
exports.leerWalletsDesdeCarpeta = leerWalletsDesdeCarpeta;
