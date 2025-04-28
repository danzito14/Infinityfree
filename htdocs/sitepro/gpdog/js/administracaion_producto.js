const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    inicializar();
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



async function cargar_categorias_para_combobox() {
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
    const estatus = document.getElementById("estatus_producto").value;
    const tipo = document.getElementById("combobox_tipo_producto").value;
    const nombre = document.getElementById("nombre_producto").value;
    const descripcion = document.getElementById("descripcion_producto").value;
    const cant_actual = document.getElementById("cantidad_actual").value;
    const cant_min = document.getElementById("cantidad_minima").value;
    const cant_max = document.getElementById("cantidad_maxima").value;
    const precio_compra = document.getElementById("precio_compra").value;
    const precio_venta = document.getElementById("precio_venta").value;
    const fotoInput = document.getElementById("foto_producto");
    const id = sessionStorage.getItem('idSeleccionado');

    const foto = fotoInput.files[0];

    let imagen_actual = "";
    if (!foto) {
        // Si no se subió nueva imagen, tomamos la que ya está mostrada
        const imgElement = document.getElementById("imagen_agregada");
        if (imgElement) {
            imagen_actual = imgElement.getAttribute("src");
        }
    }

    if (
        !tipo || !nombre || !descripcion || !cant_actual ||
        !cant_min || !cant_max || !precio_compra || !precio_venta
    ) {
        alert("Por favor completa todos los campos antes de agregar el producto.");
        return;
    }

    const formData = new FormData();
    formData.append("tipo_producto", tipo);
    formData.append("nombre_producto", nombre);
    formData.append("descripcion_producto", descripcion);

    if (foto) {
        formData.append("foto_producto", foto); // Nueva imagen
    } else {
        formData.append("imagen_actual", imagen_actual); // Imagen existente
    }


    formData.append("cantidad_actual", cant_actual);
    formData.append("cantidad_minima", cant_min);
    formData.append("cantidad_maxima", cant_max);
    formData.append("precio_compra", precio_compra);
    formData.append("precio_venta", precio_venta);
    formData.append("estatus", estatus);
    formData.append("id", id);
    formData.append("action", "producto");

    try {
        const response = await fetch("../php/editar_producto.php", {
            method: "POST",
            body: formData,
        });

        const data = await response.text(); // o usa .json() si tu PHP devuelve JSON
        Swal.fire({
            text: "Producto editada con exito",
            icon: "success",
            confirmButtonColor: "#A6762A",
            confirmButtonText: "OK"
        })
        document.querySelector(".agregar_producto").reset();
        document.getElementById("imagen_a_agregar").innerHTML = "";

        inicializar();
    } catch (err) {
        console.error('Error al enviar el formulario:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
});

// Botón Cancelar: limpia todos los campos
document.querySelector("#cancelar").addEventListener("click", function () {
    console.log("hola");
    if (confirm("¿Estás seguro de que deseas cancelar y limpiar el formulario?")) {
        document.querySelector(".agregar_producto").reset();
        document.getElementById("imagen_a_agregar").innerHTML = "";
    }
});

document.querySelector("#boton_regresar").addEventListener("click", function () {
    if (confirm("¿Estas seguro de que deseas regresar, los cambios que aún no se han guardado se perderan?")) {
        window.location.href = "../html/administracion.html"
    }
});
async function inicializar() {
    await cargar_categorias_para_combobox(); // Primero se llena el combo
    await recuperar_id();                    // Luego se cargan los datos
}

async function recuperar_id() {
    const id = sessionStorage.getItem('idSeleccionado'); // <- este es el que usaste antes
    if (id) {
        const url = `../php/administracion_obtener_datos.php?accion=producto&idproducto=${encodeURIComponent(id)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const producto = data[0]; // Suponiendo que te regresa un array

                document.getElementById("id_producto").innerText = producto.id_producto;
                document.getElementById("estatus_producto").value = producto.estatus;
                document.getElementById("combobox_tipo_producto").value = producto.tipo_producto;
                document.getElementById("nombre_producto").value = producto.nombre;
                document.getElementById("descripcion_producto").value = producto.descripcion;

                document.getElementById("cantidad_actual").value = producto.cantidad_act;
                document.getElementById("cantidad_minima").value = producto.cantidad_min;
                document.getElementById("cantidad_maxima").value = producto.cantidad_max;

                document.getElementById("precio_compra").value = producto.precio_compra;
                document.getElementById("precio_venta").value = producto.precio_venta;

                let resultadosDiv = document.getElementById("imagen_a_agregar");
                resultadosDiv.innerHTML = `<img src="${producto.direccion_foto}" id="imagen_agregada" alt="">`;
            }

        } catch (e) {
            console.error("Error en la búsqueda de productos:", e);
        }
    } else {
        console.log('No se encontró ningún ID en localStorage');
    }
}
