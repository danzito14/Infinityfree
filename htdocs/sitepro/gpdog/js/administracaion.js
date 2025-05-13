const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    mostrar_div("agregar_producto");
    cargar_datos_tabla_venta("cargar_ventas_dia");
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
        });

});
const registerForm = document.getElementById('register-form');
const resetButtons = document.querySelectorAll('.reset-button');

function validatePassword(password) {
    const regex = /^[A-Za-z\d@$!%*?&]{4,}$/;
    return regex.test(password);
}
document.addEventListener('DOMContentLoaded', function () {
    // Enviar el formulario de registro
    registerForm.querySelector('form').addEventListener('submit', async function (event) {
        event.preventDefault();

        const name = document.getElementById('register-name');
        const user = document.getElementById('register-user');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');
        const correo = document.getElementById('register-correo');
        let nvl_usuario;
        if (document.getElementById('nvl_usuario')) {
            nvl_usuario = document.getElementById('nvl_usuario').value;
        } else {
            nvl_usuario = 2;
        }

        if (name.value.trim() === '') return showError(name, 'Rellena el campo de nombre.');
        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (user.value.trim().length < 3) return showError(user, 'El usuario debe tener al menos 3 caracteres.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');
        if (!validatePassword(password.value.trim()))
            return showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
        if (confirmPassword.value.trim() === '') return showError(confirmPassword, 'Rellena el campo de confirmación de contraseña.');
        if (password.value.trim() !== confirmPassword.value.trim())
            return showError(confirmPassword, 'Las contraseñas no coinciden.');

        const formData = new FormData();
        formData.append('username', name.value.trim());
        formData.append('nickname', user.value.trim());
        formData.append('password', password.value.trim());
        formData.append('correo', correo.value.trim());
        formData.append('nvl_usuario', nvl_usuario);
        formData.append('action', 'register');
        let json1 = "";
        try {
            const response = await fetch('../php/login_registro.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            console.log("hola, soy goku,", result);
            if (result.success) {
                Swal.fire({
                    title: "TODO LISTO, AHORA ACTIVE SU CUENTA PRIMERO",
                    text: "PARA PODER ENTRAR AL SITIO NECESITA ACTIVAR SU CUENTA, SE LE ENVIO UN CORREO A SU CORREO ELECTRONICO, PRESIONE EL BOTON PARA PODER ACTIVARLA",
                    icon: "success",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                });
            } else {
                Swal.fire({
                    title: result.message,
                    icon: "error",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                });
            }
        } catch (err) {
            console.error('Error:', err);
            alert(err);

        }
    });

    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = button.closest('form');
            form.reset();
            removeErrorStyles(form);
        });
    });



});


function cargardatos(url = `../php/administracion_cargar_productos.php?accion=cargarproductos`) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('total_productos').textContent = data.length;
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

                if (estatus_actual == 'Activo') {
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




function cargar_ventas() {
    cargar_grafica('productos_mas_vendidos', 'grafica_productos_mas_vendidos', "Cantidad vendida", false);
    cargar_grafica('productos_menos_vendidos', 'grafica_productos_menos_vendidos', "Cantidad vendida", false);
    cargar_grafica('productos_que_generan_mas_ingresos', 'grafica_productos_que_generan_mas_ingresos', "Ingresos generados", true);
    cargar_grafica('productos_que_generan_menos_ingresos', 'grafica_productos_que_generan_menos_ingresos', "Ingresos generados", true);
    cargar_grafica('clientes_que_compran_mas', 'grafica_clientes_que_compran_mas', "Total de productos", false);
    cargar_grafica('clientes_que_generan_mas_ingresos', 'grafica_clientes_que_generan_mas_ingresos', "Ingresos generados", false);
}
const instanciasGraficos = {};

async function cargar_grafica(tipo_reporte, destino, texto_de_medidas_y, necesita_tabla) {
    const formData = new FormData();
    formData.append("action", tipo_reporte);
    try {

        const response = await fetch("../php/reporte_de_ventas.php", {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (necesita_tabla) {
            cargar_tabla_especial(result, tipo_reporte)
        }

        const labels = result.map(item => item.nombre);
        const datos = result.map(item => item.Cantidad_vendida);

        const canvas = document.getElementById(destino);
        const contexto = canvas.getContext('2d');

        // Destruye gráfico previo si existe
        if (instanciasGraficos[destino]) {
            instanciasGraficos[destino].destroy();
        }

        let titulo_preparado = tipo_reporte.replaceAll('_', ' ').split(' ').map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1)).join(' ');

        // Crea y guarda nueva instancia del gráfico
        instanciasGraficos[destino] = new Chart(contexto, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: titulo_preparado,
                    data: datos,
                    backgroundColor: 'rgba(75, 192, 192, 0.5)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: texto_de_medidas_y
                        }
                    }
                }
            }

        });

    } catch (e) {
        console.error("Error al cargar gráfica:", e);
    }


}


function cargar_tabla_especial(result, destino) {
    const contenedor = document.getElementById("tabla_" + destino);
    contenedor.innerHTML = ""; // Limpiar el contenedor si ya hay una tabla

    const tabla = document.createElement("table");
    tabla.classList.add("tabla-especial"); // Puedes usar esta clase para estilos

    // Crear cabeceras
    const thead = document.createElement("thead");
    const encabezado = document.createElement("tr");

    const claves = Object.keys(result[0]);
    claves.forEach(clave => {
        const th = document.createElement("th");
        let texto = clave.replace('_', ' ');
        texto = texto.charAt(0).toUpperCase() + texto.slice(1);
        th.textContent = texto === "Cantidad vendida" ? "Ingresos Generados" : texto;
        encabezado.appendChild(th);
    });


    thead.appendChild(encabezado);
    tabla.appendChild(thead);

    // Cuerpo de la tabla
    const tbody = document.createElement("tbody");

    result.forEach(item => {
        const fila = document.createElement("tr");
        claves.forEach(clave => {
            const td = document.createElement("td");
            td.textContent = item[clave];
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);
    contenedor.appendChild(tabla);
}


const filtro_rango_fecha = document.getElementById('seleccionar_consulta');

filtro_rango_fecha.addEventListener("change", function () {
    const sentencia_sql = filtro_rango_fecha.value;
    let sentencia = sentencia_sql.replace('_', ' ');
    let palabras = sentencia.split(' ');
    let ultima_palabra = palabras[palabras.length - 1];
    document.getElementById('titulo_reporte_ventas').textContent = "REGISTROS DE VENTAS POR " + ultima_palabra.toUpperCase();
    cargar_datos_tabla_venta(sentencia_sql);
});

const btn_rango_de_fechas = document.getElementById("rango_de_fechas");

btn_rango_de_fechas.addEventListener("click", function () {
    const fecha_inicio = document.getElementById("fecha_inicio").value.trim();
    const fecha_final = document.getElementById("fecha_final").value.trim();

    if (fecha_inicio === "") {
        alert("Ingrese una fecha de inicio");
        return;
    }
    if (fecha_final === "") {
        alert("Ingrese una fecha final");
        return;
    }

    cargar_tabla_con_fechas(fecha_inicio, fecha_final);
});


async function cargar_tabla_con_fechas(fecha_inicio, fecha_final) {
    const formdata = new FormData();
    formdata.append("fecha_inicio", fecha_inicio);
    formdata.append("fecha_final", fecha_final);
    formdata.append("action", "cargar_por_fecha");
    try {
        const response = await fetch("../php/reporte_de_ventas.php", {
            method: 'POST',
            body: formdata
        });
        const result = await response.json();

        ventas = result;
        pagina_actual = 1;
        mostrar_ventas();
        crear_paginacion();
    } catch (e) {
        console.log("Error al intentar obtener los datos de la venta: " + e);
    }
}



let ventas = [];
let pagina_actual = 1;
const cant_tuplas_max = 10;

async function cargar_datos_tabla_venta(sentencia_sql) {
    const formdata = new FormData();
    formdata.append("action", sentencia_sql);

    try {
        const response = await fetch("../php/reporte_de_ventas.php", {
            method: 'POST',
            body: formdata
        });
        const result = await response.json();

        ventas = result;
        pagina_actual = 1;
        mostrar_ventas();
        crear_paginacion();
    } catch (e) {
        console.log("Error al intentar obtener los datos de la venta: " + e);
    }
}

function mostrar_ventas() {


    let inicio = (pagina_actual - 1) * cant_tuplas_max;
    let fin = inicio + cant_tuplas_max;

    let ventas_a_mostrar = ventas.slice(inicio, fin);

    cargar_tabla_especial(ventas_a_mostrar, "ventas");
}


function crear_paginacion() {
    const paginacion = document.getElementById("paginacion_ventas");
    paginacion.innerHTML = "";

    let totalPaginas = Math.ceil(ventas.length / cant_tuplas_max);

    if (pagina_actual > 1) {
        paginacion.innerHTML += `<button onclick="cambiarPagina(${pagina_actual - 1})">Ant.</button>`;
    }

    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<button onclick="cambiarPagina(${i})">${i}</button>`;
    }

    if (pagina_actual < totalPaginas) {
        paginacion.innerHTML += `<button onclick="cambiarPagina(${pagina_actual + 1})">Sig.</button>`;
    }
}

window.cambiarPagina = function cambiarPagina(pagina) {
    pagina_actual = pagina;
    mostrar_ventas();
    crear_paginacion();
}


function cargar_datos_usuario() {
    let url = `../php/administracion_cargar_usuarios.php?accion=cargar_usuarios`;
    cargar_tabla_usuario(url);
}

async function cargar_tabla_usuario(url) {

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('total_usuarios').textContent = data.length;
            const contenedor = document.getElementById("tabla_usuarios");
            contenedor.innerHTML = ""; // Limpiar el contenedor si ya hay una tabla

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
                btnEditar.onclick = () => {
                    seleccionarIdcusuario(item.ID);
                };

                const btnEliminar = document.createElement("button");
                btnEliminar.id = "btn_eliminar";
                btnEliminar.textContent = item.Estatus === 'Activo' ? "Dar de baja" : "Dar de alta";
                btnEliminar.onclick = () => {
                    const mensaje = item.Estatus === 'A'
                        ? "Va a cambiar el estado a inactivo el usuario no podra entrar al sitio"
                        : "Va a cambiar el estado a activo este usuario puede entrar al sitio";

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
                            cambiar_estatus(item.ID, item.Estatus, "usuario");
                        }
                    });
                };

                tdAcciones.appendChild(btnEditar);
                tdAcciones.appendChild(btnEliminar);
                fila.appendChild(tdAcciones);

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
        const columna_producto = document.getElementById("columna_producto").value.trim();
        const buscador = document.getElementById("buscador").value.trim();
        if (buscador === "") return;

        const url = `../php/administracion_buscarproductos.php?accion=buscarPorTexto&query=${encodeURIComponent(buscador)}&columna=${encodeURIComponent(columna_producto)}`;
        cargardatos(url);
    });
});



async function cambiar_estatus(id_producto, estatus, origen) {
    const formData = new FormData();
    // origen dira si viene de productos o categorias y esa es pues la accion a donde va a actualizar
    formData.append("id_producto", id_producto),
        formData.append("estatus", estatus[0]),
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
                    cargardatos();
                    cargar_datos_usuario();// Recargar la página si se confirma
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
            let datos2 = document.getElementById("filtro_categoria");
            datos.innerHTML = ""; // Limpiar contenido previo
            datos2.innerHTML = ""
            data.forEach(dato => {
                let fila = `
                    <option value="${dato.id_tipo_producto}">${dato.descripcion}</option>
                `;
                datos.innerHTML += fila; // Agregar la fila al contenedor
                datos2.innerHTML += fila; // Agregar la fila al contenedor
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

    if (!cant_min >= cant_max || !cant_min >= cant_actual || !cant_actual >= cant_max) {
        alert("Las cantidades tienen que ser coherentes");
        return;
    }

    if (precio_compra >= precio_venta) {
        alert("El precio de venta tiene que ser mayor al de compra para conseguir ganancia");
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

function seleccionarIdcusuario(id) {
    sessionStorage.setItem('idSeleccionadousuario', id);
    window.location.href = 'administracion_usuario_editar.html'; // te vas a la otra página
}

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".carrito-btn").addEventListener("click", function () {
        window.location.href = "carrito.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".ubi-btn").addEventListener("click", function () {
        window.location.href = "ubicacion.html";
    });
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".home-btn").addEventListener("click", function () {
        window.location.href = "home.html";
    });
});
window.mostrar_div = function mostrar_div(id, funcion) {
    // Oculta todos los divs controlados
    const secciones = [
        'agregar_producto',
        'tabla_productos2',
        'agregar_categoria',
        'tabla_categorias',
        'mostrar_ventas',
        'ventas',
        'agregar_usuario',
        'administrar_usuarios'
    ];

    secciones.forEach(function (seccion) {
        const elemento = document.getElementById(seccion);
        if (elemento) {
            elemento.style.display = 'none';
        }
    });

    // Ejecuta funciones según el valor de 'funcion'
    switch (funcion) {
        case 2:
            cargardatos();
            break;
        case 4:
            cargar_categorias();
            break;
        case 5:
            cargar_ventas();
            break;
        case 6:
            cargar_datos_tabla_venta("cargar_ventas_dia");
            break;
        case 8:
            cargar_datos_usuario();
            break;
        default:
            break;
    }

    // Muestra solo el div solicitado
    const divMostrar = document.getElementById(id);
    if (divMostrar) {
        divMostrar.style.display = 'block';
    }
}


document.querySelector('form.buscarplatillo2').addEventListener('submit', async (e) => {
    e.preventDefault();
    const buscador = document.getElementById("buscador2").value.trim();
    const columna = document.getElementById("columna").value.trim();
    if (buscador === "") return;

    const url = `../php/administracion_buscar_usuarios.php?accion=buscarPorTexto&query=${encodeURIComponent(buscador)}&columna=${encodeURIComponent(columna)}`;
    cargar_tabla_usuario(url);
});


const filtro_nvl_usuario = document.getElementById('filtro_nvl_usuario');
filtro_nvl_usuario.addEventListener("change", async function () {
    const url = `../php/administracion_buscar_usuarios.php?accion=buscarPorTexto&query=${encodeURIComponent(filtro_nvl_usuario.value)}&columna=${encodeURIComponent('nvl_usuario')}`;
    cargar_tabla_usuario(url);
});

const filtro_estatus = document.getElementById('filtro_estatus');

filtro_estatus.addEventListener("change", async function () {
    const url = `../php/administracion_buscar_usuarios.php?accion=buscarPorTexto&query=${encodeURIComponent(filtro_estatus.value)}&columna=${encodeURIComponent('estatus')}`;
    cargar_tabla_usuario(url);
});

const filtro_estatus_producto = document.getElementById('filtro_estatus_producto');

filtro_estatus_producto.addEventListener("change", async function () {
    const url = `../php/administracion_buscarproductos.php?accion=buscarPorTexto&query=${encodeURIComponent(filtro_estatus_producto.value)}&columna=${encodeURIComponent('estatus')}`;
    cargardatos(url);
});

const filtro_tipo_producto = document.getElementById('filtro_categoria');

filtro_tipo_producto.addEventListener("change", async function () {
    const url = `../php/administracion_buscarproductos.php?accion=buscarPorTexto&query=${encodeURIComponent(filtro_tipo_producto.value)}&columna=${encodeURIComponent('tipo_producto')}`;
    cargardatos(url);
})

window.reiniciartabla = function reiniciartabla() {
    cargar_datos_usuario();
    cargardatos();
}

