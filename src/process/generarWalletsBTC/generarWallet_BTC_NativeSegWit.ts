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
export const generarWallet_BTC_NativeSegWit = (mnemonic: string): WalletResult => {

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