<?php 

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$label = $json['label'];
$nameContact = $json['nameContact'];
$numberContact = $json['numberContact'];
$showPaymentConfirm = strval($json['showPaymentConfirm']);

if($label == null){
    http_response_code(400);
    die();
}

$getRefCode = capturaSequencial('cGroups',1,1);
if(!$getRefCode['success']){
    http_response_code(400);
    die(json_encode($getRefCode));
}
$referenceCode = $getRefCode['referenceCode'];
$referenceCode++;

$idCGroup = getUUID();

$sql = "INSERT INTO cGroups(
    label,
    nameContact,
    numberContact,
    idCGroup,
    referenceCode,
    showPaymentConfirm
) VALUES(
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
    mysqli_stmt_bind_param($stmt, "ssssii", $label,$nameContact,$numberContact,$idCGroup,$referenceCode,$showPaymentConfirm);
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