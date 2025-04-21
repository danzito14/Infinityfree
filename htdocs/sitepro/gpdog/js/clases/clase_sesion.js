class Verificar_Inicio_de_Sesion {
    constructor() {
        // No llames ver_sesion_actual aquí directamente
    }

    ver_sesion_actual(origen) {
        fetch('../php/sesion.php')
            .then(res => res.json())
            .then(data => {
                if (data.logueado && data.nvl_usuario == 1 && origen == "administracion") {
                    alert("Administrador autenticado");
                } else if (data.logueado && origen === "usuario" && (data.nvl_usuario == 1 || data.nvl_usuario == 2)) {
                    alert("Usuario autenticado");
                } else {
                    alert("No autorizado: " + data.username + "  " + data.nvl_usuario + "  " + origen);
                    window.location.href = "login.html";
                }
            })
            .catch(error => console.error("Error al verificar sesión:", error));
    }
}
