<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

error_log("Entrando al script cargar_datos_usuario.php");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id_usu'])) {
    $id_usu = $_POST['id_usu'];

    $stmt = $conn->prepare("SELECT * FROM usuarios WHERE id_usu = ?");
    if (!$stmt) {
        echo json_encode(["error" => "Error al preparar la consulta"]);
        exit;
    }

    $stmt->bind_param("s", $id_usu);
    $stmt->execute();
    $result = $stmt->get_result();

    $usuario = $result->fetch_assoc();

    if ($usuario) {
        echo json_encode($usuario);
    } else {
        echo json_encode(["error" => "Usuario no encontrado"]);
    }

    $stmt->close();
    $conn->close();
    error_log("Fin del script cargar_datos_usuario.php");
} else {
    echo json_encode(["error" => "Método inválido o faltan datos"]);
    error_log("Método inválido o faltan datos en cargar_datos_usuario.php");
}
?>