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