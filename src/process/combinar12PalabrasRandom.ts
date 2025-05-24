import * as path from "path";
import { procesar_BTC } from "./procesar/procesar_BTC";
import { procesar_TRON } from "./procesar/procesar_TRON";
import { generarFraseValida } from "./generarFrase/generarFraseValida";
import { addToWallets } from "..";

//ruta del sonido
export const rutaSonido = path.join(__dirname, "../data/sonido/mision-cumplida1.wav");
export const rutaSonido2 = path.join(__dirname, "../data/sonido/bell-sound-final.wav");


// -------------------------------------------------------------


// Función principal para generar combinaciones
export const generarCombinacionRandomII = async (): Promise<void> => {
//   let indices = leerSeguimientoIndice();

  // Bucle para generar combinaciones
  while (true) {

    //Generar frase semilla random ya validada
    const semillas = generarFraseValida();

    //sumar uno al contador
    addToWallets(3);

    //procesar todo de BTC y TRON
    await Promise.all([
      procesar_BTC(semillas),
      procesar_TRON(semillas),
    ]);
  }
};
