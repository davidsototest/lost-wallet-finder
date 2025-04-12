import * as fs from "fs";
import * as path from "path";

const seguimientoPath = path.join(__dirname, "../data/seguimiento.ts");

// Función para escribir el array de seguimiento en el archivo
export const escribirSeguimientoIndice = (seguimiento: number[][]): void => {
  const contenido = `export const seguimiento: number[][] = ${JSON.stringify(
    seguimiento,
    null,
    2
  )};\n`;
  fs.writeFileSync(seguimientoPath, contenido, "utf-8");
};