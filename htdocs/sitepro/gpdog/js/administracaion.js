const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    cargar_categorias();
    cargardatos();
    cargar_categorias_para_combobox();
    ver_sesion.ver_sesion_actual("administracion");
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

    fetch('../php/sesion.php')
        .then(res => res.json())
        .then(data => {
            let nombredelacookie = data.user_id; // Asignar el valor de la cookie

            console.log(nombredelacookie);
            console.log("asasas");

            if (nombredelacookie) {
                let nombredelacookie2 = "estilo_" + nombredelacookie; // Definir aquí

                const cargarCookies = new CargarCookiesAlIniciar(nombredelacookie2);
                cargarCookies.cargarEstilosCookies(nombredelacookie2);

                // Mostrar el nombre del usuario cargado
                console.log("Nombre de la cookie cargado:", nombredelacookie);
            } else {
                console.warn("No se encontró el nombre de la cookie.");
            }
        })
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
                //  btnEditar.onclick = () => editarProducto(item.id_producto);
                btnEditar.onclick = () => {
                    seleccionarId(item.ID);
                }
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
                btnEditar.onclick = () => seleccionarIdcategoria(item.ID);
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
                btnEditar.onclick = () => {
                    seleccionarId(item.ID);
                }
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

document.getElementById("foto_producto").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const container = document.getElementById("imagen_a_agregar");

    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            container.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px;" />`;
        };
        reader.readAsDataURL(file);
    } else {
        container.innerHTML = "Archivo no válido.";
    }
});

document.getElementById("foto_producto").addEventListener("change", function (event) {
    const file = event.target.files[0];
    const container = document.getElementById("imagen_a_agregar");

    if (file && file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            container.innerHTML = `<img src="${e.target.result}" style="max-width: 200px; max-height: 200px;" />`;
        };
        reader.readAsDataURL(file);
    } else {
        container.innerHTML = "Archivo no válido.";
    }
});



function cargar_categorias_para_combobox() {
    let url = `../php/cargar_productos.php?accion=cargarcategorias`;

    fetch(url) // Verifica la ruta correcta
        .then(response => response.json()) // Convertimos en JSON
        .then(data => {
            let datos = document.getElementById("combobox_tipo_producto");
            datos.innerHTML = ""; // Limpiar contenido previo

            data.forEach(dato => {
                let fila = `
                    <option value="${dato.id_tipo_producto}">${dato.descripcion}</option>
                `;
                datos.innerHTML += fila; // Agregar la fila al contenedor
            });
        })
        .catch(error => console.error("Error al cargar datos:", error));
}
document.querySelector("#botones_agregar-agregar").addEventListener("click", async function () {
    const tipo = document.getElementById("combobox_tipo_producto").value;
    const nombre = document.getElementById("nombre_producto").value;
    const descripcion = document.getElementById("descripcion_producto").value;
    const foto = document.getElementById("foto_producto").files[0];
    const cant_actual = document.getElementById("cantidad_actual").value;
    const cant_min = document.getElementById("cantidad_minima").value;
    const cant_max = document.getElementById("cantidad_maxima").value;
    const precio_compra = document.getElementById("precio_compra").value;
    const precio_venta = document.getElementById("precio_venta").value;

    if (
        !tipo || !nombre || !descripcion || !foto || !cant_actual ||
        !cant_min || !cant_max || !precio_compra || !precio_venta
    ) {
        alert("Por favor completa todos los campos antes de agregar el producto.");
        return;
    }

    const formData = new FormData();
    formData.append("tipo_producto", tipo);
    formData.append("nombre_producto", nombre);
    formData.append("descripcion_producto", descripcion);
    formData.append("foto_producto", foto);
    formData.append("cantidad_actual", cant_actual);
    formData.append("cantidad_minima", cant_min);
    formData.append("cantidad_maxima", cant_max);
    formData.append("precio_compra", precio_compra);
    formData.append("precio_venta", precio_venta);
    formData.append("action", "producto");

    try {
        const response = await fetch("../php/agregar_producto.php", {
            method: "POST",
            body: formData,
        });

        const data = await response.text(); // o usa .json() si tu PHP devuelve JSON
        Swal.fire({
            text: "Producto agregado con exito",
            icon: "success",
            confirmButtonColor: "#A6762A",
            confirmButtonText: "OK"
        })
        document.querySelector(".agregar_producto").reset();
        document.getElementById("imagen_a_agregar").innerHTML = "";
        cargar_categorias();
        cargardatos();
        cargar_categorias_para_combobox();

    } catch (err) {
        console.error('Error al enviar el formulario:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
});

document.querySelector("#botones_agregar-clase").addEventListener("click", async function () {
    const nombre = document.getElementById("nombre_clase").value;

    if (!nombre) {
        alert("Por favor completa todos los campos antes de agregar la categoría.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre_clase", nombre);

    try {
        const response = await fetch("../php/agregar_categoria.php", {
            method: "POST",
            body: formData,
        });

        const responseText = await response.text();  // en vez de .json()
        console.log("Respuesta cruda:", responseText);
        try {
            const data = JSON.parse(responseText);
            alert("Categoria agregada con éxito: " + JSON.stringify(data));
        } catch (e) {
            console.error("Error al parsear JSON:", e, "\nTexto recibido:", responseText);
        }

        // document.querySelector(".agregar_categoria").reset();
    } catch (err) {
        console.error('Error al enviar el formulario:', err);
        alert('Ocurrió un error al conectar con el servidor.', err);
    }
});

// Botón Cancelar: limpia todos los campos
document.querySelector("#botones_agregar button:first-of-type").addEventListener("click", function () {
    if (confirm("¿Estás seguro de que deseas cancelar y limpiar el formulario?")) {
        document.querySelector(".agregar_producto").reset();
        document.getElementById("imagen_a_agregar").innerHTML = "";
    }
});

document.querySelector("#botones_agregar2 button:first-of-type").addEventListener("click", function () {
    if (confirm("¿Estás seguro de que deseas cancelar y limpiar el formulario?")) {
        document.querySelector(".agregar_producto").reset();
        document.getElementById("imagen_a_agregar").innerHTML = "";
    }
});


function seleccionarId(id) {
    sessionStorage.setItem('idSeleccionado', id);
    window.location.href = 'administracion_producto.html'; // te vas a la otra página
}

function seleccionarIdcategoria(id) {
    sessionStorage.setItem('idSeleccionadoCategoria', id);
    window.location.href = 'administracion_categoria.html'; // te vas a la otra página
}

