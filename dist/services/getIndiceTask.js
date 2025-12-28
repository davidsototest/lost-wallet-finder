"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndiceTask = getIndiceTask;
const axios_1 = __importDefault(require("axios"));
// Función que llama al servicio y obtiene la tarea
async function getIndiceTask(ip, workerId, status = false) {
    try {
        let body;
        if (status) {
            body = { ip, status: true };
        }
        else {
            body = { ip };
        }
        ;
        const res = await axios_1.default.post('https://api-367omuvtoa-uc.a.run.app/seguimiento', body, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        // retornamos los arrays de inicio y fin
        return res.data;
    }
    catch (err) {
        console.error('Error al obtener tarea del servicio:', err);
        throw err;
    }
}
