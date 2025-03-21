document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const goToRegister = document.getElementById('go-to-register');
    const resetButtons = document.querySelectorAll('.reset-button');

    // Alternar entre formularios de inicio de sesión y registro
    showLogin.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    });

    showRegister.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    goToRegister.addEventListener('click', function (event) {
        event.preventDefault();
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    });

    // Función para mostrar errores en los campos
    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');

        if (errorMessage) {
            errorMessage.textContent = message;
        }
    }

    // Función para limpiar errores
    function clearErrors(form) {
        const errorMessages = form.querySelectorAll('.error-message');
        errorMessages.forEach(error => error.textContent = '');
    }

    // Función para validar la complejidad de la contraseña
    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    // Validar formulario de inicio de sesión
    loginForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrors(loginForm); // Limpiar errores anteriores

        const user = document.getElementById('login-user');
        const password = document.getElementById('login-password');

        let isValid = true;

        if (user.value.trim() === '') {
            showError(user, 'Rellena este campo.');
            isValid = false;
        } else if (user.value.trim().length < 3) {
            showError(user, 'El usuario debe tener al menos 3 caracteres.');
            isValid = false;
        }

        if (password.value.trim() === '') {
            showError(password, 'Rellena este campo.');
            isValid = false;
        } else if (!validatePassword(password.value.trim())) {
            showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
            isValid = false;
        }

        if (isValid) {
            alert('Inicio de sesión exitoso (simulado).');
        }
    });

    // Validar formulario de registro
    registerForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        clearErrors(registerForm); // Limpiar errores anteriores

        const name = document.getElementById('register-name');
        const age = document.getElementById('register-age');
        const user = document.getElementById('register-user');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        let isValid = true;

        if (name.value.trim() === '') {
            showError(name, 'Rellena este campo.');
            isValid = false;
        }

        if (age.value.trim() === '' || isNaN(age.value) || age.value < 18 || age.value > 99) {
            showError(age, 'La edad debe ser entre 18 y 99 años.');
            isValid = false;
        }

        if (user.value.trim() === '') {
            showError(user, 'Rellena este campo.');
            isValid = false;
        } else if (user.value.trim().length < 3) {
            showError(user, 'El usuario debe tener al menos 3 caracteres.');
            isValid = false;
        }

        if (password.value.trim() === '') {
            showError(password, 'Rellena este campo.');
            isValid = false;
        } else if (!validatePassword(password.value.trim())) {
            showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
            isValid = false;
        }

        if (confirmPassword.value.trim() === '') {
            showError(confirmPassword, 'Rellena este campo.');
            isValid = false;
        } else if (password.value !== confirmPassword.value) {
            showError(confirmPassword, 'Las contraseñas no coinciden.');
            isValid = false;
        }

        if (isValid) {
            alert('Registro exitoso (simulado).');
        }
    });

    // Reiniciar campos de los formularios
    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = button.closest('form');
            form.reset();
            clearErrors(form); // Limpiar errores al reiniciar
        });
    });
});