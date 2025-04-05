<?php
header("Content-Type: application/json");
include 'conexion_bd.php';

$sql = "Select * FROM productos";
$result = $conn->query($sql);

$datos = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }
}

echo json_encode($datos);
$conn->close();
?>