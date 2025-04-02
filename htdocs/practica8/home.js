let nombreusuariologeado = '';
let nombrelogeado = '';
document.addEventListener('DOMContentLoaded', function () {
    verificarusuariologeado();

});


document.addEventListener("DOMContentLoaded", () => {
    const cargarCookies = new CargarCookiesAlIniciar();
    cargarCookies.cargarEstilosCookies();
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


// Función para filtrar productos
document.addEventListener('DOMContentLoaded', function () {
    const filterButton = document.querySelector('.filter-button');
    const priceMinInput = document.querySelector('input[placeholder="Mínimo"]');
    const priceMaxInput = document.querySelector('input[placeholder="Máximo"]');
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const products = document.querySelectorAll('.product');

    filterButton.addEventListener('click', function () {
        const minPrice = parseFloat(priceMinInput.value) || 0;
        const maxPrice = parseFloat(priceMaxInput.value) || Infinity;
        const selectedCategory = Array.from(categoryInputs).find(input => input.checked)?.value;

        products.forEach(product => {
            const productPrice = parseFloat(product.querySelector('.price').textContent.replace('$', '').replace(' MXN', ''));
            const productCategory = product.querySelector('p').textContent.toLowerCase();

            const priceInRange = productPrice >= minPrice && productPrice <= maxPrice;
            const categoryMatch = !selectedCategory || productCategory.includes(selectedCategory.toLowerCase());

            if (priceInRange && categoryMatch) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
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
//CONTACTO
document.addEventListener('DOMContentLoaded', function () {
    const btnContacto = document.getElementById('btnContacto');

    btnContacto.addEventListener('click', function () {
        window.location.href = 'contacto.html';

    });
});
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
});

function verificarUsuarioLogeado() {
    const datos_cookies = obtenerTodasLasCookies();

    // Filtramos solo las cookies que cumplen con el formato "datos_usuarioX"
    Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {
        if (/^datos_usuario\d+$/.test(nombreCookie)) { // Verifica que el nombre siga el patrón "datos_usuarioX"
            try {
                // Parseamos el valor JSON de la cookie
                const datosUsuario = JSON.parse(valorCookie);

                // Comprobamos si el usuario está logeado
                if (datosUsuario.logeado === "true") {
                    nombreusuariologeado = datosUsuario.nombre;
                    nombrelogeado = datosUsuario.usuario;
                    let resultadosDiv = document.getElementById('nombreusuariologeado');
                    if (resultadosDiv) {
                        let datosContacto = `
                            <span><strong>${datosUsuario.nombre}</strong></span>
                        `;
                        resultadosDiv.innerHTML = datosContacto;
                    }
                } else {
                    window.location.href = "login.html";
                }
            } catch (error) {
                console.error("Error al procesar la cookie:", nombreCookie, error);
            }
        }
    });
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
