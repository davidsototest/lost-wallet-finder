import * as fs from "fs";
import * as path from "path";

const walletConCashPath = path.join(__dirname, "../data/walletCon_CASH.ts");

// Función para escribir el array de wallets con CASH en el archivo
export const escribirWalletConCash = (walletArray: [string, string, string, string][]): void => {
  const contenido = `// tipo para el resultado
type WalletCon_CASH = [string, string, string, string];

export const walletCon_CASH: WalletCon_CASH[] = ${JSON.stringify(walletArray, null, 2)};
`;
  fs.writeFileSync(walletConCashPath, contenido, "utf-8");
};