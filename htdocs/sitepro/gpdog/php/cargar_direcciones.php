<?php
session_start();
require_once 'conexion.php'; // <-- Ajusta si tu conexión a la BD está en otro archivo

$response = array('success' => false, 'direcciones' => []);

if (isset($_SESSION['user_id'])) {
    $id_usuario = $_SESSION['user_id'];

    $query = "SELECT id_direccion, calle, colonia, municipio, estado, cp, instrucciones_adicionales 
              FROM direcciones 
              WHERE id_usuario = ?";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $id_usuario);

    if ($stmt->execute()) {
        $result = $stmt->get_result();
        $direcciones = [];

        while ($row = $result->fetch_assoc()) {
            $direcciones[] = $row;
        }

        $response['success'] = true;
        $response['direcciones'] = $direcciones;
    }
    $stmt->close();
} else {
    $response['error'] = 'No logueado';
}

$conn->close();
echo json_encode($response);
?>
