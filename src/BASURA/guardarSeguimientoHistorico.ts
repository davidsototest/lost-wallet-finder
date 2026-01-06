// import * as fs from "fs";
// import * as path from "path";

// const rutaSeguimientoHistorico = path.join(__dirname, "../../data/seguimientos/seguimientoHistorico.json");

// let ultimaHoraGuardado = Date.now(); // marca de tiempo inicial

// export const guardarSeguimientoHistorico = (indices: number[]) => {
//   const ahora = Date.now();
//   const unaHora = 1000 * 60 * 60; // milisegundos en una hora

//   if (ahora - ultimaHoraGuardado >= unaHora) {
//     try {
//       // Verificar si ya existe el archivo y tiene datos
//       let historico: number[][] = [];

//       if (fs.existsSync(rutaSeguimientoHistorico)) {
//         const data = fs.readFileSync(rutaSeguimientoHistorico, "utf8");
//         historico = JSON.parse(data);
//       }

//       // Agregar nueva entrada
//       historico.push([...indices]);

//       // Escribir de nuevo
//       fs.writeFileSync(rutaSeguimientoHistorico, JSON.stringify(historico, null, 2));
//     //   console.log("✅ Indices guardados en seguimientoHistorico.json");

//       // Actualizar marca de tiempo
//       ultimaHoraGuardado = ahora;
//     } catch (error) {
//       console.error("❌ Error al guardar en seguimientoHistorico.json:", error);
//     }
//   }
// };

export {};