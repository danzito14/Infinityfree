<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = $_POST['action'] ?? null;
$response = [];
if ($action == "comprar") {
    $id_usuario = $_POST['id_usuario'];

    // Comenzamos una transacción
    $conn->begin_transaction();

    try {
        // 1. Obtener productos del carrito
        $sql_carrito = "SELECT c.id_producto, c.cantidad, p.precio_venta 
                    FROM carrito_de_compra c 
                    INNER JOIN productos p ON c.id_producto = p.id_producto 
                    WHERE c.id_usuario = ?";
        $stmt = $conn->prepare($sql_carrito);
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("El carrito está vacío.");
        }

        $productos = [];
        $total = 0;

        while ($row = $result->fetch_assoc()) {
            $subtototal = $row['precio_venta'] * $row['cantidad'];
            $total += $subtototal;
            $productos[] = [
                'id_producto' => $row['id_producto'],
                'cantidad' => $row['cantidad'],
                'precio' => $row['precio_venta'],
                'subtototal' => $subtototal
            ];
        }

        // 2. Insertar en ventas_cabecera
        $fecha = date('Y-m-d H:i:s');
        $sql_venta = "INSERT INTO ventas_cabecera (fecha, total, id_usuario) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql_venta);
        $stmt->bind_param("sdi", $fecha, $total, $id_usuario);
        $stmt->execute();
        $id_venta = $stmt->insert_id;

        // 3. Insertar en detalle_ventas
        $sql_detalle = "INSERT INTO detalle_ventas (id_venta, id_producto, precio, cantidad, subtototal) 
                    VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql_detalle);
        foreach ($productos as $producto) {
            $stmt->bind_param("iisid", $id_venta, $producto['id_producto'], $producto['precio'], $producto['cantidad'], $producto['subtototal']);
            $stmt->execute();

            // 4. Actualizar cantidad en productos
            $sql_update = "UPDATE productos SET cantidad_act = cantidad_act - ? WHERE id_producto = ?";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("ii", $producto['cantidad'], $producto['id_producto']);
            $stmt_update->execute();
        }

        // 5. Eliminar del carrito
        $sql_delete = "DELETE FROM carrito_de_compra WHERE id_usuario = ?";
        $stmt = $conn->prepare($sql_delete);
        $stmt->bind_param("i", $id_usuario);
        $stmt->execute();

        // Confirmamos la transacción
        $conn->commit();
        $response['success'] = true;
        $stmt->close();
        $conn->close();
        echo json_encode($response);
    } catch (Exception $e) {
        // Revertimos cambios si hay error
        $conn->rollback();
        $response['success'] = false;
    }
} else if ($action == "comprar_ahora") {
    $id_usuario = $_POST['id_usuario'];
    $id_producto = $_POST['id_producto'];

    // Comenzamos una transacción
    $conn->begin_transaction();

    try {
        // 1. Obtener productos del carrito
        $sql_carrito = "SELECT c.id_producto, c.cantidad, p.precio_venta 
                    FROM carrito_de_compra c 
                    INNER JOIN productos p ON c.id_producto = p.id_producto 
                    WHERE c.id_usuario = ? AND c.id_producto = ?";
        $stmt = $conn->prepare($sql_carrito);
        $stmt->bind_param("ii", $id_usuario, $id_producto);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            throw new Exception("El carrito está vacío.");
        }

        $productos = [];
        $total = 0;

        while ($row = $result->fetch_assoc()) {
            $subtototal = $row['precio_venta'] * $row['cantidad'];
            $total += $subtototal;
            $productos[] = [
                'id_producto' => $row['id_producto'],
                'cantidad' => $row['cantidad'],
                'precio' => $row['precio_venta'],
                'subtototal' => $subtototal
            ];
        }

        // 2. Insertar en ventas_cabecera
        $fecha = date('Y-m-d H:i:s');
        $sql_venta = "INSERT INTO ventas_cabecera (fecha, total, id_usuario) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($sql_venta);
        $stmt->bind_param("sdi", $fecha, $total, $id_usuario);
        $stmt->execute();
        $id_venta = $stmt->insert_id;

        // 3. Insertar en detalle_ventas
        $sql_detalle = "INSERT INTO detalle_ventas (id_venta, id_producto, precio, cantidad, subtototal) 
                    VALUES (?, ?, ?, ?, ?)";
        $stmt = $conn->prepare($sql_detalle);
        foreach ($productos as $producto) {
            $stmt->bind_param("iisid", $id_venta, $producto['id_producto'], $producto['precio'], $producto['cantidad'], $producto['subtototal']);
            $stmt->execute();

            // 4. Actualizar cantidad en productos
            $sql_update = "UPDATE productos SET cantidad_act = cantidad_act - ? WHERE id_producto = ?";
            $stmt_update = $conn->prepare($sql_update);
            $stmt_update->bind_param("ii", $producto['cantidad'], $producto['id_producto']);
            $stmt_update->execute();
        }

        // 5. Eliminar del carrito
        $sql_delete = "DELETE FROM carrito_de_compra WHERE id_usuario = ? AND id_producto = ?";
        $stmt = $conn->prepare($sql_delete);
        $stmt->bind_param("ii", $id_usuario, $id_producto);
        $stmt->execute();

        // Confirmamos la transacción
        $conn->commit();
        $response['success'] = true;
        $stmt->close();
        $conn->close();
        echo json_encode($response);
    } catch (Exception $e) {
        // Revertimos cambios si hay error
        $conn->rollback();
        $response['success'] = false;
    }

}
?>