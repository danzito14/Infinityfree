<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
session_start();
include 'conexion_bd.php';

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['username'];
    $password = $_POST['password'];
    $action = $_POST['action'];

    if (empty($username) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Datos incompletos."]);
        exit;
    }

    if ($action == "login") {
        $sql = "SELECT * FROM usuarios WHERE (nombre = ? OR nombre_usuario = ?) AND estatus = 'A'";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ss", $username, $username);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            $user = $result->fetch_assoc();
            if (password_verify($password, $user['contra'])) {
                $_SESSION['user_id'] = $user['id_usu'];
                $_SESSION['username'] = $user['nombre'];
                $_SESSION['nvl_usuario'] = $user['nvl_usuario'];
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
        if (empty($_POST['nickname']) || empty($_POST['username']) || empty($_POST['correo']) || empty($_POST['password'])) {
            echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
            exit;
        }

        $nickname = $_POST['nickname'];
        $username = $_POST['username'];
        $correo = $_POST['correo'];
        $nvl_usuario = $_POST['nvl_usuario'];
        $password = $_POST['password'];
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $estatus = "P";
        $token = bin2hex(random_bytes(16));

        // Verificar si el nombre de usuario ya existe
        $check_sql = "SELECT id_usu FROM usuarios WHERE nombre_usuario = ?";
        $check_stmt = $conn->prepare($check_sql);
        $check_stmt->bind_param("s", $username);
        $check_stmt->execute();
        $check_stmt->store_result();

        // Verificar si el correo ya existe
        $check_sql2 = "SELECT id_usu FROM usuarios WHERE correo = ?";
        $check_stmt2 = $conn->prepare($check_sql2);
        $check_stmt2->bind_param("s", $correo);
        $check_stmt2->execute();
        $check_stmt2->store_result();

        if ($check_stmt->num_rows > 0 && $check_stmt2->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El nombre de usuario  y correo ya están en uso. ¿No quieres iniciar sesión?"]);
            exit;
        }

        if ($check_stmt->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El nombre de usuario ya está en uso."]);
            exit;
        }

        if ($check_stmt2->num_rows > 0) {
            echo json_encode(["success" => false, "message" => "El correo ya está en uso."]);
            exit;
        }


        // Insertar nuevo usuario
        $sql = "INSERT INTO usuarios (estatus, nvl_usuario, token, nombre, nombre_usuario, correo, contra) VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("sssssss", $estatus, $nvl_usuario, $token, $username, $nickname, $correo, $hashed_password);

        if ($stmt->execute()) {
            $insert_id = $stmt->insert_id;


            if (enviar_correo($insert_id, $token, $username, $correo)) {
                echo json_encode(["success" => true]);
                exit;
            }
        } else {
            echo json_encode(["success" => false, "message" => $token]);
            exit;
        }

    }

}
function enviar_correo($insert_id, $token, $username, $correo)
{
    require __DIR__ . '/correo/enviar_correo.php';

    $mailer = new Enviar_correo();
    $url = 'https://urielcaro.infinityfreeapp.com/sitepro/gpdog/php/correo/activa_cliente.php?id=' . $insert_id . '&token=' . $token;
    $asunto = "Activar cuenta - GPDOG";
    $cuerpo = '<h1>Estimado ' . htmlspecialchars($username) . '</h1> <br> 
<h3>Para continuar con el registro de su cuenta, presione el siguiente link.</h3> <br>
<button style="width:300px;margin-left:32%;border-radius:5px; background-color: gold;">
    <a href="' . htmlspecialchars($url) . '" style="text-decoration: none; color: white;">Activar cuenta</a>
</button>';
    if ($mailer->enviarcorreo($correo, $asunto, $cuerpo, $username)) {
        return true;
    } else {
        return false;
    }
}
?>