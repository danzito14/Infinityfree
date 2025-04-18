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
    $estatus = "A";

    $foto_nombre = $_FILES['foto_producto']['name'];
    $foto_tmp = $_FILES['foto_producto']['tmp_name'];
    $carpeta_destino = "../gallery/GPDog Logos/img/productos/GPS/";

    if (!is_dir($carpeta_destino)) {
        mkdir($carpeta_destino, 0777, true);
    }
    $ruta_final = $carpeta_destino . basename($foto_nombre);
    move_uploaded_file($foto_tmp, $ruta_final);

    $sql = "INSERT INTO productos (estatus, nombre, tipo_producto, precio_compra, precio_venta, descripcion, direccion_foto, cantidad_min, cantidad_max, cantidad_act)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssssssssss", $estatus, $nombre, $tipo, $precio_compra, $precio_venta, $desc, $ruta_final, $cantidad_minima, $cantidad_maxima, $cantidad_actual);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Producto insertado correctamente"]);
    } else {
        echo json_encode(["success" => false, "error" => $stmt->error]);
    }

    $stmt->close();
    $conn->close();
}
?>