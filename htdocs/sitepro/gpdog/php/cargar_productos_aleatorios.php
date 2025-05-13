<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

function cargarproductos()
{
    global $conn;
    $sql = "SELECT * FROM productos ORDER BY rand() limit 6";
    $result = $conn->query($sql);

    $datos = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $datos[] = $row;
        }
    }

    echo json_encode($datos);
}

if (isset($_GET['accion']) && $_GET['accion'] === 'cargarproductos') {
    cargarproductos();
}

?>