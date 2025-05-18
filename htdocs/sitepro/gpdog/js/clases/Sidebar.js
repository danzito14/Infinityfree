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
                        <li id="btnAdministracion"><img src="../gallery/GPDog Logos/svg/archivos.svg" alt=""> Administración</li>
                        <li id="btnInbox"><img src="../gallery/GPDog Logos/svg/bandeja_entrada.svg" alt=""> Bandeja de entrada</li>
                        <li id="btnPerfil"><img src="../gallery/GPDog Logos/svg/perfil.svg" alt=""> Perfil</li>
                        <li id="btnConfig"><img src="../gallery/GPDog Logos/svg/config.svg" alt=""> Configuración</li>
                        <li id="btnContacto"><img src="../gallery/GPDog Logos/svg/contacto.svg" alt=""> Contáctanos</li>
                        <li id="btnCerrarSesion"><img src="../gallery/GPDog Logos/svg/sesion.svg" alt=""> Cerrar sesión</li>
                    </ul>
                `;
                    const nav_sidebar = document.querySelector(".sidebar-menu");
                    nav_sidebar.innerHTML = sidebar;

                    if (data.nvl_usuario == 2) {
                        document.getElementById("btnAdministracion").style.display = "none";
                        document.getElementById("btnInbox").style.display = "none";
                    }

                    const btnCerrarSesion = document.getElementById('btnCerrarSesion');
                    if (btnCerrarSesion) {
                        btnCerrarSesion.addEventListener('click', () => {
                            Swal.fire({
                                title: "¿Estás seguro de que quieres cerrar sesión?",
                                text: "Tendras que ingresar denuevo tus credenciales",
                                icon: "warning",
                                showCancelButton: true,
                                cancelButtonText: "No, mantener la sesión",
                                confirmButtonColor: "#A6762A",
                                cancelButtonColor: "#004080",
                                confirmButtonText: "Cerrar sesión"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    fetch('../php/cerrar_sesion.php')
                                        .then(res => res.json())
                                        .then(data => {
                                            if (data.logueado === false) {
                                                window.location.href = '../html/login.html';
                                            }
                                        })
                                        .catch(err => console.error('Error cerrando sesión:', err));
                                } else {
                                    window.location.href = "../html/home.html";
                                }
                            });
                            const confirmacion = confirm('¿Estás seguro de que quieres cerrar sesión?');
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

                    const btnRastrear = document.getElementById('btnRastrear');
                    if (btnRastrear) {
                        btnRastrear.addEventListener('click', () => {
                            Swal.fire({
                                text: "Lo sentimos, aun estamos trabajando en esa seccion",
                                icon: "info",
                                showCancelButton: true,
                                cancelButtonText: "Continuar navegando",
                                cancelButtonColor: "#004080"
                            })
                        });
                    } else {
                        console.warn("btnRastrear no encontrado (dentro de Sidebar).");
                    }

                    const btnCarrito = document.getElementById('btnCarrito');
                    if (btnCarrito) {
                        btnCarrito.addEventListener('click', () => {
                            window.location.href = '../html/carrito.html';
                        });
                    } else {
                        console.warn("btnCarrito no encontrado (dentro de Sidebar).");
                    }

                    const btnAdministracion = document.getElementById('btnAdministracion');
                    if (btnAdministracion) {
                        btnAdministracion.addEventListener('click', () => {
                            window.location.href = '../html/administracion.html';
                        });
                    } else {
                        console.warn("btnAdministracion no encontrado (dentro de Sidebar).");
                    }

                    const btnInbox = document.getElementById('btnInbox');
                    if (btnInbox) {
                        btnInbox.addEventListener('click', () => {
                            window.location.href = '../html/bandeja_entrada.html';
                        });
                    } else {
                        console.warn("btnInbox no encontrado (dentro de Sidebar).");
                    }

                    const btnPerfil = document.getElementById('btnPerfil');
                    if (btnPerfil) {
                        btnPerfil.addEventListener('click', () => {
                            window.location.href = '../html/configuracion.html';
                        });
                    } else {
                        console.warn("btnPerfil no encontrado (dentro de Sidebar).");
                    }

                    const btnConfig = document.getElementById('btnConfig');
                    if (btnConfig) {
                        btnConfig.addEventListener('click', () => {
                            window.location.href = '../html/personalizar.html';
                        });
                    } else {
                        console.warn("btnConfig no encontrado (dentro de Sidebar).");
                    }

                    const btnContacto = document.getElementById('btnContacto');
                    if (btnContacto) {
                        btnContacto.addEventListener('click', () => {
                            window.location.href = '../html/contacto.html';
                        });
                    } else {
                        console.warn("btnContacto no encontrado (dentro de Sidebar).");
                    }
                }
            });
    }

}

export default Sidebar;
