const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    cargar_categorias();
    cargardatos();
    ver_sesion.ver_sesion_actual();
    Sidebar.cargarSidebar();
    setTimeout(() => {

        const menuBtn = document.querySelector('.menu-btn');
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const closeMenuBtn = document.querySelector('.close-menu');
        const btnCerrarSesion = document.getElementById('btnCerrarSesion');

        if (menuBtn && sidebarMenu) {
            menuBtn.addEventListener('click', () => {
                sidebarMenu.classList.toggle('active');
            });
        }

        if (closeMenuBtn && sidebarMenu) {
            closeMenuBtn.addEventListener('click', () => {
                sidebarMenu.classList.remove('active');
            });
        }

        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', () => {
                alert("Cerrando sesión...");
                const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
                if (confirmacion) {
                    fetch('../php/cerrar_sesion.php')
                        .then(res => res.json())
                        .then(data => {
                            if (data.logueado === false) {
                                window.location.href = '../html/login.html';
                            }
                        })
                        .catch(err => console.error('Error cerrando sesión:', err));
                }
            });
        } else {
            console.warn("btnCerrarSesion no encontrado.");
        }

    }, 0);
});



window.addEventListener("scroll", function () {
    const sidebar = document.querySelector(".sidebar-menu");
    const footer = document.querySelector(".footer");

    const sidebarBottom = sidebar.getBoundingClientRect().bottom;
    const footerTop = footer.getBoundingClientRect().top;

    if (sidebarBottom > footerTop) {
        sidebar.style.position = "absolute";
        sidebar.style.bottom = `${footer.clientHeight}px`;
    } else {
        sidebar.style.position = "fixed";
        sidebar.style.bottom = "auto";
    }
});
function cargardatos() {
    let url = `../php/administracion_cargar_productos.php?accion=cargarproductos`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById("tabla_productos");
            contenedor.innerHTML = ""; // Limpiar el contenedor si ya hay una tabla

            const tabla = document.createElement("table");

            // Crear cabeceras
            const thead = document.createElement("thead");
            const encabezado = document.createElement("tr");
            const thAcciones = document.createElement("th");
            thAcciones.textContent = "Acciones";
            encabezado.appendChild(thAcciones);
            // Claves + columna extra para acciones
            const claves = Object.keys(data[0]);
            claves.forEach(clave => {
                const th = document.createElement("th");
                th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1);
                encabezado.appendChild(th);
            });



            thead.appendChild(encabezado);
            tabla.appendChild(thead);

            // Cuerpo de tabla
            const tbody = document.createElement("tbody");

            data.forEach(item => {
                const fila = document.createElement("tr");
                // Columna de acciones
                const tdAcciones = document.createElement("td");

                // Botón Editar
                const btnEditar = document.createElement("button");
                btnEditar.id = "btn_editar";
                btnEditar.textContent = "Editar";
                btnEditar.onclick = () => editarProducto(item.id_producto);
                let estatus_actual = item.Estatus;
                let boton = '';

                if (estatus_actual == 'A') {
                    boton = "Dar de baja"
                } else {
                    boton = "Dar de alta"
                }
                // Botón Eliminar
                const btnEliminar = document.createElement("button");
                btnEliminar.id = "btn_eliminar";
                btnEliminar.textContent = boton;
                btnEliminar.onclick = () => {
                    let mensaje = estatus_actual === 'A'
                        ? "Va a cambiar el estado a inactivo y no se mostrará en la ventana de compra"
                        : "Va a cambiar el estado a activo y se podrá ver en la página de compras";

                    Swal.fire({
                        title: '¿Está seguro?',
                        text: mensaje,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, continuar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#a67c00',
                        cancelButtonColor: '#004080'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cambiar_estatus(item.ID, item.Estatus, "producto");
                        }
                    });
                };

                tdAcciones.appendChild(btnEditar);
                tdAcciones.appendChild(btnEliminar);
                fila.appendChild(tdAcciones);
                claves.forEach(clave => {
                    const td = document.createElement("td");

                    if (clave === "Foto") {
                        const img = document.createElement("img");
                        img.src = item[clave];
                        img.alt = "Imagen del producto";
                        img.style.width = "50px";
                        img.style.height = "50px";
                        td.appendChild(img);
                    } else {
                        td.textContent = item[clave];
                    }

                    fila.appendChild(td);
                });



                tbody.appendChild(fila);
            });

            tabla.appendChild(tbody);
            contenedor.appendChild(tabla);
        })
        .catch(error => console.error("Error al cargar datos:", error));
}


function cargar_categorias() {
    let url = `../php/administracion_cargar_productos.php?accion=cargarcategorias`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const contenedor = document.getElementById("tabla_categorias");
            contenedor.innerHTML = "";

            const tabla = document.createElement("table");

            // Crear cabeceras
            const thead = document.createElement("thead");
            const encabezado = document.createElement("tr");
            const thAcciones = document.createElement("th");
            thAcciones.textContent = "Acciones";
            encabezado.appendChild(thAcciones);

            const claves = Object.keys(data[0]);
            claves.forEach(clave => {
                const th = document.createElement("th");
                th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1);
                encabezado.appendChild(th);
            });

            thead.appendChild(encabezado);
            tabla.appendChild(thead);

            // Cuerpo de tabla
            const tbody = document.createElement("tbody");

            data.forEach(item => {
                const fila = document.createElement("tr");

                // Columna de acciones
                const tdAcciones = document.createElement("td");

                const btnEditar = document.createElement("button");
                btnEditar.id = "btn_editar";
                btnEditar.textContent = "Editar";
                btnEditar.onclick = () => editarCategoria(item.id_categoria); // Asegúrate de tener esta función
                tdAcciones.appendChild(btnEditar);

                let estatus_actual = item.Estatus;
                let botonTexto = estatus_actual === 'A' ? "Dar de baja" : "Dar de alta";

                const btnEliminar = document.createElement("button");
                btnEliminar.id = "btn_eliminar";
                btnEliminar.textContent = botonTexto;
                btnEliminar.onclick = () => {
                    let mensaje = estatus_actual === 'A'
                        ? "Va a cambiar el estado a inactivo y no se mostrará en la ventana de compra ninguno  de los productos que pertenezcan a esta categoria"
                        : "Va a cambiar el estado a activo y se podrá ver en la página de compras los productos relacionados a esta categoria";

                    Swal.fire({
                        title: '¿Está seguro?',
                        text: mensaje,
                        icon: 'warning',
                        showCancelButton: true,
                        confirmButtonText: 'Sí, continuar',
                        cancelButtonText: 'Cancelar',
                        confirmButtonColor: '#a67c00',
                        cancelButtonColor: '#004080'
                    }).then((result) => {
                        if (result.isConfirmed) {
                            cambiar_estatus(item.ID, item.Estatus, "categoria");
                        }
                    });
                };
                tdAcciones.appendChild(btnEliminar);
                fila.appendChild(tdAcciones);

                // Celdas con los datos de la categoría
                claves.forEach(clave => {
                    const td = document.createElement("td");
                    td.textContent = item[clave];
                    fila.appendChild(td);
                });

                tbody.appendChild(fila);
            });

            tabla.appendChild(tbody);
            contenedor.appendChild(tabla);
        })
        .catch(error => console.error("Error al cargar datos:", error));
}

// Evento para búsqueda por texto
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form.buscarplatillo').addEventListener('submit', async (e) => {
        e.preventDefault();
        const buscador = document.getElementById("buscador").value.trim();
        if (buscador === "") return;

        const url = `../php/administracion_buscarproductos.php?accion=buscarPorTexto&query=${encodeURIComponent(buscador)}`;

        try {
            const response = await fetch(url);
            const data = await response.json();

            const contenedor = document.getElementById("tabla_productos");
            contenedor.innerHTML = ""; // Limpiar el contenedor si ya hay una tabla

            const tabla = document.createElement("table");

            // Crear cabeceras
            const thead = document.createElement("thead");
            const encabezado = document.createElement("tr");
            const thAcciones = document.createElement("th");
            thAcciones.textContent = "Acciones";
            encabezado.appendChild(thAcciones);
            // Claves + columna extra para acciones
            const claves = Object.keys(data[0]);
            claves.forEach(clave => {
                const th = document.createElement("th");
                th.textContent = clave.charAt(0).toUpperCase() + clave.slice(1);
                encabezado.appendChild(th);
            });



            thead.appendChild(encabezado);
            tabla.appendChild(thead);

            // Cuerpo de tabla
            const tbody = document.createElement("tbody");

            data.forEach(item => {
                const fila = document.createElement("tr");
                // Columna de acciones
                const tdAcciones = document.createElement("td");

                // Botón Editar
                const btnEditar = document.createElement("button");
                btnEditar.textContent = "Editar";
                btnEditar.id = "btn_editar";
                btnEditar.onclick = () => editarProducto(item.id_producto);

                // Botón Eliminar
                const btnEliminar = document.createElement("button");
                btnEliminar.textContent = "Eliminar";
                btnEliminar.id = "btn_eliminar";
                btnEliminar.onclick = () => alert("guayaba");

                tdAcciones.appendChild(btnEditar);
                tdAcciones.appendChild(btnEliminar);
                fila.appendChild(tdAcciones);
                claves.forEach(clave => {
                    const td = document.createElement("td");

                    if (clave === "Foto") {
                        const img = document.createElement("img");
                        img.src = item[clave];
                        img.alt = "Imagen del producto";
                        img.style.width = "50px";
                        img.style.height = "50px";
                        td.appendChild(img);
                    } else {
                        td.textContent = item[clave];
                    }

                    fila.appendChild(td);
                });



                tbody.appendChild(fila);
            });

            tabla.appendChild(tbody);
            contenedor.appendChild(tabla);
        } catch (e) {
            console.error("Error en la búsqueda de productos:", e);
        }
    });
});


async function cambiar_estatus(id_producto, estatus, origen) {
    const formData = new FormData();
    // origen dira si viene de productos o categorias y esa es pues la accion a donde va a actualizar
    formData.append("id_producto", id_producto),
        formData.append("estatus", estatus),
        formData.append("action", origen);

    try {
        const response = await fetch("../php/cambiar_estatus.php", {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            Swal.fire({
                title: "¡Listo!",
                text: "Estatus de producto cambiado correctamente",
                icon: "success",
                confirmButtonColor: '#a67c00'
            }).then((result) => {
                if (result.isConfirmed) {
                    cargar_categorias();
                    cargardatos(); // Recargar la página si se confirma
                }
            });


        }
        else {
            Swal.fire({
                title: "Sucedió un error",
                text: "Sucedió algún error con la conexión a la base de datos",
                icon: "error",
                confirmButtonColor: "#A6762A"
            });
        }

    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }



}