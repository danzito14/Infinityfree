class Sidebar {
    static cargarSidebar() {
        fetch('../php/sesion.php')
            .then(res => res.json())
            .then(data => {
                if (data.logueado) {
                    let sidebar = `
            <div class="user-info">
                <img src="../gallery/GPDog Logos/svg/Puro Logo.svg" alt="Usuario">
                <span><strong>${data.username}</strong></span>
            </div>
            <ul>
                <li id="btnInicio"><img src="../gallery/GPDog Logos/svg/Puro Logo.svg" alt=""> Inicio</li>
                <li id="btnRastrear"><img src="../gallery/GPDog Logos/svg/Rastrear_mascota_icon.svg" alt=""> Rastrear mascota</li>
                <li id="btnCarrito"><img src="../gallery/GPDog Logos/svg/Carro.svg" alt=""> Ver carrito de compras</li>
                <li id="btnProductos"><img src="../gallery/GPDog Logos/svg/Productos.svg" alt=""> Productos</li>
                <li id="btnPerfil"><img src="../gallery/GPDog Logos/svg/perfil.svg" alt=""> Perfil</li>
                <li id="btnConfig"><img src="../gallery/GPDog Logos/svg/config.svg" alt=""> Configuración</li>
                <li id="btnCerrarSesion"><img src="../gallery/GPDog Logos/svg/sesion.svg" alt=""> Cerrar sesión</li>
                <li id="btnContacto"><img src="../gallery/GPDog Logos/svg/contacto.svg" alt=""> Contáctanos</li>
            </ul>
        `;
                    const nav_sidebar = document.querySelector(".sidebar-menu");
                    nav_sidebar.innerHTML = sidebar;
                }
            }
            )
    }

}

export default Sidebar;
