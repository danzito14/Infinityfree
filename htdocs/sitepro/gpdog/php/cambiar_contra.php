<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = $_POST['action'] ?? null;
$response = [];

if ($action == "verificar_contra") {
    $contraseña_actual = $_POST['contraseña_actual'] ?? '';
    $id_usu = $_POST['id_usu'] ?? '';

    $sql = "SELECT contra FROM usuarios WHERE id_usu = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_usu);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $hash_guardado = $row['contra'];
        if (password_verify($contraseña_actual, $hash_guardado)) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['error'] = "Contraseña incorrecta";
        }
    } else {
        $response['success'] = false;
        $response['error'] = "Usuario no encontrado";
    }

    $stmt->close();
    $conn->close();
    echo json_encode($response);

} elseif ($action == "actualizar_contra") {
    $nueva_contraseña = $_POST['nueva_contraseña'] ?? '';
    $id_usu = $_POST['id_usu'] ?? '';

    // Generar el hash seguro
    $nueva_contraseña_hash = password_hash($nueva_contraseña, PASSWORD_DEFAULT);

    $sql = "UPDATE usuarios SET contra = ? WHERE id_usu = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $nueva_contraseña_hash, $id_usu);

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