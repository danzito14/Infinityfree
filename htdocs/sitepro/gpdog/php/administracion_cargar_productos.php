<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

function cargarproductos()
{
    global $conn;
    $sql = "SELECT 
    p.id_producto AS 'ID',
    CASE 
        WHEN p.estatus = 'A' THEN 'Activo'
        WHEN p.estatus = 'I' THEN 'Inactivo'
        WHEN p.estatus = 'P' THEN 'Pendiente de activar'
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
ORDER BY 
    p.id_producto ASC;";

    $result = $conn->query($sql);

    $datos = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }

    echo json_encode($datos);
}

function cargar_categorias()
{
    global $conn;

    $sql = "SELECT 
        id_tipo_producto AS 'ID',
       CASE 
        WHEN estatus = 'A' THEN 'Activo'
        WHEN estatus = 'I' THEN 'Inactivo'
        WHEN estatus = 'P' THEN 'Pendiente de activar'
        ELSE 'Otro'
    END AS 'Estatus', 
        descripcion AS 'Descripción'
    FROM 
        tipo_producto;";
    $result = $conn->query($sql);

    $datos = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }
    echo json_encode($datos);
}

if (isset($_GET['accion'])) {
    $accion = $_GET['accion'];

    if ($accion === "cargarproductos") {
        cargarproductos();
    } elseif ($accion === "cargarcategorias") {
        cargar_categorias();
    } else {
        echo json_encode(["error" => "NO se encuentra ningún dato"]);
    }

    $conn->close();
}
?>