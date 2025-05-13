// Inicializar el mapa con Leaflet
const map = L.map('map').setView([25.7959, -108.9864], 13); // Coordenadas de Los Mochis

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Marcadores simulados
const mascotas = [
  { nombre: "Max", lat: 25.7959, lon: -108.9864 },
  { nombre: "Luna", lat: 25.7925, lon: -108.9888 },
  { nombre: "Rocky", lat: 25.8002, lon: -108.9800 }
];

mascotas.forEach(m => {
  L.marker([m.lat, m.lon])
    .addTo(map)
    .bindPopup(`🐾 ${m.nombre}`)
    .openPopup();
});


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