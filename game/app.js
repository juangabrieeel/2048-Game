document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid"); // Contenedor de la cuadrícula del juego
  const scoreDisplay = document.querySelector("#score"); // Contenedor del puntaje
  const resultDisplay = document.querySelector("#result"); // Contenedor del resultado (ganar o perder)
  const width = 4; // Dimensión de la cuadrícula (4x4)
  let squares = []; // Array para almacenar las casillas del juego
  let score = 0; // Puntaje inicial

  // Crear el tablero de juego
  function crearTablero() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generar(); // Generar un número inicial
    generar(); // Generar un segundo número inicial
  }
  crearTablero();

  // Generar un nuevo número aleatorio en una casilla vacía
  function generar() {
    const randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2;
      verificarJuegoTerminado();
    } else {
      generar(); // Intentar nuevamente si la casilla no está vacía
    }
  }

  // Mover las casillas hacia la derecha
  function moverDerecha() {
    for (let i = 0; i < 16; i += width) {
      let fila = extraerFila(i); // Obtener la fila actual
      let nuevaFila = desplazarYLlenar(fila, "derecha");
      actualizarFila(i, nuevaFila);
    }
  }

  // Mover las casillas hacia la izquierda
  function moverIzquierda() {
    for (let i = 0; i < 16; i += width) {
      let fila = extraerFila(i);
      let nuevaFila = desplazarYLlenar(fila, "izquierda");
      actualizarFila(i, nuevaFila);
    }
  }

  // Mover las casillas hacia arriba
  function moverArriba() {
    for (let i = 0; i < width; i++) {
      let columna = extraerColumna(i);
      let nuevaColumna = desplazarYLlenar(columna, "izquierda");
      actualizarColumna(i, nuevaColumna);
    }
  }

  // Mover las casillas hacia abajo
  function moverAbajo() {
    for (let i = 0; i < width; i++) {
      let columna = extraerColumna(i);
      let nuevaColumna = desplazarYLlenar(columna, "derecha");
      actualizarColumna(i, nuevaColumna);
    }
  }

  // Combinar números iguales en una fila
  function combinarFila() {
    for (let i = 0; i < 15; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML) {
        combinar(i, i + 1);
      }
    }
    verificarVictoria();
  }

  // Combinar números iguales en una columna
  function combinarColumna() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        combinar(i, i + width);
      }
    }
    verificarVictoria();
  }

  // Combinar dos casillas
  function combinar(index1, index2) {
    const totalCombinado =
      parseInt(squares[index1].innerHTML) + parseInt(squares[index2].innerHTML);
    squares[index1].innerHTML = totalCombinado;
    squares[index2].innerHTML = 0;
    score += totalCombinado;
    scoreDisplay.innerHTML = score;
  }

  // Asignar funciones de movimiento a las teclas
  function control(e) {
    if (e.key === "ArrowLeft") {
      teclaIzquierda();
    } else if (e.key === "ArrowRight") {
      teclaDerecha();
    } else if (e.key === "ArrowUp") {
      teclaArriba();
    } else if (e.key === "ArrowDown") {
      teclaAbajo();
    }
  }
  document.addEventListener("keydown", control);

  function teclaIzquierda() {
    moverIzquierda();
    combinarFila();
    moverIzquierda();
    generar();
  }

  function teclaDerecha() {
    moverDerecha();
    combinarFila();
    moverDerecha();
    generar();
  }

  function teclaArriba() {
    moverArriba();
    combinarColumna();
    moverArriba();
    generar();
  }

  function teclaAbajo() {
    moverAbajo();
    combinarColumna();
    moverAbajo();
    generar();
  }

  // Verificar si el jugador ha ganado
  function verificarVictoria() {
    for (let square of squares) {
      if (square.innerHTML == 2048) {
        resultDisplay.innerHTML = "¡Has GANADO!";
        document.removeEventListener("keydown", control);
        setTimeout(limpiar, 3000);
      }
    }
  }

  // Verificar si el jugador ha perdido
  function verificarJuegoTerminado() {
    if (!squares.some((square) => square.innerHTML == 0)) {
      resultDisplay.innerHTML = "¡Has PERDIDO!";
      document.removeEventListener("keydown", control);
      setTimeout(limpiar, 3000);
    }
  }

  // Limpiar el juego
  function limpiar() {
    clearInterval(myTimer);
  }

  // Agregar colores dinámicos a las casillas
  function agregarColores() {
    squares.forEach((square) => {
      const value = parseInt(square.innerHTML);
      square.style.backgroundColor = obtenerColor(value);
    });
  }

  // Obtener el color para un valor específico
  function obtenerColor(value) {
    const colores = {
      0: "#afa192" /* Gris claro */,
      2: "#ffeb3b" /* Amarillo brillante */,
      4: "#ff9800" /* Naranja vibrante */,
      8: "#f44336" /* Rojo brillante */,
      16: "#9c27b0" /* Morado */,
      32: "#2196f3" /* Azul brillante */,
      64: "#00bcd4" /* Azul turquesa */,
      128: "#ff5722" /* Naranja fuerte */,
      256: "#673ab7" /* Violeta */,
      512: "#4caf50" /* Verde */,
      1024: "#3f51b5" /* Azul oscuro */,
      2048: "#9e9e9e" /* Gris más oscuro */,
    };
    return colores[value] || "#333"; // Color por defecto
  }

  agregarColores();
  let myTimer = setInterval(agregarColores, 50);

  // Utilidades para extraer y actualizar filas y columnas
  function extraerFila(inicioIndex) {
    return squares
      .slice(inicioIndex, inicioIndex + width)
      .map((square) => parseInt(square.innerHTML));
  }

  function extraerColumna(columnaIndex) {
    return Array.from({ length: width }, (_, i) =>
      parseInt(squares[columnaIndex + i * width].innerHTML)
    );
  }

  function actualizarFila(inicioIndex, nuevaFila) {
    for (let i = 0; i < width; i++) {
      squares[inicioIndex + i].innerHTML = nuevaFila[i];
    }
  }

  function actualizarColumna(columnaIndex, nuevaColumna) {
    for (let i = 0; i < width; i++) {
      squares[columnaIndex + i * width].innerHTML = nuevaColumna[i];
    }
  }

  // Desplazar y llenar filas o columnas con ceros
  function desplazarYLlenar(array, direccion) {
    let filtrado = array.filter((num) => num); // Eliminar ceros
    let faltantes = width - filtrado.length; // Contar ceros faltantes
    let ceros = Array(faltantes).fill(0);
    return direccion === "derecha"
      ? ceros.concat(filtrado)
      : filtrado.concat(ceros);
  }
});
