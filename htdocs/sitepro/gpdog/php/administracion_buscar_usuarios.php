<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

function buscar_usuarios_por_columna($texto, $columna)
{
    global $conn;

    // Lista blanca para evitar inyección
    $columnas_permitidas = ['nombre', 'nombre_usuario', 'correo', 'num_tel', 'estatus', 'id_usu', 'nvl_usuario'];
    if (!in_array($columna, $columnas_permitidas)) {
        echo json_encode(["error" => "Columna no permitida"]);
        return;
    }

    // Armar SQL con la columna permitida directamente
    $sql = "SELECT 
        id_usu AS 'ID', 
        CASE 
            WHEN estatus = 'A' THEN 'Activo'
            WHEN estatus = 'I' THEN 'Inactivo'
            WHEN estatus = 'P' THEN 'Pendiente de activar'
            ELSE 'Otro'
        END AS 'Estatus', 
        CASE 
            WHEN nvl_usuario = 2 THEN 'Cliente' 
            WHEN nvl_usuario = 1 THEN 'Administrador' 
            ELSE 'Otro' 
        END AS 'Nvl de usuario', 
        nombre AS 'Nombre', 
        nombre_usuario AS 'Nombre de usuario', 
        correo AS 'Correo', 
        num_tel AS 'Numero de telefono' 
    FROM usuarios 
    WHERE $columna LIKE ?";

    $stmt = $conn->prepare($sql);
    $texto = "%$texto%";
    $stmt->bind_param("s", $texto);
    $stmt->execute();
    $result = $stmt->get_result();

    $usuarios = [];
    while ($row = $result->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode($usuarios);
    $stmt->close();
    $conn->close();
}




if (isset($_GET['accion'])) {
    $accion = $_GET['accion'];

    if ($accion === "buscarPorTexto" && isset($_GET['query'], $_GET['columna'])) {
        buscar_usuarios_por_columna($_GET['query'], $_GET['columna']);
    } else {
        echo json_encode(["error" => "Parámetros incorrectos"]);
    }
}

?>