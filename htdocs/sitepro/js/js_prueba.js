window.onload = cargardatos;

function cargardatos() {
    fetch("../phpseclib/BD/obtener_datos.php") // Verifica la ruta correcta
        .then(response => response.json()) // Convertimos en JSON
        .then(data => {
            let datos = document.getElementById("cargar_datos");
            datos.innerHTML = ""; // Limpiar contenido previo

            data.forEach(dato => {
                let fila = `
                    <div>
                        <img src="${dato.direccion_imagen}" alt="Imagen" width="200">
                        <h2>${dato.texto}</h2>
                        <h2>${dato.numero}</h2>
                    </div>
                `;
                datos.innerHTML += fila; // Agregar la fila al contenedor
            });
        })
        .catch(error => console.error("Error al cargar datos:", error));
}
