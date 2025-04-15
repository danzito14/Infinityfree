<?php
session_start();

// Eliminar todas las variables de sesión
$_SESSION = array();

// Destruir la sesión
session_destroy();

// Responder en formato JSON
echo json_encode(["logueado" => false]);
?>