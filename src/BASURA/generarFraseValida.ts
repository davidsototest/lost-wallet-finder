// import { diccionarioMezclado } from "../../data/diccionario/diccionarioBIP39";
// import { validateMnemonic } from "bip39-ts";

// // Configuración inicial
// const LONGITUD_DICCIONARIO = diccionarioMezclado.length;
// const PALABRAS_POR_FRASE   = 12;

// // Generar frase aleatoria VÁLIDA (con checksum BIP39)
// export const generarFraseValida = (): string => {
//   let frase: string;

//   do {
//     // 1. Crear array de 12 palabras aleatorias
//     const palabras = Array.from(
//       { length: PALABRAS_POR_FRASE },
//       () =>
//         diccionarioMezclado[
//           Math.floor(Math.random() * LONGITUD_DICCIONARIO)
//         ]
//     );

//     // 2. Unir en una sola cadena
//     frase = palabras.join(" ");

//     // 3. Repetir mientras no sea un mnemonic válido
//   } while (!validateMnemonic(frase)); // ← validateMnemonic retorna true si el checksum es correcto :contentReference[oaicite:0]{index=0}

//   return frase;
// };

export {};