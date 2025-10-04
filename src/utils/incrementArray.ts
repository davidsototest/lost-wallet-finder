/**
 * Incrementa un array de 12 números (base 2048) sumando `increment`
 * Cada posición está limitada a 0-2047 (BIP49)
 *
 * @param arr Array inicial de 12 números
 * @param increment Cantidad a sumar
 * @returns Nuevo array incrementado
 */
export function incrementArray(arr: number[], increment: number): number[] {
  const base = 2048; // cada posición va de 0 a 2047
  const result = [...arr]; // copiamos el array para no modificar el original
  let carry = increment;

  // Recorremos desde la última posición hacia la primera
  for (let i = result.length - 1; i >= 0; i--) {
    if (carry <= 0) break;

    const sum = result[i] + carry;
    result[i] = sum % base;         // se queda con el valor dentro de 0..2047
    carry = Math.floor(sum / base); // el resto se lleva a la siguiente posición a la izquierda
  }

  if (carry > 0) {
    throw new Error("Overflow: se excedió la capacidad del array con base 2048");
  }

  return result;
}
