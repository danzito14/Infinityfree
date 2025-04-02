
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
    document.cookie = "bondy_backgroundcolor=" + encodeURIComponent(color.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
});

color_fondo_cabecera.addEventListener('input', function () {
    header.style.backgroundColor = color_fondo_cabecera.value;
    side_bar.style.background = color_fondo_cabecera.value;
    document.cookie = "header_backgroundcolor=" + encodeURIComponent(color_fondo_cabecera.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

});

color_fondo_footer.addEventListener('input', function () {
    footer.style.backgroundColor = color_fondo_footer.value;
    document.cookie = "footer_backgroundcolor=" + encodeURIComponent(color_fondo_footer.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

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

    document.cookie = "img_width=" + encodeURIComponent(tamaños.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";

});

const radius = document.querySelector('#tamaño_borde_radius'); // Selecciona un solo elemento

radius.addEventListener('input', function () {
    const porcentaje = radius.value + '%';

    imgs.forEach(img => {
        img.style.borderRadius = porcentaje;
    });

    document.cookie = "img_radius=" + encodeURIComponent(radius.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});


const sombras = document.getElementById('color_sombra');

sombras.addEventListener('change', function () {
    imgs.forEach(img => {
        img.style.boxShadow = sombras.value;
        document.cookie = "sombra=" + encodeURIComponent(sombras.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
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
    document.cookie = "img_border_color=" + encodeURIComponent(color_borde.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
    document.cookie = "img_border_width=" + encodeURIComponent(bordes.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
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
    document.cookie = "enlace_border_radius=" + encodeURIComponent(bordes_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

// Evento para cambiar el color del enlace
color_enlace.addEventListener('input', function () {
    enlaces.forEach(link => {
        link.style.color = color_enlace.value;
    });
    document.cookie = "enlace_color=" + encodeURIComponent(color_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

// Evento para cambiar el color de fondo del enlace
color_fondo_enlace.addEventListener('input', function () {
    enlaces.forEach(link => {
        link.style.backgroundColor = color_fondo_enlace.value;
    });
    document.cookie = "enlace_background=" + encodeURIComponent(color_fondo_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

const color_texto = document.getElementById("color_texto");

color_texto.addEventListener('input', function () {
    const textos = document.querySelectorAll('body, h1, h2, h3, h4, h5, h6, p, label, span, div, button, li, strong, em');

    textos.forEach(texto => {
        texto.style.color = color_texto.value;
    });

    document.cookie = "body_color=" + encodeURIComponent(color_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
});

// Cambio de tamaño de texto
const tamaño_texto = document.getElementById('tamaño_texto');
tamaño_texto.addEventListener("change", function () {
    document.body.style.fontSize = tamaño_texto.value;
    document.cookie = "body_font_size=" + encodeURIComponent(tamaño_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/";
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
