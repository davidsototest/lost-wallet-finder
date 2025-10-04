// utils/ip.ts
import os from "os";

export function getLocalIp(): string | undefined {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netInfo = nets[name];
    if (!netInfo) continue;
    for (const info of netInfo) {
      // buscamos IPv4 no-interna
      if (info.family === "IPv4" && !info.internal) {
        return info.address; // p.ej. 192.168.1.42
      }
    }
  }
  return undefined; // si no hay ninguna encontrada
}