import axios from 'axios';

export interface TaskDocResponse {
  inicio: number[];  // array de 12 números
  fin: number[];     // array de 12 números
  workerId: number;
}

// DTO que envías al servicio
export interface SeguimientoRequest {
    ip: string;
    workerId: number;
    status?: boolean; // opcional
}

// Función que llama al servicio y obtiene la tarea
export async function getIndiceTask(ip: string, workerId: number, status: boolean = false): Promise<TaskDocResponse> {
  try {

    let body;
    
    if (status) {
      body = { ip, workerId, status: true };
    } else {
      body = { ip, workerId };
    };
    
    const res = await axios.post<TaskDocResponse>(
      'https://api-367omuvtoa-uc.a.run.app/seguimiento', 
      body,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // retornamos los arrays de inicio y fin
    return res.data;

  } catch (err) {
    console.error('Error al obtener tarea del servicio:', err);
    throw err;
  }
}
