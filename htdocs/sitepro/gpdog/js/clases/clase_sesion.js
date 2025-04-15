

class Verificar_Inicio_de_Sesion {
    constructor() {
        this.ver_sesion_actual();
    }

    ver_sesion_actual() {
        fetch('../php/sesion.php')
            .then(res => res.json())
            .then(data => {
                if (data.logueado) {
                    let nombre = data.username;
                    console.log("usairo logueado", data.username);
                    console.log("ID usuario ", data.user_id);
                    console.log("aqui esta ", nombre);
                } else {
                    // Si no hay sesión, redirige
                    window.location.href = "login.html";
                }
            })
            .catch(error => console.error("Error al verificar sesión:", error));
    }
}