<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../phpmailer/src/PHPMailer.php';
require '../phpmailer/src/SMTP.php';
require '../phpmailer/src/Exception.php';


//Create an instance; passing `true` enables exceptions
$mail = new PHPMailer(true);

try {
    //Agregar datos de servidor de enviio
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;                      //Mostrar mensajes de error, para  desactivarlo pon SMTP::DEBUG_OFF;
    $mail->isSMTP();                                            //Send using SMTP
    $mail->Host = 'smtp.gmail.com';                     //El nombre de nuestro dominio de donde enviamos el correo, si es gmail smtp.gmail.com
    $mail->SMTPAuth = true;                                   //Enable SMTP authentication
    $mail->Username = 'gpdoga58@gmail.com';                     //EL nombre del correo que enviara el correo
    $mail->Password = 'amgu hscd cvqi ihfr';                               //Contraseña
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;            //Enable implicit TLS encryption
    $mail->Port = 465;                                    //TCP port to connect to; use 587 if you have set `SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS`

    //datos de envio y quien lo va a recibir, el que lo envia el mismo correo que lo envia y ponerle un alias
    $mail->setFrom('gpdoga58@gmail.com', 'GPDOG Administracion');

    //correo que va a recibir todo, este es el que estara cambiando al parecer
    $mail->addAddress('carodiazuriel@gmail.com', 'Caro Diaz');     //Add a recipient

    //por si quiero agregarle mas destinatarios
    //$mail->addAddress('ellen@example.com');               //Name is optional
    //$mail->addReplyTo('info@example.com', 'Information');

    //las cobias de respaldo para emisor y receptor
    //$mail->addCC('cc@example.com');
    //$mail->addBCC('bcc@example.com');

    //por si quiero enviarle algun archivo o foto
    //$mail->addAttachment('/var/tmp/file.tar.gz');         //Add attachments
    //$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    //Optional name

    //Contenido si estara en html
    $mail->isHTML(true);
    //Titulo del correo
    $mail->Subject = 'Here is the subject';
    //Cabecera del correo, Tiene que estar en formato html
    $cuerpo = '<h4>It´s Danzito Time';
    $cuerpo .= '<h4>My name is Caro Diaz Uriel Alonso, but if you want, u can call me <b>Danzito</b> </h4>';
    $mail->Body = ($cuerpo);

    $mail->AltBody = 'Hola, soy Goku';

    $mail->setLanguage('es', '../phpmailer/language/phpmailer.lang-es.php');
    $mail->send();
    echo 'Mensaje enviado';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}

?>