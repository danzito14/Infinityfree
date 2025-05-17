<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
header("Content-Type: application/json; charset=utf-8");
include 'conexion_bd.php';

$action = "";
$action = $_POST['action'] ?? null;
$response = [];
$sql_mas_vendidos = 'SELECT
    p.nombre, 
    SUM(dv.cantidad) AS Cantidad_vendida 
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
GROUP BY dv.id_producto, p.nombre
ORDER BY Cantidad_vendida DESC
LIMIT 5;';

$sql_menos_vendidos = 'SELECT 
    p.nombre, 
    SUM(dv.cantidad) AS Cantidad_vendida
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
GROUP BY dv.id_producto, p.nombre
ORDER BY Cantidad_vendida ASC
LIMIT 5;';

$sql_productos_que_generan_mas_ingresos = 'SELECT p.nombre, p.precio_compra, p.precio_venta, SUM(dv.subtototal) AS Cantidad_vendida
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
GROUP BY dv.id_producto
ORDER BY Cantidad_vendida DESC 
LIMIT 5;';

$sql_productos_que_generan_menos_ingresos = 'SELECT p.nombre, p.precio_compra, p.precio_venta, SUM(dv.subtototal) AS Cantidad_vendida
FROM detalle_ventas dv
JOIN productos p ON dv.id_producto = p.id_producto
GROUP BY dv.id_producto
ORDER BY Cantidad_vendida ASC 
LIMIT 5;';

$sql_clientes_que_compran_mas = 'SELECT vc.id_usuario, u.nombre, u.correo, SUM(dv.cantidad) AS Cantidad_vendida
FROM ventas_cabecera vc
JOIN detalle_ventas dv ON vc.id_venta = dv.id_venta
JOIN usuarios u ON vc.id_usuario = u.id_usu
GROUP BY vc.id_usuario, u.nombre, u.correo
ORDER BY Cantidad_vendida DESC LIMIT 5;';

$sql_clientes_que_generan_mas_ingresos = 'SELECT vc.id_usuario, u.nombre, u.correo, SUM(vc.total) AS Cantidad_vendida
FROM ventas_cabecera vc
JOIN usuarios u ON vc.id_usuario = u.id_usu
GROUP BY vc.id_usuario, u.nombre, u.correo
ORDER BY Cantidad_vendida DESC LIMIT 5;
';

$sql_cargar_ventas_dia = "
    SELECT 
        DATE_FORMAT(vc.fecha, '%d de %M de %Y') AS dia,
        COUNT(*) AS total_ventas,
        SUM(vc.total) AS ingresos
    FROM ventas_cabecera vc
    GROUP BY DATE(vc.fecha)
    ORDER BY DATE(vc.fecha);
";

$sql_cargar_ventas_semana = "
    SELECT 
      YEAR(vc.fecha) AS anio, 
      WEEK(vc.fecha, 1) AS semana, 
      MIN(DATE_FORMAT(vc.fecha, '%d de %M de %Y')) AS inicio_semana,
      COUNT(*) AS total_ventas, 
      SUM(vc.total) AS ingresos
    FROM ventas_cabecera vc
    GROUP BY anio, semana
    ORDER BY anio, semana;
";

$sql_cargar_ventas_mes = "
    SELECT 
      DATE_FORMAT(vc.fecha, '%M de %Y') AS mes,
      COUNT(*) AS total_ventas, 
      SUM(vc.total) AS ingresos
    FROM ventas_cabecera vc
    GROUP BY mes
    ORDER BY STR_TO_DATE(CONCAT('01 ', mes), '%d %M de %Y');
";
switch ($action) {
    case 'productos_mas_vendidos':
        $sql = $sql_mas_vendidos;
        cargar_ventas($sql);
        break;
    case 'productos_menos_vendidos':
        $sql = $sql_menos_vendidos;
        cargar_ventas($sql);
        break;
    case 'productos_que_generan_mas_ingresos':
        cargar_ventas($sql_productos_que_generan_mas_ingresos);
        break;
    case 'productos_que_generan_menos_ingresos':
        cargar_ventas($sql_productos_que_generan_menos_ingresos);
        break;
    case 'clientes_que_compran_mas':
        cargar_ventas($sql_clientes_que_compran_mas);
        break;
    case 'clientes_que_generan_mas_ingresos':
        cargar_ventas($sql_clientes_que_generan_mas_ingresos);
        break;
    case 'cargar_ventas_dia':
        $conn->query("SET lc_time_names = 'es_ES'");
        cargar_ventas($sql_cargar_ventas_dia);
        break;
    case "cargar_ventas_semana":
        $conn->query("SET lc_time_names = 'es_ES'");
        cargar_ventas($sql_cargar_ventas_semana);
        break;
    case "cargar_ventas_mes":
        $conn->query("SET lc_time_names = 'es_ES'");
        cargar_ventas($sql_cargar_ventas_mes);
        break;
    case "cargar_por_fecha":
        $conn->query("SET lc_time_names = 'es_ES'");
        cargar_por_fecha();
        break;
    default:
        echo json_encode(['error' => 'Tipo de reporte inválido']);
        break;
}

function cargar_por_fecha()
{
    global $conn;

    $fecha_inicio = $_POST["fecha_inicio"] ?? null;
    $fecha_final = $_POST["fecha_final"] ?? null;

    if (!$conn) {
        echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
        return;
    }

    $sql = "SELECT 
            DATE_FORMAT(vc.fecha, '%d de %M de %Y') AS dia,
            COUNT(*) AS total_ventas,
            SUM(vc.total) AS ingresos
            FROM ventas_cabecera vc
            WHERE vc.fecha BETWEEN ? AND ?
            GROUP BY DATE(vc.fecha)
            ORDER BY DATE(vc.fecha)";

    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        echo json_encode(['error' => 'Error al preparar la consulta: ' . $conn->error]);
        return;
    }

    $stmt->bind_param("ss", $fecha_inicio, $fecha_final);

    if (!$stmt->execute()) {
        echo json_encode(['error' => 'Error al ejecutar la consulta: ' . $stmt->error]);
        return;
    }

    $result = $stmt->get_result();
    $datos = [];

    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);

}



function cargar_ventas($sql)
{
    global $conn;

    if (!$conn) {
        echo json_encode(['error' => 'No se pudo conectar a la base de datos']);
        return;
    }

    $result = $conn->query($sql);

    if (!$result) {
        echo json_encode(['error' => 'Error en la consulta: ' . $conn->error]);
        return;
    }

    $datos = [];

    while ($row = $result->fetch_assoc()) {
        $datos[] = $row;
    }

    echo json_encode($datos);
}

?>