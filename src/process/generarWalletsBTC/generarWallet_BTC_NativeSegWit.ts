import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";

const bip32 = BIP32Factory(ecc);
const NETWORK = bitcoin.networks.bitcoin;

// Interfaz para el resultado
export interface WalletResult {
  Direccion: string;
  Clave_privada: string;
}

// Arrow function que recibe un string con las 12 palabras y retorna la wallet
export const generarWallet_BTC_NativeSegWit_P2WPKH = (mnemonic: string): WalletResult => {

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
    Direccion: address,
    Clave_privada: child.toWIF(),
  };
};


// ================== P2WSH (SegWit Script - BIP48) ==================
// export const generarWallet_BTC_NativeSegWit_P2WSH = (mnemonic: string): WalletResult => {
//   const seed = bip39.mnemonicToSeedSync(mnemonic);
//   const root = bip32.fromSeed(seed, NETWORK);
//   const path = "m/48'/0'/0'/0/0";
//   const child = root.derivePath(path);

//   // 1. Generar 3 claves públicas (para 2-de-3)
//   const pubKeys = [
//     child.derive(0).publicKey,
//     child.derive(1).publicKey,
//     child.derive(2).publicKey,
//   ].map(pk => Buffer.from(pk));  // Convertir a Buffer

//   // 2. Ordenar claves según BIP67 (¡IMPORTANTE!)
//   pubKeys.sort((a, b) => a.compare(b));

//   // 3. Construir redeem script manualmente
//   const redeemScript = bitcoin.script.compile([
//     bitcoin.opcodes.OP_2,
//     ...pubKeys,
//     bitcoin.opcodes.OP_3,
//     bitcoin.opcodes.OP_CHECKMULTISIG,
//   ]);

//   // 4. Generar dirección P2WSH
//   const { address } = bitcoin.payments.p2wsh({
//     redeem: { output: redeemScript },
//     network: NETWORK,
//   });

//   if (!address?.startsWith("bc1q")) {
//     throw new Error("Error generando dirección P2WSH");
//   }

//   return {
//     Direccion: address,
//     Clave_privada: child.toWIF(), // ¡ADVERTENCIA! Esto solo devuelve 1 clave
//   };
// };