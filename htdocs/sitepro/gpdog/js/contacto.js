
//CONTACTO

document.addEventListener('DOMContentLoaded', function (event) {

    const btnEnviarqueja = document.getElementById('enviarqueja');
    const nombrequeja = document.getElementById('Nombrequeja');
    const emailqueja = document.getElementById('emailqueja');
    const queja = document.getElementById('queja');

    btnEnviarqueja.addEventListener('click', function (event) {
        // Evitar el comportamiento predeterminado del formulario
        event.preventDefault();

        let resultadosDiv = document.getElementById('datos_enviados');


        let datoscontacto = `
            <h2>${nombrequeja.value}</h2>
            <h3>${emailqueja.value}</h2>
            <h3>${queja.value}</h2>
        `;
        resultadosDiv.innerHTML = datoscontacto;
    });


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

function verificarUsuarioLogeado(nombredelacookie) {
    const datos_cookies = obtenerTodasLasCookies();
    let usuarioEncontrado = false;
    Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {
        const regex = new RegExp(`^${nombredelacookie}\d+$`);
        if (nombredelacookie === nombreCookie) { // Verifica que el nombre siga el patrón "datos_usuarioX"
            try {

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