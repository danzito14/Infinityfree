const ver_sesion = new Verificar_Inicio_de_Sesion();

import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    ver_sesion.ver_sesion_actual();
    let id_usu1 = null;
    obtener_id_usuario()
        .then(id_usu => {
            id_usu1 = id_usu;
            return cargar_datos_usuarios(id_usu); // 👈 esperamos a que se cargue
        })
        .then(() => {
            setInputsReadonly('usuario', true);
            setInputsReadonly('direccion', true);
        })
        .catch(error => {
            console.error("Error al obtener ID del usuario:", error);
        });

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

    }, 100);

    window.editar = function editar(tipo) {
        if (tipo === 'usuario') {
            document.getElementById('editar_usuario').style.display = 'none';
            document.getElementById('guardar_usuario').style.display = 'block';
            document.getElementById('cancelar_usuario').style.display = 'block';
            setInputsReadonly('usuario', false);
        } else if (tipo === 'direccion') {
            document.getElementById('editar_direccion').style.display = 'none';
            document.getElementById('guardar_direccion').style.display = 'block';
            document.getElementById('cancelar_direccion').style.display = 'block';
            setInputsReadonly('direccion', false);
        }
    }

    window.guardar = function guardar(tipo) {
        if (tipo === 'usuario') {
            document.getElementById('guardar_usuario').style.display = 'none';
            document.getElementById('cancelar_usuario').style.display = 'none';
            document.getElementById('editar_usuario').style.display = 'block';
            enviar_datos_editados();
            setInputsReadonly('usuario', true);
        } else if (tipo === 'direccion') {
            document.getElementById('guardar_direccion').style.display = 'none';
            document.getElementById('cancelar_direccion').style.display = 'none';
            document.getElementById('editar_direccion').style.display = 'block';
            enviar_direccion_editados();
            setInputsReadonly('direccion', true);
        }
    }

    window.cancelar = function cancelar(tipo) {
        if (tipo === 'usuario') {
            document.getElementById('guardar_usuario').style.display = 'none';
            document.getElementById('cancelar_usuario').style.display = 'none';
            document.getElementById('editar_usuario').style.display = 'block';
            cargar_datos_usuarios(id_usu1);
            setInputsReadonly('usuario', true);
        } else if (tipo === 'direccion') {
            document.getElementById('guardar_direccion').style.display = 'none';
            document.getElementById('cancelar_direccion').style.display = 'none';
            document.getElementById('editar_direccion').style.display = 'block';
            cargar_datos_usuarios(id_usu1);
            setInputsReadonly('direccion', true);
        }
    }

    function setInputsReadonly(tipo, readonly) {
        if (tipo === 'usuario') {
            const inputs = document.querySelectorAll(`#datos_usuario input, #datos_usuario textarea`);
            inputs.forEach(input => {
                input.readOnly = readonly;
            });
        } else if (tipo === 'direccion') {
            const inputsDireccion = document.querySelectorAll(`#direccion_usuario input, #direccion_usuario textarea`);
            inputsDireccion.forEach(input => {
                input.readOnly = readonly;
            });
        }
    }




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
function obtener_id_usuario() {
    return fetch('../php/sesion.php')
        .then(res => res.json())
        .then(data => {
            if (data.logueado) {
                console.log("ID de usuario:", data.user_id);
                return data.user_id;
            } else {
                throw new Error("Usuario no logueado");
            }
        });
}



function cargar_datos_usuarios(id_usu) {
    fetch('../php/cargar_datos_usuario.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
            id_usu: id_usu
        })
    })
        .then(response => response.text()) // <- primero obtenemos texto para depurar
        .then(texto => {
            try {
                const data = JSON.parse(texto);
                console.log("aaaaa", data);
                document.getElementById("usuario_id").value = data.id_usu
                document.querySelector('#nombre_completo-usuario').value = data.nombre;
                document.querySelector('#nombre_usuario-usuario').value = data.nombre_usuario;
                document.querySelector('#correo-usuario').value = data.correo;
                document.querySelector('#num_telefono-usuario').value = data.num_tel;

                document.querySelector('#cp-direccion').value = data.cp;
                document.querySelector('#calle-direccion').value = data.calle;
                document.querySelector('#municipio-direccion').value = data.municipio;
                document.querySelector('#estado-direccion').value = data.estado;
                document.querySelector('#instrucciones_adicionales-direccion').value = data.instrucciones_adicionales;

                // Aquí puedes llenar el formulario o lo que necesites con `data`
            } catch (e) {
                console.error("Error al convertir la respuesta a JSON:", e);
            }
        })
        .catch(error => {
            console.error("Error al cargar datos del usuario:", error);
        });
    return true;
}

async function enviar_datos_editados() {
    const formData = new FormData();

    formData.append('nombre_completo', document.getElementById('nombre_completo-usuario').value);
    formData.append('nombre_usuario', document.getElementById('nombre_usuario-usuario').value);
    formData.append('correo', document.getElementById('correo-usuario').value);
    formData.append('num_telefono', document.getElementById('num_telefono-usuario').value);
    formData.append('id_usu', document.getElementById("usuario_id").value);
    formData.append('action', 'datos_usuario');

    try {
        const response = await fetch("../php/guardar_datos_editados.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: "Datos editados exitosamente",
                icon: "success",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
        } else {
            Swal.fire({
                title: "Los datos no cumplen con los parámetros",
                icon: "error",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

async function enviar_direccion_editados() {
    const formData = new FormData();

    formData.append("cp", document.getElementById('cp-direccion').value);
    formData.append("calle", document.getElementById('calle-direccion').value);
    formData.append("colonia", document.getElementById('colonia-direccion').value);
    formData.append("municipio", document.getElementById('municipio-direccion').value);
    formData.append("estado", document.getElementById('estado-direccion').value);
    formData.append("instrucciones_adicionales", document.getElementById('instrucciones_adicionales-direccion').value);
    formData.append('id_usu', document.getElementById("usuario_id").value);
    formData.append('action', 'datos_direccion');

    try {
        const response = await fetch("../php/guardar_datos_editados.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: "Datos editados exitosamente",
                icon: "success",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
        } else {
            Swal.fire({
                title: "Los datos no cumplen con los parámetros",
                icon: "error",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

