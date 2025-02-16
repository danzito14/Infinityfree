let contador = 0;
let contador_x = 0;
let contador_o = 0;
let tablero = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
];

document.querySelectorAll('.casilla').forEach((elemento, index) => {
    elemento.addEventListener('click', (e) => {
        contador++;

        // Obtener la casilla clickeada
        const clickedElement = e.target.closest('.casilla');

        // calcular la coordenada
        const fila = Math.floor(index / 3);
        const columna = (index % 3);

        if (tablero[fila][columna] === '') {  // Verificar si la casilla está vacía
            // Alternar entre "X" y "O" según el contador
            let marca = (contador % 2 === 0) ? 'O' : 'X';
            tablero[fila][columna] = marca;

            // Alternar imágenes según el contador
            let contenido = (marca === 'X')
                ? `<img src="./sitepro/gallery/foto_x.png" alt="X">`
                : `<img src="./sitepro/gallery/foto_o.png" alt="O">`;

            // Agregar la imagen dentro de la casilla seleccionada
            clickedElement.innerHTML = contenido;
            clickedElement.style.pointerEvents = "none";
            console.log("Contador:", contador);

            // Comprobar si hay un ganador

        }

        console.log(fila, columna);
        if (contador >= 5) {  // Comprobar solo después de 5 jugadas

            let resultado = comprobarGanador(tablero);
            if (resultado) {
                if (contador % 2) {
                    contador_x = contador_x + 1;
                    contador_d_x();
                    imagen = "./sitepro/gallery/foto_x.png"
                } else {
                    contador_o++;
                    contador_d_o();
                    imagen = "./sitepro/gallery/foto_o.png";
                }
                mostrarganador(resultado, imagen);
            }
        }
    });
});

function comprobarGanador(tablero) {
    // Combinaciones ganadoras (filas, columnas, diagonales)
    const combinacionesGanadoras = [
        // Filas
        [[0, 0], [0, 1], [0, 2]],
        [[1, 0], [1, 1], [1, 2]],
        [[2, 0], [2, 1], [2, 2]],

        // Columnas
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],

        // Diagonales
        [[0, 0], [1, 1], [2, 2]],
        [[0, 2], [1, 1], [2, 0]]
    ];

    // Verificar si alguna de las combinaciones ganadoras tiene las mismas marcas
    for (let combinacion of combinacionesGanadoras) {
        const [a, b, c] = combinacion;
        const [x1, y1] = a;
        const [x2, y2] = b;
        const [x3, y3] = c;

        // Si las 3 posiciones tienen la misma marca y no están vacías
        if (tablero[x1][y1] === tablero[x2][y2] && tablero[x2][y2] === tablero[x3][y3] && tablero[x1][y1] !== '') {
            return `${tablero[x1][y1]} ha ganado!`;
        }
    }

    return null;  // No hay ganador aún
}


document.getElementById('reiniciar').addEventListener('click', () => {

    reiniciar();
    contador_o = 0;
    contador_x = 0;
    contador_d_o();
    contador_d_x();
    console.log("Juego reiniciado");
});


document.addEventListener('DOMContentLoaded', () => {
});

function contador_d_x() {
    let resultadosDiv = document.getElementById('contador_x'); // Asegúrate de que es un div

    let contenido = `<h1>${contador_x}</h1>`; // Corregido el cierre de la etiqueta
    resultadosDiv.innerHTML = contenido;
}

function contador_d_o() {
    let resultadosDiv = document.getElementById('contador_o'); // Asegúrate de que es un div

    let contenido = `<h1>${contador_o}</h1>`; // Corregido el cierre de la etiqueta
    resultadosDiv.innerHTML = contenido;
}


document.addEventListener('DOMContentLoaded', () => {
    let resultadosDiv = document.getElementById('contador_o'); // Asegúrate de que es un div

    let contenido = `<h1>${contador_o}</h1>`; // Corregido el cierre de la etiqueta
    resultadosDiv.innerHTML = contenido;

});

document.addEventListener('DOMContentLoaded', () => {
    let resultadosDiv = document.getElementById('contador_x'); // Asegúrate de que es un div

    let contenido = `<h1>${contador_x}</h1>`; // Corregido el cierre de la etiqueta
    resultadosDiv.innerHTML = contenido;

});




function mostrarganador(ganador, imagen) {
    // Mostrar la alerta de SweetAlert2
    Swal.fire({
        title: ganador,
        text: ' ',
        imageUrl: imagen,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "ganador"
    }).then(() => {
        // Lanza el confeti después de que el usuario cierre la alerta
        confetti({
            particleCount: 600,
            spread: 70,
            origin: { y: 0.6 }
        });
        reiniciar();
    });
}

function reiniciar() {
    // Limpiar el tablero (vaciar el contenido de las casillas)
    document.querySelectorAll('.casilla').forEach((elemento) => {
        elemento.innerHTML = '';  // Limpiar el contenido HTML de la casilla
        elemento.style.pointerEvents = "auto";  // Hacer que las casillas sean clickeables nuevamente
    });

    // Reiniciar variables de juego
    contador = 0;  // Reiniciar el contador de jugadas
    tablero = [      // Resetear el tablero
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
}