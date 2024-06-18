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

$idStore = $json['id'];
$label = $json['label'];
$link = $json['link'];
$botStatus = "0";
$status = strval($json['status']);
$adminPhones = $json['adminPhones'];
$triggerMessage = $json['triggerMessage'];
$redirectLink = $json['redirectLink'];

$endpoint = $groupEndpoint;
$endpoint .= "?url=" . urlencode($link);

$result = sendReq($endpoint,null,'GET',30,["Client-Token: {$clientToken}"]);
if($result['status'] != 200 || $result['response']['error'] != null) error('Falha ao capturar dados do Grupo. Por favor, revise o link informado');
$phoneId = $result['response']['phone'];

if ($idGroup == null || $label == null || $phoneId == null || $link == null || $status == null) {
    error(['message'=>'Dados insuficiêntes. Contate o suporte','debug' => [$result,$endpoint]],400);
}

$sql = "SELECT idGroup FROM groups WHERE phoneId = '{$phoneId}';";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) > 0){
    http_response_code(400);
    die(json_encode(['message' => 'Telefone Grupo (Whatsapp ID) já existente']));
}

$getRefCode = capturaSequencial('groups','idStore',mysqli_real_escape_string($db,$idStore));
if(!$getRefCode['success']){
    http_response_code(400);
    die(json_encode($getRefCode));
}
$referenceCode = $getRefCode['referenceCode'];
$referenceCode++;

$idGroup = getUUID();

$sql = "INSERT INTO groups(
    idGroup,
    idStore,
    label,
    phoneId,
    link,
    botStatus,
    status,
    referenceCode,
    triggerMessage,
    redirectLink,
    adminPhones
) VALUES(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
);";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sssssiiisss", $idGroup, $idStore, $label, $phoneId, $link, $botStatus, $status, $referenceCode, $triggerMessage, $redirectLink, $adminPhones);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar inserção', 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar inserção', 'debug' => mysqli_error($db)]));
}


http_response_code(200);
die();

?>