import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import { WalletResult } from "../../interface/WalletResult.interface";

const bip32 = BIP32Factory(ecc);
const NETWORK = bitcoin.networks.bitcoin;

// ================== P2SH (Wrapped SegWit - BIP49) ==================
export const generarWallet_BTC_Wrapped_P2SH = (mnemonic: string): WalletResult => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, NETWORK);
  const path = "m/49'/0'/0'/0/0";
  const child = root.derivePath(path);

  // Generar script P2WPKH encapsulado en P2SH
  const { address } = bitcoin.payments.p2sh({
    redeem: bitcoin.payments.p2wpkh({ pubkey: child.publicKey, network: NETWORK }),
  });

  if (!address?.startsWith("3")) {
    throw new Error("Error generando dirección P2SH");
  }

  return {
    Direccion: address,
    Clave_privada: child.toWIF(), 
  };
};