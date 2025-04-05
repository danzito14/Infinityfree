<?php
$servername = "sql109.infinityfree.com"; // Reemplaza con el host de InfinityFree
$username = "if0_38246893"; // Tu usuario de BD
$password = "Incineroar727"; // Tu contraseña de BD
$database = "if0_38246893_db_gpdog"; // Nombre de la BD

// Crear conexión
$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die(json_encode(["error" => "Conexión fallida: " . $conn->connect_error]));
}

?>