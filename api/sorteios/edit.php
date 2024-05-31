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

$idRaffle = mysqli_real_escape_string($db,$json['id']);
$status = strval($json['status']);
$raffleDate = empty($json['raffleDate']) ? null : $json['raffleDate'];
$buyLimit = $json['buyLimit'];
$instructions = $json['instructions'];
$footer = $json['footer'];
$resultLink = $json['resultLink'];
$percentageNotify = $json['percentageNotify'];
$flatNotify = $json['flatNotify'];

if($raffleDate != null){
    $raffleDate = explode('/',$raffleDate);
    if(count($raffleDate) < 3){
        http_response_code(400);
        die();
    } 
    $raffleDate = "{$raffleDate[2]}/{$raffleDate[1]}/{$raffleDate[0]}";
}


if ($idRaffle == null || $status == null) {
    http_response_code(400);
    die();
}

$sql = "UPDATE raffles SET 
    raffleDate = ?,
    buyLimit = ?,
    instructions = ?,
    footer = ?,
    resultLink = ?,
    percentageNotify = ?,
    flatNotify = ?
WHERE idRaffle = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sissiiis", $raffleDate, $buyLimit, $instructions, $footer, $resultLink, $percentageNotify, $flatNotify, $idRaffle);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
}

// busca id do grupo
$sql = "SELECT idGroup FROM raffles WHERE idRaffle = '{$idRaffle}'";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$idGroup = $row['idGroup'];

// busca se tem outros ativos
$sql = "SELECT idRaffle FROM raffles WHERE status = 1 AND idGroup = '{$idGroup}' AND idRaffle != '{$idRaffle}'";
$result = mysqli_query($db,$sql);
$rafflesActive = mysqli_num_rows($result);
if($status == 1){
    // verifica se há outros sorteios ativos
    if($rafflesActive > 0 ){
        http_response_code(200);
        die('rafflesActive: '. $rafflesActive);
    }

    // verifica se tem prêmios registrados
    $sql = "SELECT idAward FROM awards WHERE idRaffle = '{$idRaffle}';";
    $result = mysqli_query($db,$sql);
    if(mysqli_num_rows($result) < 1){
        http_response_code(200);
        die('Sem prêmios');
    }

    // verifica se já vendeu todos os números
    $sql = "SELECT count(*) as num FROM participants WHERE idRaffle = '{$idRaffle}';";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_assoc($result);
    $participantsNumber = intval($row['num']);

    $sql = "SELECT numbers FROM raffles WHERE idRaffle = '{$idRaffle}';";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_assoc($result);
    $numbers = intval($row['numbers']);

    if($participantsNumber >= $numbers){
        http_response_code(200);
        die('mais participantes: '.$participantsNumber .' ' . $numbers);
    }
}

// ativa/desativa bot grupo
if($rafflesActive == 0){
    if($status == 1){
        $sqlGroup = "UPDATE groups SET botStatus = 1 WHERE idGroup = '{$idGroup}';";
    }else{
        $sqlGroup = "UPDATE groups SET botStatus = 0 WHERE idGroup = '{$idGroup}';";   
    }
    $result = mysqli_query($db,$sqlGroup);
}

// atualiza status do sorteio
$sql = "UPDATE raffles SET status = {$status} WHERE idRaffle = '{$idRaffle}';";
$result = mysqli_query($db,$sql);

http_response_code(200);
die($sqlGroup);

?>