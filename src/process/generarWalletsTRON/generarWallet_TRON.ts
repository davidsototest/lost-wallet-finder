import * as bip39 from "bip39";
import { BIP32Factory } from "bip32";
import * as ecc from "tiny-secp256k1";
import * as bitcoin from "bitcoinjs-lib";
import ECPairFactory from "ecpair";
import * as ethUtil from "ethereumjs-util";
import { Buffer } from "buffer";


const bip32 = BIP32Factory(ecc);
const ECPair = ECPairFactory(ecc);

export const generarWallets_TRON = (mnemonic: string) => {
  if (!bip39.validateMnemonic(mnemonic)) throw new Error("Mnemónico inválido");
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed);

  const wallets = [];
  const PURPOSE   = 44  + 0x80000000;
  const COIN_TYPE = 195 + 0x80000000;
  const ACCOUNT   = 0   + 0x80000000;
  const CHANGE    = 0;

  for (let n = 0; n < 1; n++) {
    const node = root
      .derive(PURPOSE)
      .derive(COIN_TYPE)
      .derive(ACCOUNT)
      .derive(CHANGE)
      .derive(n);

    // Aquí usamos ECPair de ecpair en lugar de bitcoin.ECPair
    const keyPair = ECPair.fromPrivateKey(node.privateKey!, { compressed: false });

    // … cálculo de dirección igual que antes …
    const pubkeyBuffer = Buffer.from(keyPair.publicKey);
    const ethPubkey     = ethUtil.importPublic(pubkeyBuffer);
    const addrBuf       = ethUtil.publicToAddress(ethPubkey);
    const address       = bitcoin.address.toBase58Check(addrBuf, 0x41);
    const privHex       = keyPair.privateKey!.toString();

    wallets.push({ Direccion: address, Clave_privada: privHex });
  }

  return wallets;
};
