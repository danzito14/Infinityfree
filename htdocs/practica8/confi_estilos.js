let nombreusuariologeado = '';
let nombrelogeado = '';
let nombredelacookie = "";
document.addEventListener('DOMContentLoaded', function () {
    nombredelacookie = localStorage.getItem('nombredelacookie');
    alert("hola la cookie es " + nombredelacookie);
    if (nombredelacookie) {
        const cargarCookies = new CargarCookiesAlIniciar(nombredelacookie);
        cargarCookies.cargarEstilosCookies(nombredelacookie);

        // Mostrar el nombre del usuario cargado
        console.log("Nombre de la cookie cargado:", nombredelacookie);
        alert("sdfsdf" + nombredelacookie);
        verificarUsuarioLogeado(nombredelacookie);
    } else {
        console.warn("No se encontró el nombre de la cookie.");
    }
});



document.addEventListener("DOMContentLoaded", () => {
    const cargarCookies = new CargarCookiesAlIniciar();
    cargarCookies.cargarEstilosCookies(nombredelacookie);
});

function borrarCookie(nombre) {
    document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// Función para abrir y cerrar el menú lateral
document.addEventListener('DOMContentLoaded', function () {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const closeMenuBtn = document.querySelector('.close-menu');

    menuBtn.addEventListener('click', function () {
        sidebarMenu.classList.toggle('active');
    });

    closeMenuBtn.addEventListener('click', function () {
        sidebarMenu.classList.remove('active');
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
//CARRITO HEADER
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".carrito-btn").addEventListener("click", function () {
        window.location.href = "carrito2.html";
    });
});

//*****BOTONES DE SIDEBAR MENU*****
//INICIO
document.addEventListener('DOMContentLoaded', function () {
    const btnInicio = document.getElementById('btnInicio');

    btnInicio.addEventListener('click', function () {
        window.location.href = 'home.html';

    });
});
//CARRITO
document.addEventListener('DOMContentLoaded', function () {
    const btnCarrito = document.getElementById('btnCarrito');

    btnCarrito.addEventListener('click', function () {
        window.location.href = 'carrito2.html';

    });
});
// CIERRE DE SESIÓN
document.addEventListener('DOMContentLoaded', function () {
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    btnCerrarSesion.addEventListener('click', function () {
        Swal.fire({
            title: "Estas seguro de querer cerrar sesión",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: " #A6762A",
            cancelButtonColor: "#004080",
            confirmButtonText: "Cerrar sesion",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Cerrando Sesión",
                    text: "Este atento a donde van sus mascotas. Bye!",
                    icon: "success"
                });
                cerrarSesion(nombreusuariologeado);
                window.location.href = 'login.html';
            }
        });
        if (confirmacion) {

        }
    });
});

function verificarUsuarioLogeado(nombredelacookie) {
    const datos_cookies = obtenerTodasLasCookies();
    let usuarioEncontrado = false;
    alert("dsfdfdsfd" + nombredelacookie);
    Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {
        const regex = new RegExp(`^${nombredelacookie}\d+$`);
        alert(nombredelacookie === nombreCookie);
        if (nombredelacookie === nombreCookie) { // Verifica que el nombre siga el patrón "datos_usuarioX"
            try {
                alert("jaimito el cartero" + nombredelacookie);
                // Parseamos el valor JSON de la cookie
                const datosUsuario = JSON.parse(valorCookie);

                // Comprobamos si el usuario está logeado
                if (datosUsuario.logeado === "true") {
                    nombredelacookie = nombreCookie; // Actualiza la variable global con la cookie válida
                    nombreusuariologeado = datosUsuario.nombre;
                    nombrelogeado = datosUsuario.usuario;
                    usuarioEncontrado = true;

                    console.log("Usuario logeado:", nombreusuariologeado);
                    console.log("Cookie utilizada:", nombredelacookie);

                    let resultadosDiv = document.getElementById('nombreusuarioloegado');
                    if (resultadosDiv) {
                        let datosContacto = `
                            <span><strong>${nombreusuariologeado}</strong></span>
                        `;
                        resultadosDiv.innerHTML = datosContacto;
                    }
                }
            } catch (error) {
                console.error("Error al procesar la cookie:", nombreCookie, error);
            }
        }
    });

    if (!usuarioEncontrado) {
        window.location.href = "login.html";
    }
}
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


function cerrarSesion(nombreusuariologeado) {
    const datos_cookies = obtenerTodasLasCookies();
    Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {
        try {
            let datosUsuario = JSON.parse(valorCookie);

            // ✅ Comparar con los valores correctos
            if (datosUsuario.usuario === nombreusuariologeado || datosUsuario.nombre === nombreusuariologeado) {
                datosUsuario.logeado = false; // Usar booleano en lugar de string

                console.log("Actualizando cookie:", nombreCookie, datosUsuario);

                // ✅ Guardar la cookie actualizada
                document.cookie = `${nombreCookie}=${JSON.stringify(datosUsuario)}; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/`;
            }
        } catch (error) {
            console.error("Error al actualizar la cookie:", error);
        }
    });
}

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
    document.cookie = nombredelacookie + "_bondy_backgroundcolor=" + encodeURIComponent(color.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

});

color_fondo_cabecera.addEventListener('input', function () {
    header.style.backgroundColor = color_fondo_cabecera.value;
    side_bar.style.background = color_fondo_cabecera.value;
    document.cookie = nombredelacookie + "_header_backgroundcolor=" + encodeURIComponent(color_fondo_cabecera.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

});

color_fondo_footer.addEventListener('input', function () {
    footer.style.backgroundColor = color_fondo_footer.value;
    document.cookie = nombredelacookie + "_footer_backgroundcolor=" + encodeURIComponent(color_fondo_footer.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

});

const tamaños = document.querySelector('#imagen_tamaño');
const imgs = document.querySelectorAll('img');

tamaños.addEventListener('change', function () {
    let medidas = "";
    if (tamaños.value === "chico") {
        medidas = "20%"
    }
    else if (tamaños.value === "mediano") {
        medidas = "50%";
    } else if (tamaños.value === "grande") {
        medidas = "90%";
    }
    imgs.forEach(img => {
        img.style.width = medidas;
        img.style.height = medidas;
    });

    document.cookie = nombredelacookie + "_img_width=" + encodeURIComponent(tamaños.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";

});

const radius = document.querySelector('#tamaño_borde_radius'); // Selecciona un solo elemento

radius.addEventListener('input', function () {
    const porcentaje = radius.value + '%';

    imgs.forEach(img => {
        img.style.borderRadius = porcentaje;
    });

    document.cookie = nombredelacookie + "_img_radius=" + encodeURIComponent(radius.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});


const sombras = document.getElementById('color_sombra');

sombras.addEventListener('change', function () {
    imgs.forEach(img => {
        img.style.boxShadow = sombras.value;
        document.cookie = nombredelacookie + "_sombra=" + encodeURIComponent(sombras.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
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
    document.cookie = nombredelacookie + "_img_border_color=" + encodeURIComponent(color_borde.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    document.cookie = nombredelacookie + "_img_border_width=" + encodeURIComponent(bordes.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
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
    document.cookie = nombredelacookie + "_enlace_border_radius=" + encodeURIComponent(bordes_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

// Evento para cambiar el color del enlace
color_enlace.addEventListener('input', function () {
    enlaces.forEach(link => {
        link.style.color = color_enlace.value;
    });
    document.cookie = nombredelacookie + "_enlace_color=" + encodeURIComponent(color_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

// Evento para cambiar el color de fondo del enlace
color_fondo_enlace.addEventListener('input', function () {
    enlaces.forEach(link => {
        link.style.backgroundColor = color_fondo_enlace.value;
    });
    document.cookie = nombredelacookie + "_enlace_background=" + encodeURIComponent(color_fondo_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

const color_texto = document.getElementById("color_texto");

color_texto.addEventListener('input', function () {
    const textos = document.querySelectorAll('body, h1, h2, h3, h4, h5, h6, p, label, span, div, button, li, strong, em');

    textos.forEach(texto => {
        texto.style.color = color_texto.value;
    });

    document.cookie = nombredelacookie + "_body_color=" + encodeURIComponent(color_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

// Cambio de tamaño de texto
const tamaño_texto = document.getElementById('tamaño_texto');
tamaño_texto.addEventListener("change", function () {
    document.body.style.fontSize = tamaño_texto.value;
    document.cookie = nombredelacookie + "_body_font_size=" + encodeURIComponent(tamaño_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});
// Crear una instancia de la clase
const cargarCookies = new CargarCookiesAlIniciar();
cargarCookies.cargarEstilosCookies();

function borrarCookie(nombre) {
    document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}


document.querySelector('.reiniciar_estilo').addEventListener('click', () => {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const nombre = cookie.split('=')[0].trim();
        borrarCookie(nombre);
        location.reload();
    });
});
