import * as fs from "fs";
import * as path from "path";

// Rutas a los archivos
const seguimientoPath = path.join(__dirname, "../data/seguimientos/seguimiento.json");

// Función para leer el array de seguimiento (combinaciones) desde el archivo
export const leerSeguimientoIndice = (): number[] => {
  try {
    const contenido = fs.readFileSync(seguimientoPath, 'utf-8');
    const seguimientoArray = JSON.parse(contenido) as number[];
    return seguimientoArray;
  } catch (error) {
    console.error('Error al leer el archivo de seguimiento:', error);
    return [];
  }
};