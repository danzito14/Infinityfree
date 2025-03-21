function validarFormulario() {
    let nombre = document.getElementById("nombre");
    let edad = document.getElementById("edad");
    let email = document.getElementById("email");
    let usuario = document.getElementById("usuario");
    let password = document.getElementById("password");
    let confirmarPassword = document.getElementById("confirmarPassword");

    let errores = {};

    // Expresiones regulares
    let regexNombre = /^[A-Za-z\s]+$/;
    let regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    let regexUsuario = /^[a-zA-Z0-9]{5,}$/;
    let regexPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

    // Validación de nombre
    if (!regexNombre.test(nombre.value)) {
        errores.nombre = "Nombre inválido (solo letras y espacios)";
        nombre.classList.add("error");
    } else {
        nombre.classList.remove("error");
    }

    // Validación de edad
    if (edad.value <= 0 || edad.value >= 100 || isNaN(edad.value)) {
        errores.edad = "Edad inválida (1-99)";
        edad.classList.add("error");
    } else {
        edad.classList.remove("error");
    }

    // Validación de email
    if (!regexEmail.test(email.value)) {
        errores.email = "Email inválido";
        email.classList.add("error");
    } else {
        email.classList.remove("error");
    }

    // Validación de usuario
    if (!regexUsuario.test(usuario.value)) {
        errores.usuario = "Usuario inválido (al menos 5 caracteres alfanuméricos)";
        usuario.classList.add("error");
    } else {
        usuario.classList.remove("error");
    }

    // Validación de contraseña
    if (!regexPassword.test(password.value)) {
        errores.password = "Contraseña inválida (8+ caracteres, 1 letra, 1 número, 1 símbolo)";
        password.classList.add("error");
    } else {
        password.classList.remove("error");
    }

    // Validación de confirmación de contraseña
    if (password.value !== confirmarPassword.value) {
        errores.confirmarPassword = "Las contraseñas no coinciden";
        confirmarPassword.classList.add("error");
    } else {
        confirmarPassword.classList.remove("error");
    }

    // Mostrar errores
    for (let campo in errores) {
        document.getElementById("error" + campo.charAt(0).toUpperCase() + campo.slice(1)).textContent = errores[campo];
    }

    // Si no hay errores, mostrar datos y encriptar contraseña
    if (Object.keys(errores).length === 0) {
        let passwordEncriptado = btoa(password.value); // Encriptación Base64 (ejemplo)

        document.getElementById("resultado").innerHTML = `
            <p>Nombre: ${nombre.value}</p>
            <p>Edad: ${edad.value}</p>
            <p>Email: ${email.value}</p>
            <p>Usuario: ${usuario.value}</p>
            <p>Contraseña: ${password.value}</p>
            <p>Contraseña encriptada: ${passwordEncriptado}</p>
        `;
    }
}

function cancelarFormulario() {
    Swal.fire({
        title: '¿Seguro que quieres borrar los datos?',
        text: "¡No podrás recuperar la información!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#F39C12',
        cancelButtonColor: '#e0e0e0',
        confirmButtonText: 'Sí, borrar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            document.getElementById("miFormulario").reset();
            let errores = document.getElementsByClassName("error-message");
            for (let error of errores) {
                error.textContent = "";
            }
            Swal.fire({
                title: 'Borrado!',
                text: 'Los datos han sido borrados.',
                icon: 'success',
                confirmButtonColor: '#F39C12',
                confirmButtonText: 'Aceptar'
            });
        }
    });
}


// Mostrar/ocultar contraseña
document.getElementById("verPassword").addEventListener("change", function () {
    let password = document.getElementById("password");
    password.type = this.checked ? "text" : "password";
});

