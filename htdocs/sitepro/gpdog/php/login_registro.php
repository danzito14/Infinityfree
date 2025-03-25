<?php
session_start();
include 'conexion_bd.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $nickname = $_POST['nickname'];
    $action = $_POST['action']; // Obtenemos el tipo de acción (login o register)

    if (empty($username) || empty($password)) {
        echo "Datos incompletos.";
    } else {
        if ($action == "login") {
            // Proceso de inicio de sesión
            $sql = "SELECT * FROM usuarios WHERE nombre = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("s", $username);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows > 0) {
                $user = $result->fetch_assoc();
                // Verificar la contraseña encriptada
                if (password_verify($password, $user['contra'])) {
                    $_SESSION['user_id'] = $user['id_usu'];
                    $_SESSION['username'] = $user['nombre'];
                    echo "Inicio de sesión exitoso.";
                    header("Location: ../../html/home.html");
                    exit;
                } else {
                    echo "Contraseña incorrecta.";
                }
            } else {
                echo "Usuario incorrecto.";
            }
        } elseif ($action == "register") {
            // Proceso de registro
            $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Encriptamos la contraseña
            $sql = "INSERT INTO usuarios (estatus, nombre, nombre_usuario, contra) VALUES (?, ?)";
            $estatus = "A";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("ss", $estatus, $username, $hashed_password);

            if ($stmt->execute()) {
                echo "Registro exitoso. Ahora puedes iniciar sesión.";
                header("Location: ../../html/home.html");
            } else {
                echo "Error al registrar.";
            }
        }
    }
}
?>