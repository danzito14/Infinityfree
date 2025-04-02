// Función para abrir y cerrar el menú lateral
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.menu-btn');
    const sidebarMenu = document.querySelector('.sidebar-menu');
    const closeMenuBtn = document.querySelector('.close-menu');

    menuBtn.addEventListener('click', function() {
        sidebarMenu.classList.toggle('active');
    });

    closeMenuBtn.addEventListener('click', function() {
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
document.addEventListener('DOMContentLoaded', function() {
    const filterButton = document.querySelector('.filter-button');
    const priceMinInput = document.querySelector('input[placeholder="Mínimo"]');
    const priceMaxInput = document.querySelector('input[placeholder="Máximo"]');
    const categoryInputs = document.querySelectorAll('input[name="category"]');
    const products = document.querySelectorAll('.product');

    filterButton.addEventListener('click', function() {
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
document.addEventListener('DOMContentLoaded', function() {
    const btnInicio = document.getElementById('btnInicio');

    btnInicio.addEventListener('click', function() {
            window.location.href = 'home.html'; 
        
    });
}); 
//CARRITO
document.addEventListener('DOMContentLoaded', function() {
    const btnCarrito = document.getElementById('btnCarrito');

    btnCarrito.addEventListener('click', function() {
            window.location.href = 'carrito2.html'; 
        
    });
}); 
// CIERRE DE SESIÓN
document.addEventListener('DOMContentLoaded', function() {
    const btnCerrarSesion = document.getElementById('btnCerrarSesion');

    btnCerrarSesion.addEventListener('click', function() {
        const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
        if (confirmacion) {
            window.location.href = 'login.html'; 
        }
    });
});
//CONTACTO
document.addEventListener('DOMContentLoaded', function() {
    const btnContacto = document.getElementById('btnContacto');

    btnContacto.addEventListener('click', function() {
            window.location.href = 'contacto.html'; 
        
    });
}); 
//CONFIGURACION
document.addEventListener('DOMContentLoaded', function() {
    const btnConfig = document.getElementById('btnConfig');

    btnConfig.addEventListener('click', function() {
            window.location.href = 'config.html'; 
        
    });
}); 
//CONTACTO
document.addEventListener('DOMContentLoaded', function() {
    const btnContacto = document.getElementById('btnContacto');

    btnContacto.addEventListener('click', function() {
            window.location.href = 'contacto.html'; 
        
    });
}); 