<?php
session_start();
require_once 'conexion.php'; // <-- Ajusta si tu conexión a la BD está en otro archivo

$response = array('success' => false);

if (isset($_SESSION['user_id'])) {
    $id_usuario = $_SESSION['user_id'];

    $calle = $_POST['calle'] ?? '';
    $colonia = $_POST['colonia'] ?? '';
    $municipio = $_POST['municipio'] ?? '';
    $estado = $_POST['estado'] ?? '';
    $cp = $_POST['cp'] ?? '';
    $instrucciones = $_POST['instrucciones_adicionales'] ?? '';

    if (!empty($calle) && !empty($colonia) && !empty($municipio) && !empty($estado) && !empty($cp)) {
        $query = "INSERT INTO direcciones (id_usuario, calle, colonia, municipio, estado, cp, instrucciones_adicionales)
                  VALUES (?, ?, ?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("issssss", $id_usuario, $calle, $colonia, $municipio, $estado, $cp, $instrucciones);

        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['error'] = "Error al insertar";
        }

        $stmt->close();
    } else {
        $response['error'] = "Datos incompletos";
    }
} else {
    $response['error'] = 'No logueado';
}

$conn->close();
echo json_encode($response);
?>
