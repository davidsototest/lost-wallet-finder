import * as fs from "fs";
import * as path from "path";

const walletConCashPath = path.join(__dirname, "../data/walletCon_CASH.ts");

// Función para leer el array de wallets con CASH desde el archivo
export const leerSeguimientoWalletCash = (): [string, string, string, string][] => {
  try {
    const contenido = fs.readFileSync(walletConCashPath, "utf-8");
    const regex = /export\s+const\s+walletCon_CASH\s*:\s*WalletCon_CASH\[\]\s*=\s*(\[[\s\S]*\]);/;
    const match = contenido.match(regex);
    if (match && match[1]) {
      const seguimientoWalletCash = eval(match[1]) as [string, string, string, string][];
      return seguimientoWalletCash;
    }
  } catch (error) {
    console.error("Error al leer el archivo de walletCon_CASH:", error);
  }
  return [];
};