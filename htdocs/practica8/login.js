

// Espera a que el contenido del DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', function () {
    window.onload = verificarUsuarioLogeado;
    function contarCookies() {
        const cookies = document.cookie; // Obtiene todas las cookies en un solo string
        if (!cookies) return 0; // Si no hay cookies, retorna 0

        return cookies.split(';').length; // Cuenta cuántas cookies hay
    }

    let nombredelacookie = '';
    console.log(`Número de cookies en la sesión: ${contarCookies()}`);

    function verificarUsuarioLogeado() {
        const datos_cookies = obtenerTodasLasCookies();

        // Filtrar solo las cookies que cumplen con el formato "datos_usuarioX"
        Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {
            nombredelacookie = localStorage.getItem('nombredelacookie');

            if (nombredelacookie === nombreCookie) { // Verifica que el nombre siga el patrón "datos_usuarioX"

                try {
                    const datosUsuario = JSON.parse(valorCookie);

                    if (datosUsuario.logeado === "true") {
                        nombredelacookie = nombreCookie;
                        window.location.href = "home.html";

                        // Guardar la instancia en el almacenamiento local para compartir entre páginas
                    }
                } catch (error) {
                    console.error("Error al procesar la cookie:", nombreCookie, error);
                }
            }
        });
    }

    function obtenerTodasLasCookies() {
        const cookies = document.cookie.split('; '); // Divide cada cookie
        let cookieObj = {};

        cookies.forEach(cookie => {
            let [nombre, valor] = cookie.split('='); // Divide en nombre y valor
            if (nombre && valor) {
                cookieObj[nombre.trim()] = decodeURIComponent(valor); // Decodifica valores y elimina espacios
            }
        });

        return cookieObj;
    }
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
        const regex = /^.{8,}$/;
        return regex.test(password);
    }

    // Función para mostrar un mensaje de error y resaltar el campo con error
    function showError(input, message) {
        Swal.fire({
            icon: 'error',
            title: '¡Error!',
            text: message,
            confirmButtonColor: '#A6762A',
            confirmButtonText: 'Aceptar'
        }); // Muestra un SweetAlert con el mensaje de error

        input.classList.add('input-error'); // Agrega una clase de error al campo
        input.focus();  // Enfoca el campo para que el usuario lo corrija
    }

    // Función para eliminar estilos de error de los campos
    function removeErrorStyles(form) {
        if (!form) return;
        form.querySelectorAll('.input-error').forEach(input => {
            input.classList.remove('input-error');
        });
    }



    // Obtener las cookies en un objeto
    const info_cookies = obtenerTodasLasCookies();

    // Acceder y procesar las cookies que contienen datos de usuario
    Object.keys(info_cookies).forEach(nombre => {
        const valor = info_cookies[nombre];

        // Verificar si el valor es un JSON y parsearlo
        try {
            const datosUsuario = JSON.parse(valor);

            // Imprimir los datos del usuario
            console.log(`Nombre: ${datosUsuario.nombre}, Usuario: ${datosUsuario.usuario}, Contraseña: ${datosUsuario.contra} logeado: ${datosUsuario.logeado}`);
        } catch (e) {
            console.log(`La cookie ${nombre} no contiene un JSON válido.`);
        }
    });


    let usuarioEncontrado = null;
    let nombreCookieEncontrada = null;

    // Función de validación de usuario y contraseña
    function validarCredenciales(nombreUsuario, password) {
        const datos_cookies = obtenerTodasLasCookies();

        // Buscar si el usuario está en alguna cookie
        Object.entries(datos_cookies).forEach(([nombreCookie, valorCookie]) => {
            try {
                let datosUsuario = JSON.parse(valorCookie);

                if ((datosUsuario.usuario === nombreUsuario || datosUsuario.nombre === nombreUsuario) && datosUsuario.contra === password) {
                    usuarioEncontrado = datosUsuario;
                    nombreCookieEncontrada = nombreCookie;
                }
            } catch (error) {
                console.error("Error al leer la cookie:", error);
            }
        });

        if (usuarioEncontrado && nombreCookieEncontrada) {
            // ✅ Cambiar estado de "inactivo" a "activo"
            usuarioEncontrado.logeado = "true";

            // ✅ Guardar nuevamente la cookie con el estado actualizado
            document.cookie = `${nombreCookieEncontrada}=${JSON.stringify(usuarioEncontrado)};  expires=Fri, 31 Dec 2025 23:59:59 UTC; path=/`;

            return true; // Usuario validado y estado actualizado
        }

        return false;
    }

    function verificarusuario(nombreUsuario) {
        const datos_cookies = obtenerTodasLasCookies();

        // Comprobamos si alguna de las cookies tiene las credenciales correctas
        const credencialesValidas = Object.entries(datos_cookies).some(([nombreCookie, valorCookie]) => {
            try {
                // Parseamos el valor JSON de la cookie
                const datosUsuario = JSON.parse(valorCookie);

                // Comprobamos si el nombre de usuario y la contraseña coinciden
                return datosUsuario.usuario === nombreUsuario;
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
            Swal.fire({
                title: "Accediendo",
                icon: "success",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
            alert(nombreCookieEncontrada);
            localStorage.setItem('nombredelacookie', nombreCookieEncontrada);
            window.location.href = "home.html"; // Redirige a la página principal
        } else {
            Swal.fire({
                title: "Usuario o contraseña incorrectos",
                icon: "error",
                draggable: true,
                confirmButtonColor: "#A6762A"
            });
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
            return showError(password, 'La contraseña debe tener al menos 8 caracteres.');
        if (confirmPassword.value.trim() === '') return showError(confirmPassword, 'Rellena el campo de confirmación de contraseña.');
        if (password.value.trim() !== confirmPassword.value.trim())
            return showError(confirmPassword, 'Las contraseñas no coinciden.');
        if (verificarusuario(user.value)) return showError(user, "Usuario ya existente");
        console.log(user.value);
        console.log(verificarusuario(user));
        const datos_usuario = { nombre: name.value, usuario: user.value, contra: password.value, logeado: "false" };
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
        Swal.fire({
            title: "Usuario Registrado existosamente",
            icon: "success",
            draggable: true,
            confirmButtonColor: "#A6762A"
        });
    });

    // Evento para manejar la limpieza de los formularios al presionar los botones de reset
    resetButtons.forEach(button => {
        button.addEventListener('click', function () {
            const form = button.closest('form'); // Encuentra el formulario más cercano al botón
            form.reset(); // Resetea los campos del formulario
            removeErrorStyles(form); // Elimina los estilos de error
        });
    });



    document.getElementById('mostrarusuarios').addEventListener('click', () => {
        const info_cookies = obtenerTodasLasCookies();
        let resultadosHTML = '';
        let n = 0;

        // Acceder y procesar las cookies que contienen datos de usuario
        Object.keys(info_cookies).forEach(nombre => {
            const valor = info_cookies[nombre];
            n++;
            // Verificar si el valor es un JSON y parsearlo
            try {
                const datosUsuario = JSON.parse(valor);
                // Acumular resultados en la variable
                resultadosHTML += `
            <div>
                <h4>Usuario ${n}</h4>
                <h4>Nombre: ${datosUsuario.nombre} </h4>
                <h4>Usuario: ${datosUsuario.usuario} </h4>
                <h4>Contraseña: ${datosUsuario.contra} </h4>
                <h4>Logeado: ${datosUsuario.logeado} </h4>
                <br><br>
            </div>
            `;
                // Imprimir los datos del usuario
                console.log(`Nombre: ${datosUsuario.nombre}, Usuario: ${datosUsuario.usuario}, Contraseña: ${datosUsuario.contra}`);
            } catch (e) {
                console.log(`La cookie ${nombre} no contiene un JSON válido.`);
            }
        });

        // Asignar todos los resultados acumulados al innerHTML
        document.getElementById("resultados").innerHTML = resultadosHTML;
    });


    document.getElementById('borrarusuarios').addEventListener('click', () => {
        const cookies = document.cookie.split(';');
        cookies.forEach(cookie => {
            const nombre = cookie.split('=')[0].trim();
            if (nombre.includes('datos_usuario')) {
                borrarCookie(nombre);
            }
            location.reload();
        });
    });

    function borrarCookie(nombre) {
        document.cookie = nombre + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    }




    // Llamar a la función al ca

});

