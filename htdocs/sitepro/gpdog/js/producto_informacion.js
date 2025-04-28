const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    inicializar();
    ver_sesion.ver_sesion_actual("usuario");
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

    document.querySelector("#boton_regresar").addEventListener("click", function () {
        if (confirm("¿Estas seguro de que deseas regresar, los cambios que aún no se han guardado se perderan?")) {
            window.location.href = "../html/home.html"
        }
    });

    document.querySelector("#boton_agregar_al_carrito").addEventListener("click", function () {
        agregar_al_carrito();
    });
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





async function inicializar() {
    await recuperar_id();                    // Luego se cargan los datos
}

async function recuperar_id() {
    const id = sessionStorage.getItem('id_producto_seleccionado'); // <- este es el que usaste antes
    if (id) {
        const url = `../php/administracion_obtener_datos.php?accion=producto&idproducto=${encodeURIComponent(id)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data && data.length > 0) {
                const producto = data[0]; // Suponiendo que te regresa un array

                document.getElementById("nombre_producto").textContent = producto.nombre;
                document.getElementById("descripcion_producto").textContent = producto.descripcion;

                document.getElementById("cantidad_actual").textContent = "Cantidad disponible: " + producto.cantidad_act;

                document.getElementById("precio_venta").textContent = "$" + producto.precio_venta + " MXN";

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



async function agregar_al_carrito() {
    try {
        const res = await fetch('../php/sesion.php');
        const data = await res.json();

        if (!data.logueado) {
            alert("Debes iniciar sesión primero");
            return;
        }

        const user_id = data.user_id;
        console.log("usuario", user_id);
        let id_producto = sessionStorage.getItem('id_producto_seleccionado');
        const formData = new FormData();
        formData.append("id_producto", id_producto);
        formData.append("id_usuario", user_id);
        formData.append("action", 'agregar_al_carrito');

        const response = await fetch("../php/carrito.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: "Producto enviado al carrito",
                text: "Se ha agregado a tu carrito de compras, si quieres puedes ir a verlo ya.",
                icon: "success",
                showCancelButton: true,
                cancelButtonText: "Ver más productos",
                confirmButtonColor: "#A6762A",
                cancelButtonColor: "#004080",
                confirmButtonText: "Ir a mi carrito"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../html/carrito.html";
                } else {
                    window.location.href = "../html/home.html";
                }
            });
        } else {
            alert("Fallo el agregar el producto")
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}