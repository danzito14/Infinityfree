import Sidebar from "./clases/Sidebar.js";

document.addEventListener("DOMContentLoaded", () => {
    const ver_sesion = new Verificar_Inicio_de_Sesion();
    ver_sesion.ver_sesion_actual("usuario");
    
    Sidebar.cargarSidebar();

    cargarDirecciones();
    cargarResumenCompra();

    const btnAgregarDireccion = document.getElementById('btn-agregar-direccion');
    const btnGuardarDireccion = document.getElementById('btn-guardar-direccion');
    const btnContinuar = document.getElementById('btn-continuar');

    // Botón Agregar nueva dirección
    btnAgregarDireccion.addEventListener('click', () => {
        document.getElementById('form-nueva-direccion').style.display = 'block';
        btnAgregarDireccion.style.display = 'none';
    });

    // Botón Guardar nueva dirección
    btnGuardarDireccion.addEventListener('click', guardarNuevaDireccion);

    // Botón Continuar
    btnContinuar.addEventListener('click', () => {
        const metodoEntrega = document.querySelector('input[name="entrega"]:checked').id;
        const direccionSeleccionada = document.querySelector('input[name="direccion"]:checked').value;

        if (!direccionSeleccionada) {
            Swal.fire({
                title: "Selecciona una dirección",
                icon: "warning",
                confirmButtonColor: "#a67c00"
            });
            return;
        }

        // Guardar datos de entrega en localStorage
        localStorage.setItem('metodo_entrega', metodoEntrega);
        localStorage.setItem('direccion_seleccionada', direccionSeleccionada);

        // Redirigir
        window.location.href = 'confirmar_pedido.html';
    });
});

// Función para cargar direcciones
function cargarDirecciones() {
    fetch('../php/cargar_direcciones.php')
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById('lista-direcciones');
            lista.innerHTML = '';

            if (data.success && data.direcciones.length > 0) {
                data.direcciones.forEach(direccion => {
                    const div = document.createElement('div');
                    div.classList.add('delivery-option');
                    div.innerHTML = `
                        <input type="radio" name="direccion" value="${direccion.id_direccion}">
                        <label>
                            ${direccion.calle}, ${direccion.colonia}, ${direccion.municipio}, ${direccion.estado}, CP: ${direccion.cp}<br>
                            <small>${direccion.instrucciones_adicionales || ''}</small>
                        </label>
                    `;
                    lista.appendChild(div);
                });
            } else {
                lista.innerHTML = "<p>No tienes direcciones registradas.</p>";
            }
        })
        .catch(error => {
            console.error('Error cargando direcciones:', error);
        });
}

// Función para guardar nueva dirección
function guardarNuevaDireccion() {
    const calle = document.getElementById('calle').value.trim();
    const colonia = document.getElementById('colonia').value.trim();
    const municipio = document.getElementById('municipio').value.trim();
    const estado = document.getElementById('estado').value.trim();
    const cp = document.getElementById('cp').value.trim();
    const instrucciones = document.getElementById('instrucciones_adicionales').value.trim();

    if (!calle || !colonia || !municipio || !estado || !cp) {
        Swal.fire({
            title: "Campos vacíos",
            text: "Completa todos los campos obligatorios",
            icon: "warning",
            confirmButtonColor: "#a67c00"
        });
        return;
    }

    const formData = new FormData();
    formData.append('calle', calle);
    formData.append('colonia', colonia);
    formData.append('municipio', municipio);
    formData.append('estado', estado);
    formData.append('cp', cp);
    formData.append('instrucciones_adicionales', instrucciones);

    fetch('../php/agregar_direccion.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            Swal.fire({
                title: "Dirección agregada",
                icon: "success",
                confirmButtonColor: "#a67c00"
            });

            document.getElementById('form-nueva-direccion').style.display = 'none';
            document.getElementById('btn-agregar-direccion').style.display = 'block';

            document.getElementById('calle').value = '';
            document.getElementById('colonia').value = '';
            document.getElementById('municipio').value = '';
            document.getElementById('estado').value = '';
            document.getElementById('cp').value = '';
            document.getElementById('instrucciones_adicionales').value = '';

            cargarDirecciones();
        } else {
            Swal.fire({
                title: "Error",
                text: "No se pudo guardar la dirección",
                icon: "error",
                confirmButtonColor: "#a67c00"
            });
        }
    })
    .catch(error => {
        console.error('Error guardando dirección:', error);
    });
}

// Función para cargar resumen de carrito
function cargarResumenCompra() {
    const carrito = JSON.parse(localStorage.getItem('carrito')) || [];

    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });

    document.getElementById('producto-total').textContent = `$${total.toFixed(2)}`;
    document.getElementById('pago-total').textContent = `$${total.toFixed(2)}`;
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
