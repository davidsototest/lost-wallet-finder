// import * as fs from "fs";
// import * as path from "path";
// import { WalletConCashItem } from "../../BASURA/leerSeguimientoWalletCash";

// const walletConCashPath = path.join(__dirname, "../../data/wallet/walletCon_CASH.json");

// /// guardar wallets con cash en el json
// export const agregarWalletConCash = (nuevo: WalletConCashItem): void => {
//   try {
//     let actuales: WalletConCashItem[] = [];

//     // Si el archivo ya existe, lo leemos
//     if (fs.existsSync(walletConCashPath)) {
//       const contenido = fs.readFileSync(walletConCashPath, "utf-8");
//       actuales = JSON.parse(contenido);
//     }

//     // Agregamos el nuevo elemento
//     actuales.push(nuevo);

//     // Guardamos todo de nuevo
//     fs.writeFileSync(walletConCashPath, JSON.stringify(actuales, null, 2), "utf-8");
//   } catch (error) {
//     console.error("Error al agregar al archivo walletCon_CASH.json:", error);
//   }
// };


export {};