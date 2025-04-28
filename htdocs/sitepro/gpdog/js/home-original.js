const ver_sesion = new Verificar_Inicio_de_Sesion();

import Sidebar from "./clases/Sidebar.js";
document.addEventListener("DOMContentLoaded", () => {
    cargar_categorias();
    cargardatos();
    ver_sesion.ver_sesion_actual();
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


// Función para filtrar productos
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filter-button').addEventListener('click', function () {

        location.reload();
    });
});



function cargardatos() {
    let url = `../php/cargar_productos.php?accion=cargarproductos`;

    fetch(url) // Verifica la ruta correcta
        .then(response => response.json()) // Convertimos en JSON
        .then(data => {
            let datos = document.getElementById("productos");
            datos.innerHTML = ""; // Limpiar contenido previo

            data.forEach(dato => {
                let fila = `
                    <div class="product">
                    <img src="${dato.direccion_foto}" alt="Placa mascota">
                    <p id="nombre_producto">${dato.nombre}</p>
                    <p class="price">$${dato.precio_venta}</p>
                    <button type="submit"  id="agregar_al_carrito">Agregar al carrito</button>
                 </div>
                `;
                datos.innerHTML += fila; // Agregar la fila al contenedor

            });
        })
        .catch(error => console.error("Error al cargar datos:", error));
}


function cargar_categorias() {
    let url = `../php/cargar_productos.php?accion=cargarcategorias`;

    fetch(url) // Verifica la ruta correcta
        .then(response => response.json()) // Convertimos en JSON
        .then(data => {
            let datos = document.getElementById("categorias");
            datos.innerHTML = ""; // Limpiar contenido previo

            data.forEach(dato => {
                let fila = `
                    <li><input type="radio" name="category" onclick="enviarclase('${dato.id_tipo_producto}')"> ${dato.descripcion}</li>
                `;
                datos.innerHTML += fila; // Agregar la fila al contenedor
            });
        })
        .catch(error => console.error("Error al cargar datos:", error));
}


function enviarclase(valor) {
    const claseabuscar = document.getElementById('claseabuscar');
    claseabuscar.value = valor;

    buscarProductosporClase("clase", valor);
}


async function buscarProductosporClase(tipo, valor) {
    let url = `../php/buscarproductos.php?accion=clase&clase=${encodeURIComponent(valor)}`;

    try {
        const response = await fetch(url);
        const data = await response.json(); // Agregar await aquí

        let resultadosDiv = document.getElementById("productos");
        resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores

        if (data.length > 0) {
            data.forEach(producto => {
                let fila = `
                    <div class="product">
                        <img src="${producto.direccion_foto}" alt="Placa mascota">
                        <p id="nombre_producto">${producto.nombre}</p>
                        <p class="price">$${producto.precio_venta}</p>
                        <button type="submit"  id="agregar_al_carrito">Agregar al carrito</button>
                    </div>
                `;
                resultadosDiv.innerHTML += fila; // Usar resultadosDiv en lugar de datos
            });
        } else {
            resultadosDiv.innerHTML = "<p>No hay productos</p>"; // Corregir variable
        }
    } catch (e) {
        console.error("Error en la búsqueda de productos:", e);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form.buscarporprecio').addEventListener('submit', async (e) => {
        e.preventDefault();
        const precio_min = document.getElementById('precio_min').value.trim();
        const precio_max = document.getElementById('precio_max').value.trim();
        let url = `../php/buscarproductos.php?accion=buscarporprecio&preciomin=${encodeURIComponent(precio_min)}&preciomax=${encodeURIComponent(precio_max)}`;

        try {
            const response = await fetch(url);
            const data = await response.json(); // Agregar await aquí

            let resultadosDiv = document.getElementById("productos");
            resultadosDiv.innerHTML = ""; // Limpiar resultados previos

            if (data.length > 0) {
                data.forEach(producto => {
                    let fila = `
                        <div class="product">
                            <img src="${producto.direccion_foto}" alt="Placa mascota">
                            <p id="nombre_producto">${producto.nombre}</p>
                            <p class="price">$${producto.precio_venta}</p>
                            <button type="submit"  id="agregar_al_carrito">Agregar al carrito</button>
                        </div>
                    `;
                    resultadosDiv.innerHTML += fila; // Usar resultadosDiv en lugar de datos
                });
            } else {
                resultadosDiv.innerHTML = "<p>No hay productos</p>"; // Corregir variable
            }

        } catch (e) {
            console.error("Error en la búsqueda de productos:", e);
        }
    });
});

// Evento para búsqueda por texto
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('form.buscarplatillo').addEventListener('submit', async (e) => {
        e.preventDefault();
        const buscador = document.getElementById("buscador").value.trim();
        if (buscador === "") return;

        let url = `../php/buscarproductos.php?accion=buscarPorTexto&query=${encodeURIComponent(buscador)}`;

        try {
            const response = await fetch(url);
            const data = await response.json(); // Agregar await aquí

            let resultadosDiv = document.getElementById("productos");
            resultadosDiv.innerHTML = ""; // Limpiar resultados previos

            if (data.length > 0) {
                data.forEach(producto => {
                    let fila = `
                        <div class="product">
                            <img src="${producto.direccion_foto}" alt="Placa mascota">
                            <p id="nombre_producto">${producto.nombre}</p>
                            <p class="price">$${producto.precio_venta}</p>
                            <button type="submit"  id="agregar_al_carrito">Agregar al carrito</button>
                        </div>
                    `;
                    resultadosDiv.innerHTML += fila; // Usar resultadosDiv en lugar de datos
                });
            } else {
                resultadosDiv.innerHTML = "<p>No hay productos</p>"; // Corregir variable
            }

        } catch (e) {
            console.error("Error en la búsqueda de productos:", e);
        }
    });
});



