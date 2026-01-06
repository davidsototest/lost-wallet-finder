import fs from "fs";
import path from "path";
import { WalletConCashItem } from "../interface/WalletConCashItem.interface";

// Función para leer wallets desde la carpeta dist/data/walletsConMovimientos
// son wallets que ya tienen movimientos, las guardamos ahi para luego consultarlas

export const leerWalletsDesdeCarpeta = (): WalletConCashItem[] => {
  const wallets: WalletConCashItem[] = [];

  // Ruta: dist/data/walletsConMovimientos
  const dirPath = path.resolve(
    process.cwd(),
    "dist",
    "data",
    "walletsConMovimientos"
  );

  if (!fs.existsSync(dirPath)) {
    console.warn("⚠️ Carpeta walletsConMovimientos no existe");
    return wallets;
  }

  const files = fs.readdirSync(dirPath).filter(f => f.endsWith(".json"));

  for (const file of files) {
    try {
      const filePath = path.join(dirPath, file);
      const content = fs.readFileSync(filePath, "utf-8");
      const wallet = JSON.parse(content) as WalletConCashItem;

      // Validación mínima
      if (wallet?.direccion && wallet?.wallet_de) {
        wallets.push(wallet);
      }
    } catch (err) {
      console.error(`❌ Error leyendo ${file}:`, err);
    }
  }

  return wallets;
};
