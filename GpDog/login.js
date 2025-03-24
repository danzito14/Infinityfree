// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
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
        if (!validatePassword(password.value.trim())) 
            return showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');

        // Si las credenciales son válidas, simula un inicio de sesión exitoso y redirige a home.html
        alert('✅ Inicio de sesión exitoso (simulado).');
        window.location.href = "home.html"; // Redirige a la página principal
    });

    // Evento para manejar el envío del formulario de registro
    registerForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        removeErrorStyles(registerForm);

        // Obtiene los valores ingresados en los campos del formulario de registro
        const name = document.getElementById('register-name');
        const age = document.getElementById('register-age');
        const user = document.getElementById('register-user');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        // Validaciones del formulario de registro
        if (name.value.trim() === '') return showError(name, 'Rellena el campo de nombre.');
        if (age.value.trim() === '' || isNaN(parseInt(age.value)) || parseInt(age.value) < 18 || parseInt(age.value) > 99) 
            return showError(age, 'La edad debe ser un número entre 18 y 99 años.');
        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (user.value.trim().length < 3) return showError(user, 'El usuario debe tener al menos 3 caracteres.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');
        if (!validatePassword(password.value.trim())) 
            return showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
        if (confirmPassword.value.trim() === '') return showError(confirmPassword, 'Rellena el campo de confirmación de contraseña.');
        if (password.value.trim() !== confirmPassword.value.trim()) 
            return showError(confirmPassword, 'Las contraseñas no coinciden.');

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
