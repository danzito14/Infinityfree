<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

function cargarproductos()
{
    global $conn;
    $sql = "SELECT 
        id_producto AS 'ID',
        estatus AS 'Estatus',
        tipo_producto AS 'Tipo de Producto',
        nombre AS 'Nombre',
        descripcion AS 'Descripción',
        direccion_foto AS 'Foto',
        cantidad_act AS 'Cantidad Actual',
        cantidad_min AS 'Cantidad Mínima',
        cantidad_max AS 'Cantidad Máxima',
        precio_compra AS 'Precio de Compra',
        precio_venta AS 'Precio de Venta'
    FROM 
        productos;"; // No se debe usar una coma después de la última columna

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
        estatus AS 'Estatus',
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