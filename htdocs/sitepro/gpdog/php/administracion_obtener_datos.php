<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';
function buscar_producto($idproducto)
{
    global $conn;

    $stmt = $conn->prepare(("SELECT * FROM productos WHERE id_producto = ?"));
    $stmt->bind_param("s", $idproducto);
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

function buscar_categoria($idcategoria)
{
    global $conn;

    $stmt = $conn->prepare(("SELECT * FROM tipo_producto WHERE id_tipo_producto = ?"));
    $stmt->bind_param("s", $idcategoria);
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

    if ($accion === "producto" && isset($_GET['idproducto'])) {
        buscar_producto($_GET['idproducto']);
    } elseif ($accion === "clase" && isset($_GET['idcategoria'])) {
        buscar_categoria($_GET['idcategoria']);
    }
}
?>