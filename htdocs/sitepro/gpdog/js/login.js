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
        const regex = /^[A-Za-z\d@$!%*?&]{4,}$/;
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
    // Enviar el formulario de login
    loginForm.querySelector('form').addEventListener('submit', async function (event) {
        event.preventDefault();
        removeErrorStyles(loginForm);

        const user = document.getElementById('login-user');
        const password = document.getElementById('login-password');

        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');

        const formData = new FormData();
        formData.append('username', user.value.trim());
        formData.append('password', password.value.trim());
        formData.append('action', 'login');

        try {
            const response = await fetch('../php/login_registro.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    title: "Accediendo",
                    icon: "success",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                }).then(() => {
                    window.location.href = '../html/home.html';
                });
            } else {
                Swal.fire({
                    title: "Usuario o contraseña incorrectos",
                    icon: "error",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                });
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Ocurrió un error al conectar con el servidor.');
        }
    });

    // Enviar el formulario de registro
    registerForm.querySelector('form').addEventListener('submit', async function (event) {
        event.preventDefault();
        removeErrorStyles(registerForm);

        const name = document.getElementById('register-name');
        const user = document.getElementById('register-user');
        const password = document.getElementById('register-password');
        const confirmPassword = document.getElementById('register-confirm-password');

        if (name.value.trim() === '') return showError(name, 'Rellena el campo de nombre.');
        if (user.value.trim() === '') return showError(user, 'Rellena el campo de usuario.');
        if (user.value.trim().length < 3) return showError(user, 'El usuario debe tener al menos 3 caracteres.');
        if (password.value.trim() === '') return showError(password, 'Rellena el campo de contraseña.');
        if (!validatePassword(password.value.trim()))
            return showError(password, 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.');
        if (confirmPassword.value.trim() === '') return showError(confirmPassword, 'Rellena el campo de confirmación de contraseña.');
        if (password.value.trim() !== confirmPassword.value.trim())
            return showError(confirmPassword, 'Las contraseñas no coinciden.');

        const formData = new FormData();
        formData.append('username', name.value.trim());
        formData.append('nickname', user.value.trim());
        formData.append('password', password.value.trim());
        formData.append('action', 'register');

        try {
            const response = await fetch('../php/login_registro.php', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                Swal.fire({
                    title: "Usuario Registrado existosamente",
                    icon: "success",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                }).then(() => {
                    window.location.href = '../html/home.html';
                });
            } else {
                Swal.fire({
                    title: "Los datos no cumplen con los paremetros",
                    icon: "error",
                    draggable: true,
                    confirmButtonColor: "#A6762A"
                });
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Ocurrió un error al conectar con el servidor.');
        }
    });

    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = button.closest('form');
            form.reset();
            removeErrorStyles(form);
        });
    });
});
