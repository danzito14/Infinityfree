const btnToggle = document.querySelector('.toggle-btn');


btnToggle.addEventListener('click', function () {
    document.getElementById('side_bar').classList.toggle('active');
});

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

const tamaños = document.querySelectorAll('input[name="tamaño_imagen"]');
const imgs = document.querySelectorAll('img');

tamaños.forEach(tamaño => {
    tamaño.addEventListener('input', function () {
        imgs.forEach(img => {
            img.style.width = tamaño.value;
        });
        document.cookie = "img_witdth=" + encodeURIComponent(tamaño.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
    });
});

const bordes = document.querySelectorAll('input[name="tamaño_borde"]');
const color_borde = document.getElementById('color_borde');

bordes.forEach(borde => {
    borde.addEventListener('input', function () {
        imgs.forEach(img => {
            img.style.borderColor = color_borde.value;
            img.style.borderWidth = borde.value;
            img.style.borderStyle = 'solid';

        });
        document.cookie = "img_border_color=" + encodeURIComponent(color_borde.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
        document.cookie = "img_border_width=" + encodeURIComponent(borde.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
    });
});


const bordes_enlace = document.querySelectorAll('input[name="tamaño_borde_enlace"]');
const color_enlace = document.getElementById('color_enlace');
const color_fondo_enlace = document.getElementById('color_fondo_enlace');
const enlaces = document.querySelectorAll('.enlace'); // Seleccionamos todos los enlaces con la clase "enlace"

bordes_enlace.forEach(borde => {
    borde.addEventListener('input', function () {
        enlaces.forEach(link => {
            link.style.borderRadius = borde.value;
        });
    });
    document.cookie = "enlace_border_radius=" + encodeURIComponent(borde.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

});

color_enlace.addEventListener('input', function () {
    enlaces.forEach(link => {
        link.style.color = color_enlace.value; // Cambiar el color del texto en todos los enlaces
        document.cookie = "enlace_color=" + encodeURIComponent(color_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"

    });
});

color_fondo_enlace.addEventListener('input', function () {
    enlaces.forEach(link => {
        link.style.backgroundColor = color_fondo_enlace.value; // Cambiar el color de fondo en todos los enlaces
        document.cookie = "enlace_background=" + encodeURIComponent(color_fondo_enlace.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
    });
});


const radius = document.querySelectorAll('input[name="tamaño_borde_radius"]');

radius.forEach(radiu => {
    radiu.addEventListener('input', function () {
        imgs.forEach(img => {
            img.style.borderRadius = radiu.value;
            document.cookie = "img_radius=" + encodeURIComponent(radiu.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
        });
    });
});

const sombras = document.getElementById('color_sombra');

sombras.addEventListener('change', function () {
    imgs.forEach(img => {
        img.style.boxShadow = sombras.value;
        document.cookie = "sombra=" + encodeURIComponent(sombras.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
    })
});

const color_texto = document.getElementById("color_texto");
color_texto.addEventListener('input', function () {
    body.style.color = color_texto.value;
    document.cookie = "body_color=" + encodeURIComponent(color_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
});

color_fondo_texto.addEventListener('input', function () {
    const textos = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span');
    textos.forEach(function (texto) {
        texto.style.backgroundColor = color_fondo_texto.value;
        document.cookie = "texto_background=" + encodeURIComponent(color_fondo_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
    });
});

const tamaño_texto = document.getElementById('tamaño_texto');
const rango_valor = document.getElementById('rango_valor');

tamaño_texto.addEventListener("input", function () {
    const px = tamaño_texto.value + 'px';
    rango_valor.textContent = tamaño_texto.value;
    body.style.fontSize = px;
    document.cookie = "bondy_font_size=" + encodeURIComponent(tamaño_texto.value) + "; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/"
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
