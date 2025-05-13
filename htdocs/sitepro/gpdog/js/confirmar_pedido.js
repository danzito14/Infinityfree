import Sidebar from "./clases/Sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
    Sidebar.cargarSidebar();

    mostrarResumenPedido();

    document.getElementById('btn-confirmar-pedido').addEventListener('click', confirmarPedido);
});

function mostrarResumenPedido() {
    // Cargar datos del LocalStorage
    const metodoEntrega = localStorage.getItem('metodo_entrega');
    const direccionId = localStorage.getItem('direccion_seleccionada');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    document.getElementById('metodo-entrega').textContent = metodoEntrega === 'domicilio' ? 'Enviar a domicilio' : 'Retiro en punto de entrega';

    // Cargar dirección
    fetch('../php/cargar_una_direccion.php?id_direccion=' + direccionId)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                const dir = data.direccion;
                document.getElementById('direccion-envio').textContent = `${dir.calle}, ${dir.colonia}, ${dir.municipio}, ${dir.estado}, CP: ${dir.cp}`;
            } else {
                document.getElementById('direccion-envio').textContent = 'Error cargando dirección';
            }
        });

    // Cargar productos
    const productosLista = document.getElementById('productos-lista');
    let total = 0;
    carrito.forEach(producto => {
        const div = document.createElement('div');
        div.innerHTML = `${producto.nombre} x ${producto.cantidad} = $${producto.precio * producto.cantidad}`;
        productosLista.appendChild(div);

        total += producto.precio * producto.cantidad;
    });

    document.getElementById('total-final').textContent = `$${total.toFixed(2)}`;
}

function confirmarPedido() {
    const metodoEntrega = localStorage.getItem('metodo_entrega');
    const direccionId = localStorage.getItem('direccion_seleccionada');
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    const formData = new FormData();
    formData.append('metodo_entrega', metodoEntrega);
    formData.append('direccion_id', direccionId);
    formData.append('productos', JSON.stringify(carrito));

    fetch('../php/guardar_pedido.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: 'Pedido confirmado',
                text: 'Gracias por tu compra',
                icon: 'success',
                confirmButtonColor: "#a67c00"
            }).then(() => {
                // Limpiar carrito
                localStorage.removeItem('carrito');
                window.location.href = 'home.html';
            });
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al confirmar el pedido',
                icon: 'error',
                confirmButtonColor: "#a67c00"
            });
        }
    });
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

import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    cargar_categorias();
    cargardatos();
    const ver_sesion = new Verificar_Inicio_de_Sesion();
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