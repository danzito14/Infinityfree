let nombreusuariologeado = '';
let nombrelogeado = '';
document.addEventListener('DOMContentLoaded', function () {
    verificarusuariologeado();

});
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
        const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmacion) {
            cerrarSesion(nombreusuariologeado);
            window.location.href = 'login.html';
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


function obtenerTodasLasCookies() {
    const cookies = document.cookie.split('; '); // Divide cada cookie
    let cookieObj = {};

    cookies.forEach(cookie => {
        let [nombre, valor] = cookie.split('='); // Divide en nombre y valor
        cookieObj[nombre.trim()] = decodeURIComponent(valor); // Decodifica valores y elimina espacios
    });

    return cookieObj;
}
// Función de validación de usuario y contraseña
function verificarusuariologeado() {
    const datos_cookies = obtenerTodasLasCookies();

    // Comprobamos si alguna de las cookies tiene las credenciales correctas
    Object.entries(datos_cookies).some(([nombreCookie, valorCookie]) => {
        try {
            // Parseamos el valor JSON de la cookie
            const datosUsuario = JSON.parse(valorCookie);

            // Comprobamos si el nombre de usuario y la contraseña coinciden
            if (datosUsuario.logeado === "true") {
                nombreusuariologeado = datosUsuario.nombre;
                nombrelogeado = datosUsuario.usuario;
                let resultadosDiv = document.getElementById('nombreusuarioloegado');
                let datoscontacto = `
                <span><strong>${datosUsuario.nombre}</strong></span>
            `;
                resultadosDiv.innerHTML = datoscontacto;
            } else {
                window.location.href = "login.html";
            }
        } catch (error) {
            // Si la cookie no tiene un formato válido, la ignoramos
            return false;
        }
    });

}


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
