<?php
session_start();
require_once 'conexion.php';

$response = array('success' => false);

if (isset($_SESSION['user_id'])) {
    $id_usuario = $_SESSION['user_id'];
    $metodo_entrega = $_POST['metodo_entrega'] ?? '';
    $direccion_id = $_POST['direccion_id'] ?? '';
    $productos = json_decode($_POST['productos'], true);

    if (!empty($productos) && !empty($direccion_id)) {
        $conn->begin_transaction();

        try {
            $query = "INSERT INTO pedidos (id_usuario, id_direccion, metodo_entrega, fecha_pedido) VALUES (?, ?, ?, NOW())";
            $stmt = $conn->prepare($query);
            $stmt->bind_param("iis", $id_usuario, $direccion_id, $metodo_entrega);
            $stmt->execute();

            $pedido_id = $stmt->insert_id;

            foreach ($productos as $producto) {
                $query_detalle = "INSERT INTO detalle_pedidos (id_pedido, nombre_producto, cantidad, precio) VALUES (?, ?, ?, ?)";
                $stmt_detalle = $conn->prepare($query_detalle);
                $stmt_detalle->bind_param("isid", $pedido_id, $producto['nombre'], $producto['cantidad'], $producto['precio']);
                $stmt_detalle->execute();
            }

            $conn->commit();
            $response['success'] = true;
        } catch (Exception $e) {
            $conn->rollback();
            $response['error'] = $e->getMessage();
        }
    } else {
        $response['error'] = 'Datos incompletos';
    }
} else {
    $response['error'] = 'Usuario no logueado';
}

$conn->close();
echo json_encode($response);
?>
