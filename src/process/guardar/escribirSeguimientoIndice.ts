import * as fs from "fs";
import * as path from "path";

const seguimientoPath = path.join(__dirname, "../../data/seguimientos/seguimiento.json");

// Función para escribir el array de seguimiento (plano) en el archivo JSON
export const escribirSeguimientoIndice = (seguimiento: number[]): void => {
  try {
    fs.writeFileSync(seguimientoPath, JSON.stringify(seguimiento, null, 2), "utf-8");

  } catch (error) {
    console.error("Error al escribir el archivo de seguimiento:", error);
  }
};