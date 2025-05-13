<?php
session_start();
require_once 'conexion.php';

$response = array('success' => false);

if (isset($_GET['id_direccion'])) {
    $id_direccion = intval($_GET['id_direccion']);

    $query = "SELECT calle, colonia, municipio, estado, cp FROM direcciones WHERE id_direccion = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_direccion);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        if ($direccion = $result->fetch_assoc()) {
            $response['success'] = true;
            $response['direccion'] = $direccion;
        }
    }
    $stmt->close();
}
$conn->close();
echo json_encode($response);
?>
