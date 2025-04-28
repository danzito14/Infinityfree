<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = $_POST['action'] ?? null;
$response = [];

if ($action == "producto") {
    $tipo = $_POST['tipo_producto'];
    $nombre = $_POST['nombre_producto'];
    $desc = $_POST['descripcion_producto'];
    $cantidad_actual = $_POST['cantidad_actual'];
    $cantidad_minima = $_POST['cantidad_minima'];
    $cantidad_maxima = $_POST['cantidad_maxima'];
    $precio_compra = $_POST['precio_compra'];
    $precio_venta = $_POST['precio_venta'];
    $estatus = $_POST['estatus'];
    $id = $_POST['id'];

    $carpeta_destino = "../gallery/GPDog Logos/img/productos/GPS/";
    $ruta_final = "";

    if (isset($_FILES['foto_producto']) && $_FILES['foto_producto']['error'] === UPLOAD_ERR_OK) {
        // Se subió nueva imagen
        $foto_nombre = $_FILES['foto_producto']['name'];
        $foto_tmp = $_FILES['foto_producto']['tmp_name'];

        if (!is_dir($carpeta_destino)) {
            mkdir($carpeta_destino, 0777, true);
        }

        $ruta_final = $carpeta_destino . basename($foto_nombre);
        move_uploaded_file($foto_tmp, $ruta_final);
    } else {
        // No se subió nueva imagen, usar la actual
        $ruta_final = $_POST['imagen_actual'] ?? "";
    }

    $sql = "UPDATE productos SET estatus = ?, nombre= ?, tipo_producto= ?, precio_compra= ?, precio_venta= ?, descripcion= ?, direccion_foto= ?, cantidad_min= ?, cantidad_max= ?, cantidad_act= ? WHERE id_producto = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sssssssssss", $estatus, $nombre, $tipo, $precio_compra, $precio_venta, $desc, $ruta_final, $cantidad_minima, $cantidad_maxima, $cantidad_actual, $id);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto actualizado correctamente"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
} elseif ($action == "categoria") {
    $nombre = $_POST['nombre_categoria'];
    $estatus = $_POST['estatus'];
    $id = $_POST['id'];


    $sql = "UPDATE tipo_producto SET estatus = ?, descripcion = ? WHERE id_tipo_producto = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("sss", $estatus, $nombre, $id);

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