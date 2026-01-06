import fs from "fs";
import path from "path";

export const guardarJsonConWallet = async (datos_BTC: any, ruta: string): Promise<void> => {
  try {
    // Ruta base: data/walletsConCash
    const dirPath = path.resolve(process.cwd(), "dist", "data", ruta);

    // Crear carpeta si no existe
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Nombre del archivo = dirección BTC
    const fileName = `${datos_BTC.direccion}.json`;
    const filePath = path.join(dirPath, fileName);

    // Guardar JSON (formateado)
    await fs.promises.writeFile(
      filePath,
      JSON.stringify(datos_BTC, null, 2),
      "utf-8"
    );

    console.log(`✅ Wallet ${datos_BTC.direccion}, guardada en ${filePath}`);

  } catch (error) {
    console.error("❌ Error guardando wallet con cash:", error);
  }
};
