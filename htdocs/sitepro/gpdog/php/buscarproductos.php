<?php
header("Content-Type: application/json");
include 'conexion_bd.php';


function buscar_productos_por_clase($clase)
{
    global $conn;

    $stmt = $conn->prepare("SELECT * FROM productos WHERE tipo_producto = ?");
    $stmt->bind_param("s", $clase);
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

function buscar_productos_por_texto($texto)
{

    global $conn;
    $stmt = $conn->prepare("SELECT * FROM productos WHERE nombre LIKE ?");
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


function buscar_productos_por_precio($preciomin, $preciomax)
{

    global $conn;
    $stmt = $conn->prepare("SELECT * FROM productos WHERE precio_venta > ? and precio_venta < ?");
    $stmt->bind_param("ss", $preciomin, $preciomax);
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

    if ($accion === "buscarPorTexto" && isset($_GET['query'])) {
        buscar_productos_por_texto($_GET['query']);
    } elseif ($accion === "clase" && isset($_GET['clase'])) {
        buscar_productos_por_clase($_GET['clase']);
    } elseif ($accion === "buscarporprecio" && isset($_GET['preciomin'], $_GET['preciomax'])) {
        buscar_productos_por_precio($_GET['preciomin'], $_GET['preciomax']);
    } else {
        echo json_encode(["error" => "Parámetros incorrectos"]);
    }
}

?>