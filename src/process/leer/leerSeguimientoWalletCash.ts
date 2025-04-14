import * as fs from "fs";
import * as path from "path";

const walletConCashPath = path.join(__dirname, "../../data/wallet/walletCon_CASH.json");

// Tipo de los objetos en el JSON
export interface WalletConCashItem {
  frase: string;
  estado: string;
  direccion: string;
  fecha: string;
}

// Función para leer el array de wallets desde el archivo JSON
export const leerSeguimientoWalletCash = (): WalletConCashItem[] => {
  try {
    const contenido = fs.readFileSync(walletConCashPath, "utf-8");
    const data = JSON.parse(contenido) as WalletConCashItem[];
    return data;
  } catch (error) {
    console.error("Error al leer el archivo walletCon_CASH.json:", error);
    return [];
  }
};
