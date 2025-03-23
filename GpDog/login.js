document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const goToRegister = document.getElementById('go-to-register');
    const resetButtons = document.querySelectorAll('.reset-button');

    function switchForm(show, hide) {
        hide.style.display = 'none';
        show.style.display = 'block';
        show.querySelector('form').reset();
        removeErrorStyles(show);
    }

    showLogin.addEventListener('click', function (event) {
        event.preventDefault();
        switchForm(loginForm, registerForm);
    });

    showRegister.addEventListener('click', function (event) {
        event.preventDefault();
        switchForm(registerForm, loginForm);
    });

    goToRegister.addEventListener('click', function (event) {
        event.preventDefault();
        switchForm(registerForm, loginForm);
    });

    function validatePassword(password) {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(password);
    }

    function showError(input, message) {
        alert(`⚠️ ${message}`);
        input.classList.add('input-error');
        input.focus();
    }

    function removeErrorStyles(form) {
        if (!form) return;
        form.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
    }

    loginForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        removeErrorStyles(loginForm);

        const user = document.getElementById('login-user');
        const password = document.getElementById('login-password');

        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (user.value.trim().length < 3) return showError(user, 'El usuario debe tener al menos 3 caracteres.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');
        if (!validatePassword(password.value.trim())) 
            return showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');

        alert('✅ Inicio de sesión exitoso (simulado).');
    });

    registerForm.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault();
        removeErrorStyles(registerForm);

        const name = document.getElementById('register-name');
        const age = document.getElementById('register-age');
        const user = document.getElementById('register-user');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

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

        alert('✅ Registro exitoso (simulado).');
    });

    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = button.closest('form');
            form.reset();
            removeErrorStyles(form);
        });
    });
});
