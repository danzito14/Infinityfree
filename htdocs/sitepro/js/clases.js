class CargarCookiesAlIniciar {
    constructor() {
        // Cargar cookies al iniciar
        console.log("Clase cargada. Cargando cookies...");

        // Cargar cookies de los estilos
        this.cargarEstilosCookies();
    }

    // Función para obtener una cookie por su nombre
    obtenerCookie(nombre) {
        const nombreEQ = nombre + "=";
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            let c = cookies[i].trim();
            if (c.indexOf(nombreEQ) === 0) {
                return decodeURIComponent(c.substring(nombreEQ.length));
            }
            console.log(cookies);
        }
        return null;
    }

    // Función para cargar los estilos desde las cookies
    cargarEstilosCookies() {
        // Cargar cookies específicas de estilo
        const colorFondo = this.obtenerCookie("bondy_backgroundcolor");
        const colorheader = this.obtenerCookie("header_backgroundcolor");
        const colorfooter = this.obtenerCookie("footer_backgroundcolor");

        const tamañoFuente = this.obtenerCookie("bondy_font_size");

        if (colorFondo) {
            document.body.style.backgroundColor = colorFondo;
            document.querySelector('main').style.backgroundColor = colorFondo;

        } if (colorheader) {
            document.getElementById('side_bar').style.backgroundColor = colorheader;
            document.querySelector('header').style.backgroundColor = colorheader;

        }
        if (colorfooter) {
            document.querySelector('footer').style.backgroundColor = colorfooter;

        }

        if (tamañoFuente) {
            document.body.style.fontSize = tamañoFuente + 'px';
        }

        const colorTexto = this.obtenerCookie("body_color");
        if (colorTexto) {
            document.body.style.color = colorTexto;
        }

        const colorFondoTexto = this.obtenerCookie("texto_background");
        if (colorFondoTexto) {
            document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span').forEach(texto => {
                texto.style.backgroundColor = colorFondoTexto;
            });
        }

        const tamañoImagen = this.obtenerCookie("img_witdth");
        if (tamañoImagen) {
            document.querySelectorAll("img").forEach(img => {
                img.style.width = tamañoImagen;
            });
        }

        const bordeImagenColor = this.obtenerCookie("img_border_color");
        const bordeImagenTamaño = this.obtenerCookie("img_border_width");
        if (bordeImagenColor && bordeImagenTamaño) {
            document.querySelectorAll("img").forEach(img => {
                img.style.borderColor = bordeImagenColor;
                img.style.borderWidth = bordeImagenTamaño;
                img.style.borderStyle = "solid";
            });
        }

        const bordeRadioImagen = this.obtenerCookie("img_radius");
        if (bordeRadioImagen) {
            document.querySelectorAll("img").forEach(img => {
                img.style.borderRadius = bordeRadioImagen;
            });
        }

        const sombraImagen = this.obtenerCookie("sombra");
        if (sombraImagen) {
            document.querySelectorAll("img").forEach(img => {
                img.style.boxShadow = sombraImagen;
            });
        }

        const colorEnlace = this.obtenerCookie("enlace_color");
        if (colorEnlace) {
            document.querySelectorAll(".enlace").forEach(link => {
                link.style.color = colorEnlace;
            });
        }

        const fondoEnlace = this.obtenerCookie("enlace_background");
        if (fondoEnlace) {
            document.querySelectorAll(".enlace").forEach(link => {
                link.style.backgroundColor = fondoEnlace;
            });
        }

        const radioBordeEnlace = this.obtenerCookie("enlace_border_radius");
        if (radioBordeEnlace) {
            document.querySelectorAll(".enlace").forEach(link => {
                link.style.borderRadius = radioBordeEnlace;
            });
        }
    }
}