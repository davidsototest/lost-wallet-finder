import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { WalletResult } from "../../interfaces/WalletResult.interface";

const bip32 = BIP32Factory(ecc);
bitcoin.initEccLib(ecc);

const NETWORK = bitcoin.networks.bitcoin;

// Función que recibe una frase mnemotécnica y retorna la billetera Taproot
export const generarWallet_BTC_Taproot = (mnemonic: string): WalletResult => {
  // Validar la frase mnemotécnica
  if (!bip39.validateMnemonic(mnemonic)) {
    throw new Error("Frase mnemotécnica inválida");
  }

  // Generar la semilla y la clave raíz
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, NETWORK);

  // Utilizar el path BIP86 para Taproot
  const path = "m/86'/0'/0'/0/0";
  const child = root.derivePath(path);

  // Obtener la clave pública en formato x-only
  const xOnlyPubkey = child.publicKey.slice(1, 33);

  // Generar la dirección Taproot (P2TR)
  const { address } = bitcoin.payments.p2tr({
    internalPubkey: xOnlyPubkey,
    network: NETWORK,
  });

  if (!address || !address.startsWith("bc1p")) {
    throw new Error("Error al generar la dirección Taproot");
  }

  return {
    Direccion: address,
    Clave_privada: child.toWIF(),
  };
};
