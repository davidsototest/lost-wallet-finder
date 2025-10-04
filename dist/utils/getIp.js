"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLocalIp = getLocalIp;
// utils/ip.ts
const os_1 = __importDefault(require("os"));
function getLocalIp() {
    const nets = os_1.default.networkInterfaces();
    for (const name of Object.keys(nets)) {
        const netInfo = nets[name];
        if (!netInfo)
            continue;
        for (const info of netInfo) {
            // buscamos IPv4 no-interna
            if (info.family === "IPv4" && !info.internal) {
                return info.address; // p.ej. 192.168.1.42
            }
        }
    }
    return undefined; // si no hay ninguna encontrada
}
