const ver_sesion = new Verificar_Inicio_de_Sesion();
import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    ver_sesion.ver_sesion_actual("usuario");
    Sidebar.cargarSidebar();
    setTimeout(() => {

        const menuBtn = document.querySelector('.menu-btn');
        const sidebarMenu = document.querySelector('.sidebar-menu');
        const closeMenuBtn = document.querySelector('.close-menu');
        const btnCerrarSesion = document.getElementById('btnCerrarSesion');

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

        if (btnCerrarSesion) {
            btnCerrarSesion.addEventListener('click', () => {
                alert("Cerrando sesión...");
                const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
                if (confirmacion) {
                    fetch('../php/cerrar_sesion.php')
                        .then(res => res.json())
                        .then(data => {
                            if (data.logueado === false) {
                                window.location.href = '../html/login.html';
                            }
                        })
                        .catch(err => console.error('Error cerrando sesión:', err));
                }
            });
        } else {
            console.warn("btnCerrarSesion no encontrado.");
        }

    }, 0);

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

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.cart-section')) {
        const cartGroup = document.querySelector('.cart-group'); // ✅ Declarar aquí

        if (cartGroup) {
            // 🔁 Delegación de eventos (mejor rendimiento)
            cartGroup.addEventListener('click', (e) => {
                const btn = e.target;
                const productoDiv = btn.closest('.cart-product');
                if (!productoDiv) return;
                const id_producto = productoDiv.getAttribute('data-id');

                if (btn.matches('.btn-link.eliminar')) {
                    eliminar_carrito(id_producto);
                }

                if (btn.matches('.btn-link.comprar')) {
                    comprar_ahora(id_producto);
                }

                if (btn.matches('.qty-btn.plus')) {
                    sumar_carrito(id_producto);
                }

                if (btn.matches('.qty-btn.minus')) {
                    restar_carrito(id_producto);
                }
            });
        }

        cargar_carrito(); // Esto puede ir fuera del if(cartGroup) si estás seguro de que existe
    }
});
window.id_usuario = "";
window.carrito_cargado = false;
async function cargar_carrito() {
    const cartGroup = document.querySelector('.cart-group');

    fetch('../php/sesion.php')
        .then(res => res.json())
        .then(data => {
            if (data.logueado) {
                const user_id = data.user_id;
                window.id_usuario = user_id;
                const formData = new FormData();
                formData.append('action', 'cargar_carrito');
                formData.append('id_usuario', user_id);

                fetch('../php/carrito.php', {
                    method: 'POST',
                    body: formData
                })
                    .then(response => response.text())
                    .then(texto => {
                        try {
                            const data = JSON.parse(texto);
                            const carrito = data.carrito;
                            cartGroup.innerHTML = "";
                            cartGroup.innerHTML = '<h2 class="group-title">Productos</h2>';

                            if (carrito.length === 0) {
                                cartGroup.innerHTML += '<p>No has agregado productos al carrito.</p>';
                                window.carrito_cargado = false;
                            } else {
                                let total = 0;
                                let totalProductos = 0;

                                carrito.forEach(producto => {
                                    total += producto.Precio * producto.Cantidad;
                                    totalProductos += parseInt(producto.Cantidad);

                                    cartGroup.innerHTML += `
                                            <div class="cart-product" data-id="${producto.id_producto}">
                                                <img class="product-img" src="${producto.direccion_foto}" alt="${producto.Producto}">
                                                <div class="product-info">
                                                    <h4>${producto.Producto}</h4>
                                                    <div class="product-actions">
                                                        <button class="btn-link eliminar" data-nombre="${producto.Producto}">Eliminar</button>
                                                        <button class="btn-link comprar">Comprar ahora</button>
                                                    </div>
                                                </div>
                                                <div class="product-controls">
                                                    <div class="qty-container">
                                                        <button class="qty-btn minus" data-nombre="${producto.Producto}">-</button>
                                                        <span class="quantity">${producto.Cantidad}</span>
                                                        <button class="qty-btn plus" data-nombre="${producto.Producto}">+</button>
                                                    </div>
                                                    <p class="price">$${(producto.Precio * producto.Cantidad).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        `;
                                    window.carrito_cargado = true;
                                });

                                // Actualizar resumen
                                const productCountEl = document.querySelector('.product-count');
                                const totalPriceEls = document.querySelectorAll('.total-price, .total-price2');

                                if (productCountEl) {
                                    productCountEl.textContent = `Productos (${totalProductos})`;
                                }

                                totalPriceEls.forEach(el => {
                                    el.textContent = `$${total.toFixed(2)}`;
                                });


                            }
                        } catch (e) {
                            console.error('Error al parsear JSON:', e, texto);
                        }
                    });
            }
        });
}

async function sumar_carrito(id_producto) {
    try {
        const res = await fetch('../php/sesion.php');
        const data = await res.json();

        if (!data.logueado) {
            alert("Debes iniciar sesión primero");
            return;
        }

        const user_id = data.user_id;
        const formData = new FormData();
        formData.append("id_producto", id_producto);
        formData.append("id_usuario", user_id);
        formData.append("action", 'sumar_carrito');

        const response = await fetch("../php/carrito.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            cargar_carrito();

        } else {
            alert("No se pudo agregar el producto al carrito." + result.error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

async function restar_carrito(id_producto) {
    try {
        const res = await fetch('../php/sesion.php');
        const data = await res.json();

        if (!data.logueado) {
            alert("Debes iniciar sesión primero");
            return;
        }

        const user_id = data.user_id;
        const formData = new FormData();
        formData.append("id_producto", id_producto);
        formData.append("id_usuario", user_id);
        formData.append("action", 'restar_carrito');

        const response = await fetch("../php/carrito.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            cargar_carrito();


        } else {
            alert("No se pudo agregar el producto al carrito." + result.error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

async function comprar_ahora(id_producto) {
    try {


        const formdata = new FormData();
        formdata.append("id_usuario", window.id_usuario);
        formdata.append("id_producto", id_producto);
        formdata.append("action", "comprar_ahora");

        const response = await fetch("../php/comprar.php", {
            method: 'POST',
            body: formdata
        });

        const result = await response.json();

        if (result.success) {
            cargar_carrito();
            Swal.fire({
                title: "LISTO",
                text: "Sus productos le llegaran hasta su casa",
                icon: "success",
                showCancelButton: true,
                cancelButtonText: "Entendido",
                confirmButtonColor: "#A6762A",
                cancelButtonColor: "#004080",
                confirmButtonText: "Ir a productos"
            }).then((result) => {
                if (result.isConfirmed) {

                } else {
                    window.location.href = "../html/home.html";
                }
            });

        } else {
            alert("No se pudo efectuar la compra");
        }
    }
    catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}

async function eliminar_carrito(id_producto) {
    try {
        const res = await fetch('../php/sesion.php');
        const data = await res.json();

        if (!data.logueado) {
            alert("Debes iniciar sesión primero");
            return;
        }

        const user_id = data.user_id;
        const formData = new FormData();
        formData.append("id_producto", id_producto);
        formData.append("id_usuario", user_id);
        formData.append("action", 'eliminar_carrito');

        const response = await fetch("../php/carrito.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            cargar_carrito();

        } else {
            alert("No se pudo agregar el producto al carrito." + result.error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
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

document.addEventListener("DOMContentLoaded", function () {
    document.querySelector("#boton_comprar").addEventListener("click", async function () {
        if (!window.carrito_cargado) {
            Swal.fire({
                title: "No tiene nada agregado",
                text: "No tiene nada agregado a su carrito aún, si quiere comprar agrege cosas a su carrito.",
                icon: "warning",
                showCancelButton: true,
                cancelButtonText: "Ir a productos",
                confirmButtonColor: "#A6762A",
                cancelButtonColor: "#004080",
                confirmButtonText: "Entendido"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../html/home.html";
                }
            });
        } else {
            try {


                const formdata = new FormData();
                formdata.append("id_usuario", window.id_usuario);
                formdata.append("action", "comprar");

                const response = await fetch("../php/comprar.php", {
                    method: 'POST',
                    body: formdata
                });

                const result = await response.json();

                if (result.success) {
                    cargar_carrito();
                    Swal.fire({
                        title: "LISTO",
                        text: "Sus productos le llegaran hasta su casa",
                        icon: "success",
                        showCancelButton: true,
                        cancelButtonText: "Entendido",
                        confirmButtonColor: "#A6762A",
                        cancelButtonColor: "#004080",
                        confirmButtonText: "Ir a productos"
                    }).then((result) => {
                        if (result.isConfirmed) {

                        } else {
                            window.location.href = "../html/home.html";
                        }
                    });

                } else {
                    alert("No se pudo efectuar la compra");
                }
            }
            catch (err) {
                console.error('Error:', err);
                alert('Ocurrió un error al conectar con el servidor.');
            }
        }
    });
});