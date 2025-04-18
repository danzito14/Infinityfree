const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    inicializar();
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


document.querySelector("#botones_agregar-agregar").addEventListener("click", async function () {
    const estatus = document.getElementById("estatus_producto").value;
    const nombre = document.getElementById("nombre_producto").value;
    const id = sessionStorage.getItem('idSeleccionado');

    alert("estatus es:" + estatus);
    if (!nombre) {
        alert("Por favor completa todos los campos antes de agregar el producto.");
        return;
    }

    const formData = new FormData();
    formData.append("nombre_categoria", nombre);
    formData.append("estatus", estatus);
    formData.append("id", id);
    formData.append("action", "categoria");

    try {
        const response = await fetch("../php/editar_producto.php", {
            method: "POST",
            body: formData,
        });

        const data = await response.text(); // o usa .json() si tu PHP devuelve JSON
        alert("Producto editado con éxito: " + data);
        document.querySelector(".agregar_producto").reset();
        document.getElementById("imagen_a_agregar").innerHTML = "";
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
    await recuperar_id();
}

async function recuperar_id() {
    const id = sessionStorage.getItem('idSeleccionadoCategoria');
    if (id) {
        const url = `../php/administracion_obtener_datos.php?accion=clase&idcategoria=${encodeURIComponent(id)}`;
        alert("ID es aaaaa: " + id);
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const producto = data[0];

                document.getElementById("id_producto").innerText = producto.id_tipo_producto;
                document.getElementById("estatus_producto").value = producto.estatus;
                document.getElementById("nombre_producto").value = producto.descripcion;
            }

        } catch (e) {
            console.error("Error en la búsqueda de categoria:", e);
        }
    } else {
        console.log('No se encontró ningún ID en sessionStorage');
    }
}
