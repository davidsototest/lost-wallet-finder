import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";

const bip32 = BIP32Factory(ecc);
const NETWORK = bitcoin.networks.bitcoin;

// Interfaz para el resultado
export interface WalletResult {
  Direccion_bc1q: string;
  Clave_privada: string;
}

// Arrow function que recibe un string con las 12 palabras y retorna la wallet
export const generarWallet_BTC = (mnemonic: string): WalletResult => {
  // Dividir el string en palabras usando espacios
  // const palabras = mnemonic.trim().split(/\s+/);
  // if (palabras.length !== 12) {
  //   throw new Error("¡Deben ser 12 palabras!");
  // }

  // Validar que el mnemónico sea correcto
  // if (!bip39.validateMnemonic(mnemonic)) {
  //   throw new Error("Mnemónico inválido");
  // }

  // Generar la semilla y la clave raíz
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, NETWORK);

  // Utilizar el path BIP84 para Native SegWit (Bech32)
  const path = "m/84'/0'/0'/0/0";
  const child = root.derivePath(path);

  // Generar la dirección en formato Bech32 (Native SegWit)
  const { address } = bitcoin.payments.p2wpkh({
    pubkey: child.publicKey,
    network: NETWORK,
  });

  if (!address || !address.startsWith("bc1")) {
    throw new Error("Error generando dirección SegWit");
  }

  // Retornar la dirección y la clave privada en el objeto tipado
  return {
    Direccion_bc1q: address,
    Clave_privada: child.toWIF(),
  };
};





// import * as bip39 from "bip39";
// import { BIP32Factory } from "bip32";
// import * as ecc from "tiny-secp256k1";
// import * as bitcoin from "bitcoinjs-lib";
// import * as readline from "readline";

// const bip32 = BIP32Factory(ecc);
// const NETWORK = bitcoin.networks.bitcoin;

// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout,
// });

// function generarWalletSegWit(): void {
//   rl.question("\nIngresa las 12 palabras BIP39:\n", (mnemonic) => {
//     try {
//       // Validaciones
//       const palabras = mnemonic.trim().split(" ");
//       if (palabras.length !== 12) throw new Error("¡Deben ser 12 palabras!");
//       if (!bip39.validateMnemonic(mnemonic)) throw new Error("Mnemónico inválido");

//       // Generar seed y root key
//       const seed = bip39.mnemonicToSeedSync(mnemonic);
//       const root = bip32.fromSeed(seed, NETWORK);

//       // Path BIP84 para Native SegWit
//       const path = "m/84'/0'/0'/0/0";
//       const child = root.derivePath(path);

//       // Generar dirección Bech32
//       const { address } = bitcoin.payments.p2wpkh({
//         pubkey: child.publicKey,
//         network: NETWORK
//       });

//       if (!address || !address.startsWith('bc1')) {
//         throw new Error("Error generando dirección SegWit");
//       }

//       // Resultados
//       console.log("\n════════ Billetera SegWit 2 ════════");
//       console.log("🔐 Dirección bc1q:", address);
//       console.log("🔑 Clave Privada:", child.toWIF());
//       console.log("📡 Tipo:", "Native SegWit (Bech32)");
//       console.log("🛣️  Path:", path);
//       console.log("════════════════════════════════════\n");

//     } catch (error) {
//       console.error("🚨 Error:", (error as Error).message);
//     } finally {
//       rl.close();
//     }
//   });
// }

// // Iniciar
// console.log("🔷 Generador Bitcoin SegWit bc1q 🔷");
// generarWalletSegWit();