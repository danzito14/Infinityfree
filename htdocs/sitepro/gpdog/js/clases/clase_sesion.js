class Verificar_Inicio_de_Sesion {
    constructor() {
    }

    ver_sesion_actual(origen) {
        fetch('../php/sesion.php')
            .then(res => res.json())
            .then(data => {
                if (data.logueado && data.nvl_usuario == 1 && origen == "administracion") {
                    console.log("Administrador autenticado");
                } else if (data.logueado && origen === "usuario" && (data.nvl_usuario == 1 || data.nvl_usuario == 2)) {
                    console.log("Usuario autenticado");
                } else {
                    //  alert("No autorizado: " + data.username + "  " + data.nvl_usuario + "  " + origen);
                    Swal.fire({
                        title: "Lo sientimos, no ha iniciado sesión",
                        text: "Para acceder al sitio web, necesita iniciar sesión",
                        icon: "error",
                        cancelButtonColor: "#004080",
                        confirmButtonText: "OK"
                    })

                    window.location.href = "login.html";
                }
            })
            .catch(error => console.error("Error al verificar sesión:", error));
    }
}
