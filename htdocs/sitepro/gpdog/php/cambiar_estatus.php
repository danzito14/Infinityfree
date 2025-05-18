<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = $_POST['action'] ?? null;
$response = [];

if ($action == "producto") {
    $id_producto = $_POST['id_producto'];
    $estatus = $_POST['estatus'];

    if ($estatus == 'A') {
        $estatus = 'I';
    } else {
        $estatus = 'A';
    }

    $sql = "UPDATE productos SET estatus = ? WHERE id_producto = ? ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $estatus, $id_producto);

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
    }

    $stmt->close();
    $conn->close();
    echo json_encode($response);
} elseif ($action == "categorias") {
    $id_producto = $_POST['id_producto'];
    $estatus = $_POST['estatus'];

    // Alternar estatus
    if ($estatus == 'A') {
        $estatus = 'I';
    } else {
        $estatus = 'A';
    }

    // Primera consulta: actualizar el estatus de la categoría
    $sql = "UPDATE tipo_producto SET estatus = ? WHERE id_tipo_producto = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $estatus, $id_producto);

    if ($stmt->execute()) {
        // Segunda consulta: actualizar todos los productos de esa categoría
        $sql2 = "UPDATE productos SET estatus = ? WHERE tipo_producto = ?";
        $stmt2 = $conn->prepare($sql2);
        $stmt2->bind_param("ss", $estatus, $id_producto);

        if ($stmt2->execute()) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['error'] = "Error en productos: " . $stmt2->error;
        }

        $stmt2->close();
    } else {
        $response['success'] = false;
        $response['error'] = "Error en categoría: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
    echo json_encode($response);
} else if ($action == "usuarios") {
    $id_producto = $_POST['id_producto'];
    $estatus = $_POST['estatus'];

    if ($estatus == 'A') {
        $estatus = 'I';
    } else {
        $estatus = 'A';
    }

    $sql = "UPDATE usuarios SET estatus = ? WHERE id_usu = ? ";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $estatus, $id_producto);

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