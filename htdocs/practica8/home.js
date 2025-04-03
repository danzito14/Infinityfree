let nombreusuariologeado = '';
let nombrelogeado = '';
let nombredelacookie = "";



document.addEventListener("DOMContentLoaded", () => {
    // Recuperar el nombre de la cookie desde el almacenamiento local
    nombredelacookie = localStorage.getItem('nombredelacookie');

    if (nombredelacookie) {
        let nombredelacookie2 = "estilo_" + nombredelacookie
        const cargarCookies = new CargarCookiesAlIniciar(nombredelacookie2);
        cargarCookies.cargarEstilosCookies(nombredelacookie2);

        // Mostrar el nombre del usuario cargado
        console.log("Nombre de la cookie cargado:", nombredelacookie);

        verificarUsuarioLogeado(nombredelacookie);
    } else {
        console.warn("No se encontró el nombre de la cookie.");
    }
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
document.addEventListener('DOMContentLoaded', function () {
    const btnConfig = document.getElementById('btnConfig');

    btnConfig.addEventListener('click', function () {
        window.location.href = 'config.html';

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
                cerrarSesion(nombreusuariologeado, nombredelacookie);
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

// Llamar a la función al ca

function cerrarSesion(nombreusuariologeado, nombredelacookie) {

    const datos_cookies = obtenerTodasLasCookies();
    Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {

        if (nombredelacookie === nombreCookie) { // Verifica que el nombre siga el patrón "datos_usuarioX"


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
        }
    });
}


//Para funcionar el carrito en el home
document.addEventListener('DOMContentLoaded', () => {
    const botones = document.querySelectorAll('.add-to-cart');

    botones.forEach(boton => {
        boton.addEventListener('click', () => {

            // Extraer datos del producto del botón
            const nombre = boton.dataset.name;
            const precio = parseFloat(boton.dataset.price);
            const imagen = boton.dataset.image;

            // Obtener el carrito desde localStorage (o crear uno nuevo)
            let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

            // Verificar si el producto ya está en el carrito
            const index = carrito.findIndex(p => p.nombre === nombre);
            if (index >= 0) {
                carrito[index].cantidad += 1;
            } else {
                carrito.push({ nombre, precio, imagen, cantidad: 1 });
            }

            // Guardar el carrito actualizado en localStorage
            localStorage.setItem('carrito', JSON.stringify(carrito));
            Swal.fire({
                title: "Producto enviado al carrito",
                text: "Para ver más detalles vara a su Carrito",
                icon: "success"
            });
        });
    });
});


//para que se agregue al carrito en el carrito.html
//para que se agregue al carrito en el carrito.html
document.addEventListener('DOMContentLoaded', () => {
    // Verifica si estás en la página del carrito
    if (document.querySelector('.cart-section')) {
        const cartGroup = document.querySelector('.cart-group');
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

        cartGroup.innerHTML = '<h2 class="group-title">Productos</h2>';

        // Si el carrito está vacío, muestra un mensaje
        if (carrito.length === 0) {
            cartGroup.innerHTML += '<p>No has agregado productos al carrito.</p>';
        } else {
            // Variables para total y conteo de productos
            let total = 0;
            let totalProductos = 0;

            // Generar el HTML para cada producto
            carrito.forEach(producto => {
                // Sumar al total
                total += producto.precio * producto.cantidad;
                totalProductos += producto.cantidad;

                cartGroup.innerHTML += `
                    <div class="cart-product">
                        <img class="product-img" src="${producto.imagen}" alt="${producto.nombre}">
                        <div class="product-info">
                            <h4>${producto.nombre}</h4>
                            <div class="product-actions">
                                <button class="btn-link eliminar" data-nombre="${producto.nombre}">Eliminar</button>
                                <button class="btn-link">Guardar</button>
                                <button class="btn-link">Comprar ahora</button>
                            </div>
                        </div>
                        <div class="product-controls">
                            <div class="qty-container">
                                <button class="qty-btn minus" data-nombre="${producto.nombre}">-</button>
                                <span class="quantity">${producto.cantidad}</span>
                                <button class="qty-btn plus" data-nombre="${producto.nombre}">+</button>
                            </div>
                            <p class="price">$${producto.precio * producto.cantidad}</p>
                        </div>
                    </div>
                `;
            });

            // Actualizar los valores del resumen
            // (product-count, total-price, total-price2)
            const productCountEl = document.querySelector('.product-count');
            const totalPriceEls = document.querySelectorAll('.total-price, .total-price2');

            if (productCountEl) {
                productCountEl.textContent = `Productos (${totalProductos})`;
            }
            totalPriceEls.forEach(el => {
                el.textContent = `$${total.toFixed(2)}`;
            });

            // ----------------------------
            // Eventos de eliminar, sumar y restar
            // ----------------------------

            // Eliminar producto
            const botonesEliminar = document.querySelectorAll('.btn-link.eliminar');
            botonesEliminar.forEach(btn => {
                btn.addEventListener('click', () => {
                    const nombre = btn.dataset.nombre;
                    carrito = carrito.filter(item => item.nombre !== nombre);
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    location.reload();
                });
            });

            // Aumentar cantidad
            const btnsPlus = document.querySelectorAll('.qty-btn.plus');
            btnsPlus.forEach(btn => {
                btn.addEventListener('click', () => {
                    const nombre = btn.dataset.nombre;
                    carrito = carrito.map(item => {
                        if (item.nombre === nombre) {
                            item.cantidad++;
                        }
                        return item;
                    });
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    location.reload();
                });
            });

            // Disminuir cantidad (mínimo 1)
            const btnsMinus = document.querySelectorAll('.qty-btn.minus');
            btnsMinus.forEach(btn => {
                btn.addEventListener('click', () => {
                    const nombre = btn.dataset.nombre;
                    carrito = carrito.map(item => {
                        if (item.nombre === nombre && item.cantidad > 1) {
                            item.cantidad--;
                        }
                        return item;
                    });
                    localStorage.setItem('carrito', JSON.stringify(carrito));
                    location.reload();
                });
            });
        }
    }
});