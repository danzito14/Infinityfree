<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

function cargarproductos()
{
    global $conn;
    $sql = "SELECT * FROM productos WHERE estatus = 'A' and cantidad_act > cantidad_min";
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

    $sql = "SELECT * FROM tipo_producto WHERE estatus = 'A'";
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
        echo json_encode(["error" => "NO se encuentra ningun dato"]);
    }

    $conn->close();
}


?>