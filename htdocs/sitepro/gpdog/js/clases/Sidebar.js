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
                        <li id="btnInicio"><img src="../gallery/GPDog Logos/svg/Puro Logo.svg" alt="" > Inicio</li>
                        <li id="btnRastrear"><img src="../gallery/GPDog Logos/svg/Rastrear_mascota_icon.svg" alt=""> Rastrear mascota</li>
                        <li id="btnCarrito"><img src="../gallery/GPDog Logos/svg/Carro.svg" alt=""> Ver carrito de compras</li>
                        <li id="btnAdministracion"><img src="../gallery/GPDog Logos/svg/archivos.svg" alt=""> Archivos</li>
                        <li id="btnPerfil"><img src="../gallery/GPDog Logos/svg/perfil.svg" alt=""> Perfil</li>
                        <li id="btnConfig"><img src="../gallery/GPDog Logos/svg/config.svg" alt=""> Configuración</li>
                        <li id="btnCerrarSesion"><img src="../gallery/GPDog Logos/svg/sesion.svg" alt=""> Cerrar sesión</li>
                        <li id="btnContacto"><img src="../gallery/GPDog Logos/svg/contacto.svg" alt=""> Contáctanos</li>
                    </ul>
                `;
                    const nav_sidebar = document.querySelector(".sidebar-menu");
                    nav_sidebar.innerHTML = sidebar;

                    if (data.nvl_usuario == 2) {
                        document.getElementById("btnAdministracion").style.display = "none";
                    }

                    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
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
                        console.warn("btnCerrarSesion no encontrado (dentro de Sidebar).");
                    }

                    const btnInicio = document.getElementById('btnInicio');
                    if (btnInicio) {
                        btnInicio.addEventListener('click', () => {
                            window.location.href = '../html/home.html';
                        });
                    } else {
                        console.warn("btnInicio no encontrado (dentro de Sidebar).");
                    }
                }
            });
    }

}

export default Sidebar;
