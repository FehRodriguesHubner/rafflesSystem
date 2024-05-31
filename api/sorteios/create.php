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

$idGroup = mysqli_real_escape_string($db,$json['id']);
$status = 0;
$raffleDate = empty($json['raffleDate']) ? null : $json['raffleDate'];
$numbers = $json['numbers'];
$price = $json['price'];
$buyLimit = $json['buyLimit'];
$instructions = $json['instructions'];
$footer = $json['footer'];
$resultLink = $json['resultLink'];
$percentageNotify = $json['percentageNotify'];
$flatNotify = $json['flatNotify'];

$price = str_replace('.','',$price);
$price = str_replace(',','.',$price);

if ($idGroup == null || $numbers == null || $price == null) {
    http_response_code(400);
    die();
}

if($raffleDate != null){
    $raffleDate = explode('/',$raffleDate);
    if(count($raffleDate) < 3){
        http_response_code(400);
        die();
    } 
    $raffleDate = "{$raffleDate[2]}/{$raffleDate[1]}/{$raffleDate[0]}";
}

$getRefCode = capturaSequencial('raffles','idGroup',mysqli_real_escape_string($db,$idGroup));
if(!$getRefCode['success']){
    http_response_code(400);
    die(json_encode($getRefCode));
}
$referenceCode = $getRefCode['referenceCode'];
$referenceCode++;

$idRaffle = getUUID();

$sql = "INSERT INTO raffles (
    idRaffle,
    idGroup,
    status,
    numbers,
    raffleDate,
    referenceCode,
    price,
    buyLimit,
    instructions,
    footer,
    resultLink,
    percentageNotify,
    flatNotify
) VALUES (
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
    ?,
    ?,
    ?
)";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "ssiisisisssii", $idRaffle, $idGroup, $status, $numbers, $raffleDate, $referenceCode, $price, $buyLimit, $instructions, $footer, $resultLink, $percentageNotify, $flatNotify);
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