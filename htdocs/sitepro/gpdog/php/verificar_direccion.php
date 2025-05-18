<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$response = [];
$action = $_POST['action'] ?? null;

if ($action == "verificar_direccion") {
    $id_usuario = $_POST["id_usuario"];
    $sql = "SELECT cp, calle, colonia, municipio, estado FROM usuarios WHERE id_usu = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_usuario);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
        exit;

    } else {
        echo json_encode(["success" => false, "message" => $token]);
        exit;
    }
}
?>