<?php
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$response = [];
$action = $_POST['action'] ?? null;

if ($action === "guardar_mensaje") {
    $id_usuario = $_POST['id_usuario'] ?? null;
    $asunto = $_POST['asunto'] ?? '';
    $cuerpo = $_POST['cuerpo'] ?? '';
    $hora_enviado = date("Y-m-d H:i:s");

    $sql = "INSERT INTO correos (id_usuario, titulo_correo, cuerpo_correo, leido, enviado)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $leido = 0;
        $stmt->bind_param("sssis", $id_usuario, $asunto, $cuerpo, $leido, $hora_enviado);
        if ($stmt->execute()) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['error'] = $stmt->error;
        }
        $stmt->close();
    } else {
        $response['success'] = false;
        $response['error'] = $conn->error;
    }

    $conn->close();
    echo json_encode($response);
} elseif ($action === "recibir_mensajes") { // ← IMPORTANTE: usa ===, no =
    $sql = "SELECT 
                c.id_correo,
                u.nombre AS Usuario,
                c.titulo_correo AS Asunto,
                LEFT(c.cuerpo_correo, 100) AS Cuerpo,
                c.leido AS Leido,
                DATE_FORMAT(c.enviado, '%d/%m/%Y') AS Fecha
            FROM correos c
            JOIN usuarios u ON u.id_usu = c.id_usuario
            ORDER BY c.enviado DESC"; // para mostrar los más recientes primero

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
        return;
    }

    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }

    $conn->close();
    echo json_encode($datos);
} elseif ($action === "cargar_correo") {
    $id_correo = $_POST['id_correo'] ?? null;

    // Marcar como leído
    $update = $conn->prepare("UPDATE correos SET leido = 1 WHERE id_correo = ?");
    if ($update) {
        $update->bind_param("i", $id_correo);
        $update->execute();
        $update->close();
    }

    // Obtener el correo
    $sql = "SELECT 
                c.id_correo,
                u.nombre AS nombre,
                u.correo as correo,
                c.titulo_correo AS asunto,
                c.cuerpo_correo AS cuerpo
            FROM correos c
            JOIN usuarios u ON u.id_usu = c.id_usuario
            WHERE c.id_correo = ?";

    $stmt = $conn->prepare($sql);

    if ($stmt) {
        $stmt->bind_param("i", $id_correo);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($row = $result->fetch_assoc()) {
            echo json_encode($row);
        } else {
            echo json_encode(['error' => 'Correo no encontrado']);
        }

        $stmt->close();
    } else {
        echo json_encode(['error' => 'Error al preparar la consulta: ' . $conn->error]);
    }
} elseif ($action === "enviar_respuesta") {
    $destinatario = $_POST["destinatario"];
    $asunto = $_POST["asunto"];
    $cuerpo = $_POST["cuerpo"];
    $nombre = $_POST["nombre"];
    require __DIR__ . '/correo/enviar_correo.php';

    $mailer = new Enviar_correo();

    if ($mailer->enviarcorreo($destinatario, $asunto, $cuerpo, $nombre)) {
        echo json_encode(["success" => true]);
        exit;
    } else {
        echo json_encode(["success" => false]);
        exit;
    }
} elseif ($action === "recibir_no_mensajes") { // ← IMPORTANTE: usa ===, no =
    $sql = "SELECT 
                c.id_correo,
                u.nombre AS Usuario,
                c.titulo_correo AS Asunto,
                LEFT(c.cuerpo_correo, 100) AS Cuerpo,
                c.leido AS Leido,
                DATE_FORMAT(c.enviado, '%d/%m/%Y') AS Fecha
            FROM correos c
            JOIN usuarios u ON u.id_usu = c.id_usuario
            WHERE c.leido = 0;"; // para mostrar los más recientes primero

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
        return;
    }

    $datos = [];
    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }

    $conn->close();
    echo json_encode($datos);
} elseif ($action === "borrar_correo") {
    $id_correo = $_POST["id_correo"];
    $sql = "DELETE FROM correos WHERE id_correo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $id_correo);

    if ($stmt->execute()) {
        echo json_encode(["success" => true]);
        exit;

    } else {
        echo json_encode(["success" => false, "message" => $token]);
        exit;
    }

}
?>