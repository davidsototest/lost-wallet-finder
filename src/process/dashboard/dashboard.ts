import blessed from 'blessed';

// Crear la pantalla principal
export const screen = blessed.screen({
  smartCSR: true,
  title: 'Interfaz de Consola',
});

// Crear el área de salida desplazable
const logBox = blessed.box({
  top: 0,
  left: 0,
  width: '100%',
  height: '100%-1',
  tags: true,
  scrollable: true,
  alwaysScroll: true,
  scrollbar: {
    ch: ' ',
    // bg: 'blue',
  },
  border: {
    type: 'line',
  },
  style: {
    fg: 'white',
    bg: 'black',
    border: {
      fg: '#f0f0f0',
    },
  },
});

// Crear la caja fija en la parte inferior
export const fixedBox = blessed.box({
  bottom: 0,
  left: 0,
  width: '100%',
  height: 1,
  content: 'Mensaje fijo en la parte inferior',
  style: {
    fg: 'white',
    bg: 'blue',
  },
});

// Añadir los elementos a la pantalla
screen.append(logBox);
screen.append(fixedBox);

// Renderizar la pantalla
screen.render();

// Función para agregar mensajes al log
function log(message: string) {
  logBox.pushLine(message);
  logBox.setScrollPerc(100); // Desplazar hacia abajo
  screen.render();
}

// Redefinir console.log para usar la función log
console.log = log;

// Manejar la salida del programa
screen.key(['C-c'], () => process.exit(0));
