// Función para abrir y cerrar el menú lateral

window.onload = cargardatos;

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

// CIERRE DE SESIÓN
document.addEventListener('DOMContentLoaded', function () {
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    btnCerrarSesion.addEventListener('click', function () {
        const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmacion) {
            // Aquí puedes redirigir a la página de inicio de sesión o hacer cualquier otra acción necesaria
            window.location.href = '../html/login.html'; // Ajusta la URL según corresponda
        }
    });

});

function cargardatos() {
    fetch("../php/cargar_productos.php") // Verifica la ruta correcta
        .then(response => response.json()) // Convertimos en JSON
        .then(data => {
            let datos = document.getElementById("productos");
            datos.innerHTML = ""; // Limpiar contenido previo

            data.forEach(dato => {
                let fila = `
                    <div class="product">
                    <img src="${dato.direccion_foto}" alt="Placa mascota">
                    <p>${dato.nombre}</p>
                    <p class="price">$${dato.precio_venta}</p>
                    <button>Agregar al carrito</button>
                 </div>
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
                        <p>${producto.nombre}</p>
                        <p class="price">${producto.precio_venta}</p>
                        <button>Agregar al carrito</button>
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
                            <p>${producto.nombre}</p>
                            <p class="price">${producto.precio_venta}</p>
                            <button>Agregar al carrito</button>
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