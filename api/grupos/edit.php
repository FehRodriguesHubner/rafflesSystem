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

$idGroup = $json['id'];
$label = $json['label'];
$phoneId = $json['phoneId'];
$link = $json['link'];
$botStatus = strval($json['botStatus']);
$status = strval($json['status']);
$triggerMessage = $json['triggerMessage'];
$redirectLink = $json['redirectLink'];

if ($idGroup == null || $label == null || $phoneId == null || $link == null || $botStatus == null || $status == null) {
    http_response_code(400);
    die();
}

$sql = "UPDATE groups SET 
    label = ?,
    phoneId = ?,
    link = ?,
    botStatus = ?,
    status = ?,
    triggerMessage = ?,
    redirectLink = ?
WHERE idGroup = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sssiisss", $label, $phoneId, $link, $botStatus, $status, $triggerMessage, $redirectLink, $idGroup);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
}


http_response_code(200);
die();

?>