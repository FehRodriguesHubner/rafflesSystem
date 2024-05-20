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

$idRaffle = mysqli_real_escape_string($db,$json['id']);
$status = strval($json['status']);
$raffleDate = empty($json['raffleDate']) ? null : $json['raffleDate'];
$buyLimit = $json['buyLimit'];
$instructions = $json['instructions'];
$resultLink = $json['resultLink'];
$percentageNotify = $json['percentageNotify'];
$flatNotify = $json['flatNotify'];


if ($idRaffle == null || $status == null) {
    http_response_code(400);
    die();
}

$sql = "UPDATE raffles SET 
    raffleDate = ?,
    buyLimit = ?,
    instructions = ?,
    resultLink = ?,
    percentageNotify = ?,
    flatNotify = ?
WHERE idRaffle = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sisiiis", $raffleDate, $buyLimit, $instructions, $resultLink, $percentageNotify, $flatNotify, $idRaffle);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
}

// busca se tem outros ativos
if($status == 1){
    $sql = "SELECT idRaffle 
    FROM raffles
    WHERE status = 1 AND idGroup = (
        SELECT idGroup FROM raffles WHERE idRaffle = '{$idRaffle}'
    )";
    $result = mysqli_query($db,$sql);

    if(mysqli_num_rows($result) > 0 ){
        http_response_code(200);
        die();
    }

}

$sql = "UPDATE raffles SET status = {$status} WHERE idRaffle = '{$idRaffle}';";
$result = mysqli_query($db,$sql);

http_response_code(200);
die();

?>