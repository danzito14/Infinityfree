<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

function cargar_usuarios()
{
    global $conn;
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
FROM 
    usuarios;
";

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

    if ($accion === "cargar_usuarios") {
        cargar_usuarios();
    } else {
        echo json_encode(["error" => "NO se encuentra ningún dato"]);
    }

    $conn->close();
}
?>