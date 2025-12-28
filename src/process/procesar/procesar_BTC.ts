import { consultarSaldoWallet } from "../../services/consultarSaldoWallet";
import { generarWallet_BTC_NativeSegWit_P2WPKH } from "../generarWalletsBTC/generarWallet_BTC_NativeSegWit";
import { generarWallet_BTC_Legacy } from "../generarWalletsBTC/generarWallet_BTC_legacy";
import { ValidarSaldoWallet } from "../validarElSaldo/ValidarSaldo";


// funcion para procesar todo de BTC
export const procesar_BTC = async (semillas: string): Promise<void> => {

  // generar wallets
  const wallet_BTC_sergit = generarWallet_BTC_NativeSegWit_P2WPKH(semillas);
  const wallet_BTC_legacy = generarWallet_BTC_Legacy(semillas);

  // consultar saldo de ambas
  const saldoWallet_BTC_sergit = await consultarSaldoWallet(wallet_BTC_sergit.Direccion);
  const saldoWallet_BTC_legacy = await consultarSaldoWallet(wallet_BTC_legacy.Direccion);

  //valido los saldos, guardo y aviso
  await ValidarSaldoWallet(saldoWallet_BTC_sergit, semillas, wallet_BTC_sergit);
  await ValidarSaldoWallet(saldoWallet_BTC_legacy, semillas, wallet_BTC_legacy);
};
