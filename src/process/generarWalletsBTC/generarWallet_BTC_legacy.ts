import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { WalletResult } from "./generarWallet_BTC_NativeSegWit";

const bip32 = BIP32Factory(ecc);
const NETWORK = bitcoin.networks.bitcoin;

// ================== P2PKH (Legacy - BIP44) ==================
export const generarWallet_BTC_Legacy = (mnemonic: string): WalletResult => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, NETWORK);
  const path = "m/44'/0'/0'/0/0";
  const child = root.derivePath(path);

  const { address } = bitcoin.payments.p2pkh({
    pubkey: child.publicKey,
    network: NETWORK,
  });

  if (!address?.startsWith("1")) {
    throw new Error("Error generando dirección Legacy");
  }

  return {
    Direccion: address,
    Clave_privada: child.toWIF(),
  };
};