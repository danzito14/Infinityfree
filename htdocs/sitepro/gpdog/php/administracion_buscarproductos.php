<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';


function buscar_productos_por_texto($texto, $columna)
{

    global $conn;
    $columnas_permitidas = ['id_producto', 'estatus', 'tipo_producto', 'nombre', 'descripcion', 'cantidad_act', 'cantidad_min', 'cantidad_max', 'precio_compra', 'precio_venta'];
    if (!in_array($columna, $columnas_permitidas)) {
        echo json_encode(["error" => "Columna no permitida"]);
        return;
    }
    $stmt = $conn->prepare("SELECT
    p.id_producto AS 'ID',
    CASE
        WHEN p.estatus = 'A' THEN 'Activo'
        WHEN p.estatus = 'I' THEN 'Inactivo'
        ELSE 'Otro'
    END AS 'Estatus',
    tp.descripcion AS 'Tipo de Producto',
    p.nombre AS 'Nombre',
    p.descripcion AS 'Descripción',
    p.direccion_foto AS 'Foto',
    p.cantidad_act AS 'Cantidad Actual',
    p.cantidad_min AS 'Cantidad Mínima',
    p.cantidad_max AS 'Cantidad Máxima',
    p.precio_compra AS 'Precio de Compra',
    p.precio_venta AS 'Precio de Venta'
FROM 
    productos p
JOIN 
    tipo_producto tp ON p.tipo_producto = tp.id_tipo_producto
WHERE 
   $columna LIKE ?");
    $texto = "%$texto%";
    $stmt->bind_param("s", $texto);
    $stmt->execute();
    $result = $stmt->get_result();

    $productos = [];
    while ($row = $result->fetch_assoc()) {
        $productos[] = $row;
    }

    echo json_encode($productos);
    $stmt->close();
    $conn->close();
}



if (isset($_GET['accion'])) {
    $accion = $_GET['accion'];

    if ($accion === "buscarPorTexto" && isset($_GET['query'], $_GET['columna'])) {
        buscar_productos_por_texto($_GET['query'], $_GET['columna']);
    } else {
        echo json_encode(["error" => "Parámetros incorrectos"]);
    }
}

?>