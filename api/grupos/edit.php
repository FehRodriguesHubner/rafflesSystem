<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$idGroup = mysqli_real_escape_string($db,$json['id']);
$label = $json['label'];
$phoneId = mysqli_real_escape_string($db,$json['phoneId']);
$link = $json['link'];
$status = strval($json['status']);
$triggerMessage = $json['triggerMessage'];
$redirectLink = $json['redirectLink'];
$adminPhones = $json['adminPhones'];

if ($idGroup == null || $label == null || $phoneId == null || $link == null || $status == null) {
    http_response_code(400);
    die();
}

$sql = "SELECT idGroup FROM groups WHERE phoneId = '{$phoneId}' AND idGroup != '{$idGroup}';";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) > 0){
    http_response_code(400);
    die(json_encode(['message' => 'Telefone Grupo (Whatsapp ID) já existente']));
}

$sql = "UPDATE groups SET 
    label = ?,
    phoneId = ?,
    link = ?,
    status = ?,
    triggerMessage = ?,
    redirectLink = ?,
    adminPhones = ?
WHERE idGroup = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sssissss", $label, $phoneId, $link, $status, $triggerMessage, $redirectLink, $adminPhones, $idGroup);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
}

if($status == 0){
    $sql = "UPDATE raffles SET status = 0 WHERE idGroup = '{$idGroup}'";
    $result = mysqli_query($db,$sql);
}

http_response_code(200);
die();

?>