<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = $_POST['action'] ?? null;
$response = [];

if ($action == "agregar_al_carrito") {
    $id_producto = $_POST['id_producto'];
    $id_usuario = $_POST['id_usuario'];

    $sql = "INSERT INTO carrito_de_compra (id_pedido, estatus, id_usuario, id_producto, cantidad)
VALUES (NULL, 'A', ?, ?, 1)
ON DUPLICATE KEY UPDATE
cantidad = cantidad + 1;
";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $id_usuario, $id_producto);

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
    }

    $stmt->close();
    $conn->close();
    echo json_encode($response);

} elseif ($action == "cargar_carrito") {
    $id_usuario = $_POST['id_usuario'];

    $sql = "SELECT 
                c.id_pedido,
                c.id_producto,
                p.nombre AS Producto,
                p.descripcion AS Descripcion,
                c.cantidad AS Cantidad,
                p.precio_venta AS Precio,
                p.direccion_foto,
                (c.cantidad * p.precio_venta) AS Subtotal
            FROM 
                carrito_de_compra c
            JOIN 
                productos p ON c.id_producto = p.id_producto
            WHERE 
                p.estatus = 'A' AND c.id_usuario = ?";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }

    $response['success'] = true;
    $response['carrito'] = $datos;

    $stmt->close();
    $conn->close();
    echo json_encode($response);
} else if ($action == "sumar_carrito") {
    $id_producto = $_POST['id_producto'];
    $id_usuario = $_POST['id_usuario'];

    // 1. Verificar cantidad actual en el carrito
    $sql = "SELECT cantidad FROM carrito_de_compra WHERE id_usuario = ? AND id_producto = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $id_usuario, $id_producto);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close();

    if ($row) {
        $cantidad_actual = $row['cantidad'];
        $nueva_cantidad = $cantidad_actual + 1;

        // 2. Obtener stock disponible del producto
        $sql_stock = "SELECT cantidad_act FROM productos WHERE id_producto = ?";
        $stmt = $conn->prepare($sql_stock);
        $stmt->bind_param("s", $id_producto);
        $stmt->execute();
        $result_stock = $stmt->get_result();
        $producto = $result_stock->fetch_assoc();
        $stmt->close();

        if ($producto && $nueva_cantidad <= $producto['cantidad_disponible']) {
            // 3. Actualizar cantidad en el carrito
            $sql_update = "UPDATE carrito_de_compra SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?";
            $stmt = $conn->prepare($sql_update);
            $stmt->bind_param("iss", $nueva_cantidad, $id_usuario, $id_producto);

            if ($stmt->execute()) {
                $response['success'] = true;
            } else {
                $response['success'] = false;
                $response['error'] = $stmt->error;
            }
            $stmt->close();
        } else {
            $response['success'] = false;
            $response['error'] = "No hay suficiente stock disponible.";
        }
    } else {
        $response['success'] = false;
        $response['error'] = "Producto no encontrado en el carrito.";
    }

    $conn->close();
    echo json_encode($response);
} else if ($action == "restar_carrito") {
    $id_producto = $_POST['id_producto'];
    $id_usuario = $_POST['id_usuario'];

    $sql = "SELECT cantidad FROM carrito_de_compra WHERE id_usuario = ? AND id_producto = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ss", $id_usuario, $id_producto);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $stmt->close(); // <-- cerrar antes de reutilizar

    if ($row) {
        $cantidad_actual = $row['cantidad'];
        $nueva_cantidad = $cantidad_actual - 1;

        if ($nueva_cantidad == 0) {
            $sql_update = "DELETE FROM carrito_de_compra WHERE id_usuario = ? AND id_producto = ?";
            $stmt = $conn->prepare($sql_update);
            $stmt->bind_param("ss", $id_usuario, $id_producto);

            if ($stmt->execute()) {
                $response['success'] = true;
            } else {
                $response['success'] = false;
                $response['error'] = $stmt->error;
            }
            $stmt->close();
        } else {
            $sql_update = "UPDATE carrito_de_compra SET cantidad = ? WHERE id_usuario = ? AND id_producto = ?";
            $stmt = $conn->prepare($sql_update);
            $stmt->bind_param("iss", $nueva_cantidad, $id_usuario, $id_producto);

            if ($stmt->execute()) {
                $response['success'] = true;
            } else {
                $response['success'] = false;
                $response['error'] = $stmt->error;
            }
            $stmt->close();
        }
    } else {
        $response['success'] = false;
        $response['error'] = "Producto no encontrado en el carrito.";
    }

    $conn->close();
    echo json_encode($response);
} else if ($action == "eliminar_carrito") {
    $id_producto = $_POST['id_producto'];
    $id_usuario = $_POST['id_usuario'];


    $sql_update = "DELETE FROM carrito_de_compra WHERE id_usuario = ? AND id_producto = ?";
    $stmt = $conn->prepare($sql_update);
    $stmt->bind_param("ss", $id_usuario, $id_producto);

    if ($stmt->execute()) {
        $response['success'] = true;
    } else {
        $response['success'] = false;
        $response['error'] = $stmt->error;
    }
    $stmt->close();
    echo json_encode($response);
}
?>