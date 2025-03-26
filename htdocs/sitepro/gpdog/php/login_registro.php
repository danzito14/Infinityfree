<?php
session_start();
include 'conexion_bd.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $action = $_POST['action']; // Saber si es login o register

    if (empty($username) || empty($password)) {
        echo "Datos incompletos.";
        exit;
    }

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
                header("Location: ../html/home.html");
                exit;
            } else {
                echo "Contraseña incorrecta.";
            }
        } else {
            echo "Usuario incorrecto.";
        }
    } elseif ($action == "register") {
        

        // Proceso de registro con contraseña encriptada
        $nickname = $_POST['nickname']; // Asegurar que el campo está definido
        $hashed_password = password_hash($password, PASSWORD_DEFAULT); // Encriptar contraseña
        $estatus = "A";

        $sql = "INSERT INTO usuarios (estatus, nombre, nombre_usuario, contra) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $estatus, $username, $nickname, $hashed_password);

        if ($stmt->execute()) {
            header("Location: ../html/home.html");
            exit;
        } else {
            echo "Error al registrar.";
        }
    }
}
?>
