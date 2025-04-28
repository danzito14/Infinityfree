<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = $_POST['action'] ?? null;
if ($action == "datos_usuario") {
    // Recuperar los datos del formulario
    $nombre_completo = $_POST['nombre_completo'];
    $nombre_usuario = $_POST['nombre_usuario'];
    $correo = $_POST['correo'];
    $num_telefono = $_POST['num_telefono'];
    $id_usu = $_POST['id_usu'];

    // Preparar y ejecutar el UPDATE
    $sql = "UPDATE usuarios SET nombre = ?, nombre_usuario = ?, correo = ?, num_tel = ? WHERE id_usu = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssss", $nombre_completo, $nombre_usuario, $correo, $num_telefono, $id_usu);

    $response = [];

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error; // Puedes omitir esto en producción
    }

    // Cerrar conexión y enviar respuesta JSON
    $stmt->close();
    $conn->close();

    echo json_encode($response);
} elseif ($action == "datos_direccion") {
    $cp = $_POST['cp'];
    $calle = $_POST['calle'];
    $colonia = $_POST['colonia'];
    $municipio = $_POST['municipio'];
    $estado = $_POST['estado'];
    $instrucciones_adicionales = $_POST['instrucciones_adicionales'];
    $id_usu = $_POST['id_usu']; // IMPORTANTE: añadir esta línea

    // SQL corregido con comas
    $sql = "UPDATE usuarios SET cp = ?, calle = ?, colonia = ?, municipio = ?, estado = ?, instrucciones_adicionales = ? WHERE id_usu = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssss", $cp, $calle, $colonia, $municipio, $estado, $instrucciones_adicionales, $id_usu);

    $response = [];

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
    }

    $stmt->close();
    $conn->close();

    echo json_encode($response);
}
?>