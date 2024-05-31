<?php 
////error_reporting(E_ALL);
////ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$idRaffle = mysqli_real_escape_string($db,$json['id']);
$drawnNumber = $json['drawnNumber'];
$phoneId = $json['phoneId'];
$name = $json['name'];

$phoneId = $json['phoneId'];
$formattedPhoneId = preg_replace('/[^\d]/', '', $phoneId);
if(strlen($formattedPhoneId) < 10 ||strlen($formattedPhoneId) > 11){
    http_response_code(400);
    die(json_encode(['message' => 'Telefone inválido']));
} 
$formattedPhoneId = '55' . $formattedPhoneId;
$phoneId = $formattedPhoneId;

if ($phoneId == null || $drawnNumber == null || $name == null) {
    http_response_code(400);
    die();
}

/// VALIDA NUMERO RESERVADO
$sql = "SELECT idParticipant FROM participants WHERE idRaffle = '{$idRaffle}' and drawnNumber = {$drawnNumber};";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) > 0){
    http_response_code(403);
    die(json_encode(['message' => 'Número já reservado']));
}

/// VALIDA SORTEIO ATIVO
$sql = "SELECT g.phoneId FROM raffles r INNER JOIN groups g USING(idGroup) WHERE g.status = 1 AND r.status = 1 AND g.botStatus = 1 AND r.idRaffle = '{$idRaffle}'";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) < 1){
    http_response_code(403);
    die(json_encode(['message' => 'O Sorteio não está ativo']));
}
$row = mysqli_fetch_assoc($result);
$groupPhoneId = $row['phoneId'];

$retorno = sendReq($url."api/webhook/reservarNumero.php",[
    "phone" => $groupPhoneId,
    "messageId" => "null",
    "participantPhone" => $phoneId,
    "senderName" => $name,
    "text" => [
        "message" => $drawnNumber
    ],
    "isGroup"=> true
]);


http_response_code($retorno['status']);
die(json_encode($retorno));


?>