<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;


class Enviar_correo
{
    function enviarcorreo($destinatario, $asunto, $cuerpo, $nombre)
    {
        require '../phpmailer/src/PHPMailer.php';
        require '../phpmailer/src/SMTP.php';
        require '../phpmailer/src/Exception.php';

        //Create an instance; passing `true` enables exceptions
        $mail = new PHPMailer(true);

        try {
            //Agregar datos de servidor de enviio
            $mail->SMTPDebug = SMTP::DEBUG_OFF;                      //Mostrar mensajes de error, para  desactivarlo pon SMTP::DEBUG_OFF;
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
            $mail->addAddress($destinatario, $nombre);     //Add a recipient

            //Contenido si estara en html
            $mail->isHTML(true);
            //Titulo del correo
            $mail->Subject = $asunto;
            //Cabecera del correo, Tiene que estar en formato html

            $mail->Body = ($cuerpo);

            $mail->AltBody = $cuerpo;

            $mail->setLanguage('es', '../phpmailer/language/phpmailer.lang-es.php');
            if ($mail->send()) {
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            // echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
            return false;
        }

    }
}
?>