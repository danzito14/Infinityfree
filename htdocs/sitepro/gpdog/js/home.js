const ver_sesion = new Verificar_Inicio_de_Sesion();

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


let productos = []; //Array donde vamos a guardar los datos
let pagina_actual = 1;
const productos_por_pagina = 6;

function cargardatos() {
    let url = `../php/cargar_productos.php?accion=cargarproductos`;

    fetch(url) // Verifica la ruta correcta
        .then(response => response.json()) // Convertimos en JSON
        .then(data => {
            productos = data; //pasamos el json que tiene los datos al array productos
            pagina_actual = 1;
            mostrar_productos();
            crear_paginacion();
        })
        .catch(error => console.error("Error al cargar datos:", error));
}


function mostrar_productos() {
    let datos = document.getElementById("productos");
    datos.innerHTML = ""; // Limpiar contenido previo

    let inicio = (pagina_actual - 1) * productos_por_pagina;
    let fin = inicio + productos_por_pagina;
    //slice es una funcion que copea los datos de un array
    // pero solo del rango que le indiquemos, si le ponemos array.slice(1,3)
    // y el array contiene [1,2,3,4,5], el slice copeara de la posicion 1 a la 3
    // por lo que si imprimimos ese slice nos dara [2,3,4]
    let productos_en_pagina = productos.slice(inicio, fin);

    productos_en_pagina.forEach(dato => {
        let fila = `
                <div class="product" data-id="${dato.id_producto}">
                    <img src="${dato.direccion_foto}" alt="Placa mascota">
                    <p id="nombre_producto">${dato.nombre}</p>
                    <p class="price">$${dato.precio_venta}</p>
                    <button type="submit" id="agregar_al_carrito">Agregar al carrito</button>
                </div>
                `;
        datos.innerHTML += fila; // Agregar la fila al contenedor
    });
}

function crear_paginacion() {
    const paginacion = document.getElementById("paginacion");
    paginacion.innerHTML = ""; //Limpiamos el html para que  no se carguen los datos

    let totalPaginas = Math.ceil(productos.length / productos_por_pagina);

    //Borramos la pagina anterior
    if (pagina_actual > 1) {
        paginacion.innerHTML += `<button onclick="cambiarPagina(${pagina_actual - 1})">Anterior</button>`;

    }
    //Botones numericos
    for (let i = 1; i <= totalPaginas; i++) {
        paginacion.innerHTML += `<button onclick="cambiarPagina(${i})">${i}</button>`;
    }
}

window.cambiarPagina = function cambiarPagina(pagina) {
    pagina_actual = pagina;
    mostrar_productos();
    crear_Paginacion();
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


window.enviarclase = function enviarclase(valor) {
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
                    <div class="product" data-id="${producto.id_producto}>
                        <input type="hidden" id="id_producto" name="id_producto" value="${producto.id_producto}">
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
} document.addEventListener('DOMContentLoaded', () => {
    const contenedor = document.getElementById("productos");

    contenedor.addEventListener("click", (e) => {
        const producto = e.target.closest(".product");

        if (e.target.tagName === "BUTTON" && e.target.id === "agregar_al_carrito") {
            if (producto) {
                let id_producto = producto.getAttribute("data-id");
                agregar_al_carrito(id_producto);
            }
        } else {
            if (producto && !e.target.closest("button")) {
                let id_producto = producto.getAttribute("data-id");
                seleccionarId_producto(id_producto);
            }
        }
    });
});


function seleccionarId_producto(id) {
    sessionStorage.setItem('id_producto_seleccionado', id);
    window.location.href = 'producto_informacion.html'; // te vas a la otra página
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
                        <div class="product" data-id="${producto.id_producto}>
                            <input type="hidden" id="id_producto" name="id_producto" value="${producto.id_producto}">
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
                        <div class="product" data-id="${producto.id_producto}>
                            <input type="hidden" id="id_producto" name="id_producto" value="${producto.id_producto}">
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
async function agregar_al_carrito(id_producto) {
    try {
        const res = await fetch('../php/sesion.php');
        const data = await res.json();

        if (!data.logueado) {
            alert("Debes iniciar sesión primero");
            return;
        }

        const user_id = data.user_id;
        console.log("usuario", user_id);

        const formData = new FormData();
        formData.append("id_producto", id_producto);
        formData.append("id_usuario", user_id);
        formData.append("action", 'agregar_al_carrito');

        const response = await fetch("../php/carrito.php", {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            Swal.fire({
                title: "Producto enviado al carrito",
                text: "Se ha agregado a tu carrito de compras, si quieres puedes ir a verlo ya.",
                icon: "success",
                showCancelButton: true,
                cancelButtonText: "Ver más productos",
                confirmButtonColor: "#A6762A",
                cancelButtonColor: "#004080",
                confirmButtonText: "Ir a mi carrito"
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = "../html/carrito.html";
                }
            });
        } else {

        }
    } catch (err) {
        console.error('Error:', err);
        alert('Ocurrió un error al conectar con el servidor.');
    }
}
