
const ver_sesion = new Verificar_Inicio_de_Sesion();
window.id_usuario = "";
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    const ver_sesion = new Verificar_Inicio_de_Sesion();
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
            window.id_usuario = data.user_id;
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




const asunto_correo = document.getElementById("asunto_correo");
const cuerpo_correo = document.getElementById("cuerpo_correo");

const enviar_correo = document.getElementById("enviar_correo");

enviar_correo.addEventListener("click", function (e) {
    e.preventDefault();
    guardar_mensaje(asunto_correo.value, cuerpo_correo.value, window.id_usuario);
});

async function guardar_mensaje(asunto, cuerpo, id_usuario) {
    const formdata = new FormData();
    formdata.append("id_usuario", id_usuario);
    formdata.append("asunto", asunto);
    formdata.append("cuerpo", cuerpo);
    formdata.append("action", "guardar_mensaje");

    try {
        const response = await fetch("../php/mensajeria.php", {
            method: 'POST',
            body: formdata
        });

        const result = await response.json();
        if (result.success) {
            Swal.fire({
                title: "Se ha enviado el mensaje al administrador",
                text: "Su opnion se toma es importante para nosotros",
                icon: "success",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
            asunto_correo.value = "";
            cuerpo_correo.value = "";
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

}

