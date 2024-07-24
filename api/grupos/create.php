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

$idStore = mysqli_real_escape_string($db,$json['id']);
$label = $json['label'];
$link = $json['link'];
$botStatus = "0";
$status = strval($json['status']);
$adminPhones = $json['adminPhones'];
$triggerMessage = $json['triggerMessage'];
$redirectLink = $json['redirectLink'];


$GC = buscarGCPorLoja($idStore);
$idInstance = $GC['idInstance'];
$instance = buscaDadosInstancia($idInstance);
if($instance['idInstance'] == null) error('Instância não encontrada');

$zApiIdInstancia = $instance['zApiIdInstancia'];
$zApiTokenInstancia = $instance['zApiTokenInstancia'];
$zApiSecret = $instance['zApiSecret'];

$dadosGrupo = capturaDadosGrupoZApi($link,$zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
$phoneId = $dadosGrupo['phone'];

$idGroup = getUUID();

if ($idGroup == null || $label == null || $phoneId == null || $link == null || $status == null) {
    error(['message'=>'Dados insuficiêntes. Contate o suporte'],400);
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