const ver_sesion = new Verificar_Inicio_de_Sesion();

import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    ver_sesion.ver_sesion_actual("usuario");
    let id_usu1 = null;
    obtener_id_usuario()
        .then(id_usu => {
            id_usu1 = id_usu;
            return cargar_datos_usuarios(id_usu); //esperamos a que se cargue
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
    const btnCambiar = document.getElementById("btn_cambiar_contra");
    const btnSiguiente = document.getElementById("btn_siguiente");
    const btnCambiarFinal = document.getElementById("btn_cambiar_final");
    const btnCancelar1 = document.getElementById("btn_cancelar_1");
    const btnCancelar2 = document.getElementById("btn_cancelar_2");

    // Inputs
    const inputContraActual = document.getElementById("input_contra_actual");
    const inputNueva = document.getElementById("nueva_contra");
    const inputConfirmar = document.getElementById("confirmar_contra");

    // Divs
    const divIngresarContra = document.querySelector(".ingresar_contra");
    const divNuevaContra = document.querySelector(".nueva_contra");

    function resetearCampos() {
        inputContraActual.value = "";
        inputNueva.value = "";
        inputConfirmar.value = "";
        divIngresarContra.style.display = "none";
        divNuevaContra.style.display = "none";
        btnCambiar.style.display = "block";
    }

    btnCambiar.addEventListener("click", () => {
        resetearCampos(); // por si estaba medio lleno antes
        divIngresarContra.style.display = "block";
        btnCambiar.style.display = "none";
    });

    btnSiguiente.addEventListener("click", () => {
        if (inputContraActual.value.trim() === "") {
            Swal.fire({
                title: "Campo vacío",
                text: "Por favor ingrese su contraseña actual",
                icon: "warning",
                confirmButtonColor: '#a67c00'
            });


            return;
        }

        if (verificar_contraseña(id_usu1)) {
            divIngresarContra.style.display = "none";
            divNuevaContra.style.display = "block";

        }

    });

    btnCambiarFinal.addEventListener("click", () => {
        const nueva = inputNueva.value.trim();
        const confirmar = inputConfirmar.value.trim();

        if (nueva === "" || confirmar === "") {
            Swal.fire({ title: "Campos vacíos", text: "Por favor complete todos los campos", icon: "warning", confirmButtonColor: '#a67c00', });
            return;
        }

        if (nueva !== confirmar) {
            Swal.fire({ title: "No coinciden", text: "Las contraseñas no coinciden", icon: "error", confirmButtonColor: '#a67c00', });
            return;
        }
        actualizar_contraseña(id_usu1);
        resetearCampos();
    });

    btnCancelar1.addEventListener("click", () => {
        resetearCampos();

    });

    btnCancelar2.addEventListener("click", () => {
        resetearCampos();

    });

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

async function verificar_contraseña(id_usu1) {
    const formData = new FormData();

    formData.append("contraseña_actual", document.getElementById("input_contra_actual").value);
    formData.append("id_usu", id_usu1);
    formData.append("action", "verificar_contra");

    try {
        const response = await fetch("../php/cambiar_contra.php", {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            Swal.fire({
                title: '¿Está seguro?',
                text: "Va a cambiar su contraseña",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#a67c00',
                cancelButtonColor: '#004080'
            }).then((result) => {
                if (result.isConfirmed) {
                    return true;
                }
            });
        }
        else {
            Swal.fire({
                title: "Datos erróneos",
                icon: "error",
                confirmButtonColor: "#A6762A"
            });
        }

    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

async function actualizar_contraseña(id_usu1) {
    const formData = new FormData();

    formData.append("nueva_contraseña", document.getElementById('nueva_contra').value);
    formData.append("id_usu", id_usu1);
    formData.append("action", "actualizar_contra");

    try {
        const response = await fetch("../php/cambiar_contra.php", {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (result.success) {
            Swal.fire({
                title: "¡Listo!",
                text: "Contraseña cambiada correctamente",
                icon: "success",
                confirmButtonColor: '#a67c00',
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
