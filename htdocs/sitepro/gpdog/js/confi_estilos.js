import Sidebar from "./clases/Sidebar.js";


document.addEventListener('DOMContentLoaded', function () {
    let nombreusuariologeado = '';
    let nombrelogeado = '';
    let nombredelacookie = "";
    let nombredelacookie2 = "";

    const ver_sesion = new Verificar_Inicio_de_Sesion();
    ver_sesion.ver_sesion_actual("usuario");
    Sidebar.cargarSidebar();
    setTimeout(() => {

        const menuBtn = document.querySelector('.menu-btn');
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const closeMenuBtn = document.querySelector('.close-menu');

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
    const cargarCookies = new CargarCookiesAlIniciar();
    cargarCookies.cargarEstilosCookies(nombredelacookie);

    fetch('../php/sesion.php')
        .then(res => res.json())
        .then(data => {
            nombredelacookie = data.user_id; // Asignar el valor de la cookie

            console.log(nombredelacookie);
            console.log("asasas");

            if (nombredelacookie) {
                nombredelacookie2 = "estilo_" + nombredelacookie; // Definir aquí

                const cargarCookies = new CargarCookiesAlIniciar(nombredelacookie2);
                cargarCookies.cargarEstilosCookies(nombredelacookie2);
                incializar_eventos(nombredelacookie2);
                // Mostrar el nombre del usuario cargado
                console.log("Nombre de la cookie cargado:", nombredelacookie);
            } else {
                console.warn("No se encontró el nombre de la cookie.");
            }
        })
        .catch(error => {
            console.error("Error al cargar la sesión:", error);
        });
});

function obtenerTodasLasCookies() {
    const cookies = document.cookie.split('; '); // Divide cada cookie
    let cookieObj = {};

    cookies.forEach(cookie => {
        let [nombre, valor] = cookie.split('='); // Divide en nombre y valor
        if (nombre && valor) {
            cookieObj[nombre.trim()] = decodeURIComponent(valor); // Decodifica valores y elimina espacios
        }
    });

    return cookieObj;
}

// Llamar a la función al ca

function incializar_eventos(nombredelacookie2) {
    const color = document.getElementById('color_fondo');
    const color_fondo_cabecera = document.getElementById('color_fondo_cabecera');
    const color_fondo_footer = document.getElementById('color_fondo_footer');

    const body = document.body;
    const main = document.querySelector('main');
    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const side_bar = document.getElementById('side_bar');
    color.addEventListener('input', function () {
        body.style.backgroundColor = color.value;
        main.style.backgroundColor = color.value;
        document.cookie = nombredelacookie2 + "_bondy_backgroundcolor=" + encodeURIComponent(color.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

    });

    color_fondo_cabecera.addEventListener('input', function () {
        header.style.backgroundColor = color_fondo_cabecera.value;

        document.cookie = nombredelacookie2 + "_header_backgroundcolor=" + encodeURIComponent(color_fondo_cabecera.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

    });

    color_fondo_footer.addEventListener('input', function () {
        footer.style.backgroundColor = color_fondo_footer.value;
        document.cookie = nombredelacookie2 + "_footer_backgroundcolor=" + encodeURIComponent(color_fondo_footer.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

    });

    const tamaños = document.querySelector('#imagen_tamaño');
    const imgs = document.querySelectorAll('img');

    tamaños.addEventListener('change', function () {
        let medidas = "";
        if (tamaños.value === "chico") {
            medidas = "20"
        }
        else if (tamaños.value === "mediano") {
            medidas = "50";
        } else if (tamaños.value === "grande") {
            medidas = "90";
        }
        imgs.forEach(img => {
            img.style.width = medidas + "%";
            img.style.height = medidas + "%";
        });

        document.cookie = nombredelacookie2 + "_img_width=" + encodeURIComponent(medidas) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";

    });

    const radius = document.querySelector('#tamaño_borde_radius'); // Selecciona un solo elemento

    radius.addEventListener('input', function () {
        const porcentaje = radius.value + '%';

        imgs.forEach(img => {
            img.style.borderRadius = porcentaje;
        });

        document.cookie = nombredelacookie2 + "_img_radius=" + encodeURIComponent(radius.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    });


    const sombras = document.getElementById('color_sombra');

    sombras.addEventListener('change', function () {
        imgs.forEach(img => {
            img.style.boxShadow = sombras.value;
            document.cookie = nombredelacookie2 + "_sombra=" + encodeURIComponent(sombras.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
        })
    });


    const bordes = document.querySelector('#tamaño_borde');
    const color_borde = document.getElementById('color_borde');


    function actualizarBorde() {
        imgs.forEach(img => {
            img.style.borderColor = color_borde.value;
            img.style.borderWidth = bordes.value;
            img.style.borderStyle = 'solid';
        });

        // Guardar en cookies
        document.cookie = nombredelacookie2 + "_img_border_color=" + encodeURIComponent(color_borde.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
        document.cookie = nombredelacookie2 + "_img_border_width=" + encodeURIComponent(bordes.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    }
    bordes.addEventListener('change', actualizarBorde);
    color_borde.addEventListener('input', actualizarBorde);



    const bordes_enlace = document.querySelector('#tamaño_radius_pequeño');
    const color_enlace = document.getElementById('color_enlace');
    const color_fondo_enlace = document.getElementById('color_fondo_enlace');
    const enlaces = document.querySelectorAll('a'); // Se corrige la selección de enlaces

    // Evento para cambiar el radio de borde de los enlaces
    bordes_enlace.addEventListener('input', function () {
        enlaces.forEach(link => {
            link.style.borderRadius = bordes_enlace.value + 'px';
        });
        document.cookie = nombredelacookie2 + "_enlace_border_radius=" + encodeURIComponent(bordes_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    });

    // Evento para cambiar el color del enlace
    color_enlace.addEventListener('input', function () {
        enlaces.forEach(link => {
            link.style.color = color_enlace.value;
        });
        document.cookie = nombredelacookie2 + "_enlace_color=" + encodeURIComponent(color_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    });

    // Evento para cambiar el color de fondo del enlace
    color_fondo_enlace.addEventListener('input', function () {
        enlaces.forEach(link => {
            link.style.backgroundColor = color_fondo_enlace.value;
        });
        document.cookie = nombredelacookie2 + "_enlace_background=" + encodeURIComponent(color_fondo_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    });

    const color_texto = document.getElementById("color_texto");

    color_texto.addEventListener('input', function () {
        const textos = document.querySelectorAll('body, h1, h2, h3, h4, h5, h6, p, label, span, div, button, li, strong, em');

        textos.forEach(texto => {
            texto.style.color = color_texto.value;
        });

        document.cookie = nombredelacookie2 + "_body_color=" + encodeURIComponent(color_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    });


    color_fondo_texto.addEventListener('input', function () {
        const textos = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span');
        textos.forEach(function (texto) {
            texto.style.backgroundColor = color_fondo_texto.value;
            document.cookie = nombredelacookie2 + "_texto_background=" + encodeURIComponent(color_fondo_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
        });
    });

    // Cambio de tamaño de texto
    const tamaño_texto = document.getElementById('tamaño_texto');
    tamaño_texto.addEventListener("change", function () {
        document.body.style.fontSize = tamaño_texto.value;
        document.cookie = nombredelacookie2 + "_body_font_size=" + encodeURIComponent(tamaño_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    });
    // Crear una instancia de la clase
    const cargarCookies = new CargarCookiesAlIniciar();
    cargarCookies.cargarEstilosCookies();

    function borrarCookie(nombre) {
        document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }

    document.querySelector('.reiniciar_estilo').addEventListener('click', () => {
        alert("Reiniciando estilo");

        // Asegúrate de que nombredelacookie esté definido
        const nombredelacookie = "tu_prefijo"; // Cambia esto por el valor correcto
        const cookies = document.cookie.split(';');

        cookies.forEach(cookie => {
            const nombre = cookie.split('=')[0].trim();
            if (nombre.startsWith(nombredelacookie2)) {
                borrarCookie(nombre);
            }
        });

        location.reload();
    });
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