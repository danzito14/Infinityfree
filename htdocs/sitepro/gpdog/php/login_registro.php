<?php
session_start();
include 'conexion_bd.php';

header("Content-Type: application/json"); // Importante para que JS sepa que es JSON

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $action = $_POST['action'];

    if (empty($username) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit;
    }

    if ($action == "login") {
        $sql = "SELECT * FROM usuarios WHERE nombre = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['contra'])) {
                $_SESSION['user_id'] = $user['id_usu'];
                $_SESSION['username'] = $user['nombre'];
                echo json_encode(["success" => true]);
                exit;
            } else {
                echo json_encode(["success" => false, "message" => "Contraseña incorrecta."]);
                exit;
            }
        } else {
            echo json_encode(["success" => false, "message" => "Usuario no encontrado."]);
            exit;
        }
    } elseif ($action == "register") {
        if (empty($_POST['nickname'])) {
            echo json_encode(["success" => false, "message" => "Falta el nickname."]);
            exit;
        }

        $nickname = $_POST['nickname'];
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $estatus = "A";

        $sql = "INSERT INTO usuarios (estatus, nombre, nombre_usuario, contra) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $estatus, $username, $nickname, $hashed_password);

        if ($stmt->execute()) {
            $_SESSION['user_id'] = $conn->insert_id;
            $_SESSION['username'] = $username;
            echo json_encode(["success" => true]);
            exit;
        } else {
            echo json_encode(["success" => false, "message" => "Error al registrar."]);
            exit;
        }
    }
}
?>