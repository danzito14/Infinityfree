class CargarCookiesAlIniciar {
    constructor(nombredelacookie) {
        this.nombredelacookie = nombredelacookie;
        console.log("Clase cargada. Cargando cookies...");

        // Ahora solo cargas si quieres
        if (this.nombredelacookie) {
            this.cargarEstilosCookies(this.nombredelacookie);
        }
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
    cargarEstilosCookies(nombredelacookie) {
        // Cargar cookies específicas de estilo
        const colorFondo = this.obtenerCookie(nombredelacookie + "_bondy_backgroundcolor");
        const colorheader = this.obtenerCookie(nombredelacookie + "_header_backgroundcolor");
        const colorfooter = this.obtenerCookie(nombredelacookie + "_footer_backgroundcolor");

        const tamañoFuente = this.obtenerCookie(nombredelacookie + "_body_font_size");

        if (colorFondo) {
            document.body.style.backgroundColor = colorFondo;
            document.querySelector('main').style.backgroundColor = colorFondo;

        }
        if (colorheader) {
            document.querySelector('header').style.backgroundColor = colorheader;

        } else {

        }
        if (colorfooter) {
            document.querySelector('footer').style.backgroundColor = colorfooter;

        }

        if (tamañoFuente) {
            document.body.style.fontSize = tamañoFuente;
        }


        const colorFondoTexto = this.obtenerCookie(nombredelacookie + "_texto_background");
        if (colorFondoTexto) {
            document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span').forEach(texto => {
                texto.style.backgroundColor = colorFondoTexto;
            });
        }

        const colortexto = this.obtenerCookie(nombredelacookie + "_body_color");
        if (colortexto) {
            document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, label, span').forEach(texto => {
                texto.style.color = colortexto;
            });
        }

        const tamañoImagen = this.obtenerCookie(nombredelacookie + "_img_width");
        if (tamañoImagen) {
            document.querySelectorAll("img").forEach(img => {
                img.style.width = tamañoImagen + "%";
                img.style.height = tamañoImagen + "%";

            });
        }

        const bordeImagenColor = this.obtenerCookie(nombredelacookie + "_img_border_color");
        const bordeImagenTamaño = this.obtenerCookie(nombredelacookie + "_img_border_width");
        if (bordeImagenColor && bordeImagenTamaño) {
            document.querySelectorAll("img").forEach(img => {
                img.style.borderColor = bordeImagenColor;
                img.style.borderWidth = bordeImagenTamaño;
                img.style.borderStyle = "solid";
            });
        }

        const bordeRadioImagen = this.obtenerCookie(nombredelacookie + "_img_radius");
        if (bordeRadioImagen) {
            document.querySelectorAll("img").forEach(img => {
                img.style.borderRadius = bordeRadioImagen + "%";
            });
        }

        const sombraImagen = this.obtenerCookie(nombredelacookie + "_sombra");
        if (sombraImagen) {
            document.querySelectorAll("img").forEach(img => {
                img.style.boxShadow = sombraImagen;
            });
        }

        const colorEnlace = this.obtenerCookie(nombredelacookie + "_enlace_color");
        if (colorEnlace) {
            document.querySelectorAll(".enlace").forEach(link => {
                link.style.color = colorEnlace;
            });
        }

        const fondoEnlace = this.obtenerCookie(nombredelacookie + "_enlace_background");
        if (fondoEnlace) {
            document.querySelectorAll(".enlace").forEach(link => {
                link.style.backgroundColor = fondoEnlace;
            });
        }

        const radioBordeEnlace = this.obtenerCookie(nombredelacookie + "_enlace_border_radius");
        if (radioBordeEnlace) {
            document.querySelectorAll(".enlace").forEach(link => {
                link.style.borderRadius = radioBordeEnlace;
            });
        }
    }
}