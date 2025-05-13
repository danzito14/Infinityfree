<?php
include '../conexion_bd.php';


if (isset($_GET['id']) && isset($_GET['token'])) {
    $id = $_GET['id'];
    $token = $_GET['token'];

    // Verificar si existe el usuario con ese ID y token
    $sql = "SELECT id_usu FROM usuarios WHERE id_usu = ? AND token = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("is", $id, $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $usuario = $result->fetch_assoc();

        if ($usuario['estatus'] === 'A') {
            $html = armar_cuerpo("Cuenta activada", '<h3>Felicitaciones, su cuenta ya ha sido activada, presione el siguiente botón para ir al sitio web e iniciar sesión</h3><br><button onclick="window.location.href=\'../../html/login.html\'" style="width:300px;margin-left:32%;border-radius:5px;"><h3>Llévame al login</h3></button>');
            echo $html;
        } else {
            // Activar cuenta
            $update = $conn->prepare("UPDATE usuarios SET estatus = 'A', token = NULL WHERE id_usu = ?");
            $update->bind_param("i", $id);
            $update->execute();

            $html = armar_cuerpo("Cuenta activada", '<h3>Felicitaciones, su cuenta ya ha sido activada, presione el siguiente botón para ir al sitio web e iniciar sesión</h3><br><button onclick="window.location.href=\'../../html/login.html\'" style="width:300px;margin-left:32%;border-radius:5px;"><h3>Llévame al login</h3></button>');
            echo $html;
        }
    } else {
        $html = armar_cuerpo("Lo sentimos", "<h3>El enlace de activacion para la dicha cuenta ya caduco o fue usado</h3>");
        echo $html;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "Faltan parámetros.";
}

function armar_cuerpo($titulo, $mensaje)
{
    $html = <<<HTML

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GPDog - Tienda</title>
    <link rel="stylesheet" href="../../css/home.css">
    <link rel="icon" href="../gallery/GPDog Logos/ico/Logo.ico" type="image/x-icon">
    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
</head>

<body>
    <header>
        <img src="../../gallery/GPDog Logos/svg/LogoGP.svg" alt="Logo de GPDog" class="icon home-btn">
        <div id="barradebuscar">
        </div>
        <div class="icons">
            
    </div>
    </header>
    <main>

        <div class="products">
            <h1>$titulo</h1><br>
            $mensaje
        </div>
        <style>
            .products{
                margin:auto;
                background-color: rgb(255, 240, 215) ;
                padding: 20px 20px;
                top:0;
                border-radius:5px;
            }
        </style>
    </main>
    <footer>
        <div class="footer-content">
            <div class="footer-left">
                <strong>GPDog</strong>
                <p>Encargado de decirte donde se encuentra tu mascota</p>
                <p>Contando con tienda de productos en línea</p>
            </div>
            <div class="footer-right">
                <p><strong>¿Tienes alguna sugerencia?</strong></p>
                <p>Contáctanos</p>
            </div>
        </div>
    </footer>

</body>
HTML;
    return $html;
}
?>