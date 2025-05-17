const ver_sesion = new Verificar_Inicio_de_Sesion();

import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    const ver_sesion = new Verificar_Inicio_de_Sesion();
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



const borrar_respuesta = document.getElementById('borrar_respuesta');
borrar_respuesta.addEventListener("click", function () {
    document.getElementById("correo_cuerpo").style.height = '90%';
    document.getElementById("responder_correo").style.display = 'none';
    document.getElementById('botones_correo').style.display = 'flex';
});

recibir_bandeja_de_entrada();
async function recibir_bandeja_de_entrada() {
    const formData = new FormData();
    formData.append("action", "recibir_mensajes");

    try {
        const response = await fetch("../php/mensajeria.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        cargar_bandeja_entrada(result);
    } catch (e) {
        console.log("Error", e);
    }
}

async function recibir_mensajes_pendientes() {
    const formData = new FormData();
    formData.append("action", "recibir_no_mensajes");

    try {
        const response = await fetch("../php/mensajeria.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        cargar_bandeja_entrada(result);
    } catch (e) {
        console.log("Error", e);
    }
}
let pagina_actual = 1;
const por_pagina = 10;
let total_correos = 0;
let todos_los_correos = [];

const paginacion = document.getElementById("paginacion_correo");
const rango_texto = paginacion.querySelector("h5");
const btn_anterior = paginacion.querySelectorAll("button")[0];
const btn_siguiente = paginacion.querySelectorAll("button")[1];

btn_anterior.addEventListener("click", () => {
    if (pagina_actual > 1) {
        pagina_actual--;
        renderizar_pagina();
    }
});

btn_siguiente.addEventListener("click", () => {
    const total_paginas = Math.ceil(total_correos / por_pagina);
    if (pagina_actual < total_paginas) {
        pagina_actual++;
        renderizar_pagina();
    }
});

function cargar_bandeja_entrada(data) {
    todos_los_correos = data;
    total_correos = data.length;
    pagina_actual = 1;
    renderizar_pagina();
}

function renderizar_pagina() {
    const bandeja_entrada = document.getElementById("contenedor_correos");
    bandeja_entrada.innerHTML = "";

    const inicio = (pagina_actual - 1) * por_pagina;
    const fin = Math.min(inicio + por_pagina, total_correos);
    const correos_pagina = todos_los_correos.slice(inicio, fin);

    // Actualizar el texto de rango
    rango_texto.textContent = `${inicio + 1}-${fin} de ${total_correos}`;

    correos_pagina.forEach(dato => {
        const mensaje_recibido = document.createElement("div");
        mensaje_recibido.classList.add("correo");
        mensaje_recibido.innerHTML = `
            <input type="hidden" name="id_correo" data-id="${dato.id_correo}">
            <div class="remitente"><b>${dato.Usuario}</b></div>
            <div>
                <div class="titulo_correo">${dato.Asunto}</div>
                <div class="fecha">${dato.Fecha}</div>
            </div>
            <div style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 350px; display: block;">
                ${dato.Cuerpo}
            </div>
        `;
        if (dato.Leido == 0) {
            mensaje_recibido.style.backgroundColor = "#99A7B8";

        }

        mensaje_recibido.addEventListener("click", () => {
            seleccionar_correo(dato.id_correo);
        });

        bandeja_entrada.appendChild(mensaje_recibido);
    });
}

const bandeja_entrada = document.getElementById("todos_los_correos");
const correos_no_leidos = document.getElementById("correos_no_leidos");

bandeja_entrada.addEventListener("click", function () {
    recibir_bandeja_de_entrada();
});

correos_no_leidos.addEventListener("click", function () {
    recibir_mensajes_pendientes();
})

function seleccionar_correo(id_correo) {
    console.log("El correo seleccionado es el:", id_correo);
    cargar_correo(id_correo);
    recibir_bandeja_de_entrada();
}

const datosCorreo = {
    nombre: "",
    asunto: "",
    destinatario: "",
    id_correo: ""
};

async function cargar_correo(id_correo) {
    document.getElementById("correo_completo").style.display = "flex";
    const formData = new FormData();
    formData.append("id_correo", id_correo);
    formData.append("action", "cargar_correo");

    const correo_cuerpo_completo = document.getElementById("correo_completo_cuerpo");
    correo_cuerpo_completo.innerHTML = "";

    try {
        const response = await fetch("../php/mensajeria.php", {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        console.log(result);
        document.getElementById("asunto_correo_completo").textContent = result.asunto;
        let correo = `
<input type="hidden" id="nombre_correo" name="nombre_correo" value="${result.nombre}">
<input type="hidden" id="asunto_correo" name="asunto_correo" value="${result.asunto}">
<input type="hidden" id="correo" name="correo" value="${result.correo}">
        <h4> <b>${result.nombre}</b></h4>
                <h4>Para: <b>Usted</b></h4>
                <div id="correo_cuerpo" style="white-space: pre-line;">
                    ${result.cuerpo}
                </div>
        `;
        datosCorreo.id_correo = result.id_correo;

        correo_cuerpo_completo.innerHTML = correo;
    } catch (e) {
        console.log("Error", e);
    }
}

const borrar = document.getElementById("borrar");
borrar.addEventListener("click", async function () {
    if (confirm("¿Estas seguro de que desea borrar este mensaje")) {
        const formData = new FormData();
        formData.append("id_correo", datosCorreo.id_correo);
        formData.append("action", "borrar_correo");
        try {
            const response = await fetch("../php/mensajeria.php", {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            if (result.success) {
                Swal.fire({
                    title: "Correo eliminado",
                    text: "El usuario se quedo sin una respuesta",
                    icon: "success",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                });
                document.getElementById("correo_completo").style.display = "none";
                cuerpo_respuesta.value = "";
            } else {
                Swal.fire({
                    title: result.message,
                    icon: "error",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                });
            }
        } catch (e) {
            console.log("Error", e);
        }
    }


});

const responder = document.getElementById("responder");

responder.addEventListener("click", function () {
    datosCorreo.nombre = document.getElementById("nombre_correo").value;
    datosCorreo.asunto = "RE:" + document.getElementById("asunto_correo").value;
    datosCorreo.destinatario = document.getElementById("correo").value;

    document.getElementById("respuesta_destinatario").textContent = "Para: " + datosCorreo.nombre;
    document.getElementById("respuesta_asunto").textContent = datosCorreo.asunto;

    document.getElementById("correo_cuerpo").style.height = '100px';
    document.getElementById("responder_correo").style.display = 'block';
    document.getElementById('botones_correo').style.display = 'none';
});

const enviar = document.getElementById("enviar_respuesta");


enviar.addEventListener("click", async function () {
    const cuerpo_respuesta = document.getElementById("textarea_cuerpo").value.trim();
    if (cuerpo_respuesta === "") {
        alert("El cuerpo del mensaje no puede estar vacío.");
        return;
    }

    console.log("destinatario:", datosCorreo.destinatario, "asunto: ", datosCorreo.asunto, "nombre", datosCorreo.nombre, "cuerpo:", cuerpo_respuesta);
    const formData = new FormData();
    formData.append("destinatario", datosCorreo.destinatario);
    formData.append("asunto", datosCorreo.asunto);
    formData.append("cuerpo", cuerpo_respuesta);
    formData.append("nombre", datosCorreo.nombre);
    formData.append("action", "enviar_respuesta");
    try {
        const response = await fetch("../php/mensajeria.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            Swal.fire({
                title: "Respuesta enviada",
                text: "Ya cumplimos con nuestra chamba",
                icon: "success",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
            document.getElementById("correo_completo").style.display = "flex";
            cuerpo_respuesta.value = "";
        } else {
            Swal.fire({
                title: result.message,
                icon: "error",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
        }
    } catch (e) {
        console.log("Error", e);
    }
});
