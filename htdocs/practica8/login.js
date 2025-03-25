// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {

    function contarCookies() {
        const cookies = document.cookie; // Obtiene todas las cookies en un solo string
        if (!cookies) return 0; // Si no hay cookies, retorna 0

        return cookies.split(';').length; // Cuenta cuántas cookies hay
    }

    console.log(`Número de cookies en la sesión: ${contarCookies()}`);

    // Obtiene los elementos del formulario de inicio de sesión y registro
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const goToRegister = document.getElementById('go-to-register');
    const resetButtons = document.querySelectorAll('.reset-button');

    // Función para cambiar entre formularios (login <-> registro)
    function switchForm(show, hide) {
        hide.style.display = 'none'; // Oculta el formulario actual
        show.style.display = 'block'; // Muestra el formulario deseado
        show.querySelector('form').reset(); // Resetea los campos del formulario
        removeErrorStyles(show); // Elimina estilos de error previos
    }

    // Evento para mostrar el formulario de inicio de sesión
    showLogin.addEventListener('click', function (event) {
        event.preventDefault(); // Evita el comportamiento por defecto del enlace
        switchForm(loginForm, registerForm);
    });

    // Evento para mostrar el formulario de registro
    showRegister.addEventListener('click', function (event) {
        event.preventDefault();
        switchForm(registerForm, loginForm);
    });

    // Otro evento para cambiar al formulario de registro
    goToRegister.addEventListener('click', function (event) {
        event.preventDefault();
        switchForm(registerForm, loginForm);
    });

    // Función para validar la contraseña con una expresión regular
    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    // Función para mostrar un mensaje de error y resaltar el campo con error
    function showError(input, message) {
        alert(`⚠️ ${message}`); // Muestra una alerta con el mensaje de error
        input.classList.add('input-error'); // Agrega una clase de error al campo
        input.focus(); // Enfoca el campo para que el usuario lo corrija
    }

    // Función para eliminar estilos de error de los campos
    function removeErrorStyles(form) {
        if (!form) return;
        form.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
    }

    function obtenerTodasLasCookies() {
        const cookies = document.cookie.split('; '); // Divide cada cookie
        let cookieObj = {};

        cookies.forEach(cookie => {
            let [nombre, valor] = cookie.split('='); // Divide en nombre y valor
            cookieObj[nombre] = decodeURIComponent(valor); // Decodifica valores
        });

        return cookieObj;
    }

    console.log(obtenerTodasLasCookies());
    // Función de validación de usuario y contraseña
    function validarCredenciales(nombreUsuario, password) {
        const datos_cookies = obtenerTodasLasCookies();

        // Comprobamos si alguna de las cookies tiene las credenciales correctas
        const credencialesValidas = Object.entries(datos_cookies).some(([nombreCookie, valorCookie]) => {
            try {
                // Parseamos el valor JSON de la cookie
                const datosUsuario = JSON.parse(valorCookie);

                // Comprobamos si el nombre de usuario y la contraseña coinciden
                return datosUsuario.usuario === nombreUsuario && datosUsuario.contra === password || datosUsuario.nombre === nombreUsuario && datosUsuario.contra === password;
            } catch (error) {
                // Si la cookie no tiene un formato válido, la ignoramos
                return false;
            }
        });

        return credencialesValidas;
    }



    // Ejemplo de uso



    // Evento para manejar el envío del formulario de inicio de sesión
    loginForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío por defecto del formulario
        removeErrorStyles(loginForm); // Elimina estilos de error previos

        // Obtiene los valores ingresados en los campos de usuario y contraseña
        const user = document.getElementById('login-user');
        const password = document.getElementById('login-password');

        // Validaciones del formulario de inicio de sesión
        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (user.value.trim().length < 3) return showError(user, 'El usuario debe tener al menos 3 caracteres.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');

        if (validarCredenciales(user.value, password.value)) {
            console.log("Credenciales correctas");
            alert('✅ Inicio de sesión exitoso (simulado).');
            window.location.href = "home.html"; // Redirige a la página principal
        } else {
            console.log("Credenciales incorrectas");
        }
        // Si las credenciales son válidas, simula un inicio de sesión exitoso y redirige a home.html

    });






    // Evento para manejar el envío del formulario de registro
    registerForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        removeErrorStyles(registerForm);

        // Obtiene los valores ingresados en los campos del formulario de registro
        const name = document.getElementById('register-name');

        const user = document.getElementById('register-user');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        // Validaciones del formulario de registro
        if (name.value.trim() === '') return showError(name, 'Rellena el campo de nombre.');
        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (user.value.trim().length < 3) return showError(user, 'El usuario debe tener al menos 3 caracteres.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');
        if (!validatePassword(password.value.trim()))
            return showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
        if (confirmPassword.value.trim() === '') return showError(confirmPassword, 'Rellena el campo de confirmación de contraseña.');
        if (password.value.trim() !== confirmPassword.value.trim())
            return showError(confirmPassword, 'Las contraseñas no coinciden.');

        const datos_usuario = { nombre: name.value, usuario: user.value, contra: password.value };
        const datosJSON = JSON.stringify(datos_usuario);
        const nombre_cookie = "datos_usuario" + contarCookies();
        console.log("Se va a crear  el " + nombre_cookie);
        document.cookie = `${nombre_cookie}=${encodeURIComponent(datosJSON)}; expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/`;

        document.getElementById("resultados").innerHTML = `
            <h4>Nombre: ${datos_usuario.nombre} </h4>
            <h4>Usuario: ${datos_usuario.usuario} </h4>
            <h4>Contraseña: ${datos_usuario.contra} </h4>

        `;
        // Si todo está correcto, simula un registro exitoso
        alert('✅ Registro exitoso (simulado).');
    });

    // Evento para manejar la limpieza de los formularios al presionar los botones de reset
    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = button.closest('form'); // Encuentra el formulario más cercano al botón
            form.reset(); // Resetea los campos del formulario
            removeErrorStyles(form); // Elimina los estilos de error
        });
    });
});
