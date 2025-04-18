<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';
$response = [];

$nombre = $_POST['nombre_clase']; // <- ahora sí coincide con el JS

$sql = "INSERT INTO tipo_producto (estatus, descripcion) VALUES ('A', ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $nombre); // <- variable correcta

if ($stmt->execute()) {
    $response['success'] = true;
} else {
    $response['success'] = false;
    $response['error'] = $stmt->error;
}

$stmt->close();
$conn->close();
echo json_encode($response);
?>