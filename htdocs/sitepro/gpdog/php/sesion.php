<?php
session_start();
if (isset($_SESSION['user_id'])) {
    echo json_encode([
        "logueado" => true,
        "user_id" => $_SESSION['user_id'],
        "username" => $_SESSION['username'],
        "nvl_usuario" => $_SESSION['nvl_usuario']
    ]);
} else {
    echo json_encode(["logueado" => false]);
}
?>