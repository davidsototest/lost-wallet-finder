import * as fs from "fs";
import * as path from "path";

// Rutas a los archivos
const seguimientoPath = path.join(__dirname, "../data/seguimientos/seguimiento.ts");

// Función para leer el array de seguimiento (combinaciones) desde el archivo
export const leerSeguimientoIndice = (): number[][] => {
  try {
    const contenido = fs.readFileSync(seguimientoPath, "utf-8");
    const regex = /export\s+const\s+seguimiento\s*:\s*number\[\]\[\]\s*=\s*(\[[\s\S]*\]);/;
    const match = contenido.match(regex);
    if (match && match[1]) {
      const seguimientoArray = eval(match[1]) as number[][];
      return seguimientoArray;
    }
  } catch (error) {
    console.error("Error al leer el archivo de seguimiento:", error);
  }
  return [];
};