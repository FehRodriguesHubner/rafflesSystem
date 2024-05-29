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
$status = strval($json['status']);
$statusAux = 0;
$raffleDate = empty($json['raffleDate']) ? null : $json['raffleDate'];
$numbers = $json['numbers'];
$price = $json['price'];
$buyLimit = $json['buyLimit'];
$instructions = $json['instructions'];
$resultLink = $json['resultLink'];
$percentageNotify = $json['percentageNotify'];
$flatNotify = $json['flatNotify'];

$price = str_replace('.','',$price);
$price = str_replace(',','.',$price);

if ($idGroup == null || $status == null || $numbers == null || $price == null) {
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
    ?
)";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "ssiisisissii", $idRaffle, $idGroup, $statusAux, $numbers, $raffleDate, $referenceCode, $price, $buyLimit, $instructions, $resultLink, $percentageNotify, $flatNotify);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar inserção', 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar inserção', 'debug' => mysqli_error($db)]));
}


// busca se tem outros ativos
if($status == 1){
    $sql = "SELECT idRaffle 
    FROM raffles
    WHERE status = 1 AND idGroup = '{$idGroup}'";
    $result = mysqli_query($db,$sql);

    if(mysqli_num_rows($result) > 0 ){
        http_response_code(200);
        die();
    }

    $sql = "SELECT status 
    FROM groups
    WHERE idGroup = '{$idGroup}' AND status != 1";
    $result = mysqli_query($db,$sql);

    if(mysqli_num_rows($result) > 0 ){
        http_response_code(200);
        die();
    }
    
    $sql = "UPDATE raffles SET status = 1 WHERE idRaffle = '{$idRaffle}';";
    $result = mysqli_query($db,$sql);

}

// ativa/desativa bot grupo
$sql = "SELECT idRaffle 
FROM raffles
WHERE status = 1 AND idGroup = '{$idGroup}'";
$result = mysqli_query($db,$sql);

if(mysqli_num_rows($result) > 0 ){
    $sql = "UPDATE groups SET botStatus = 1 WHERE idGroup = '{$idGroup}';";
}else{
    $sql = "UPDATE groups SET botStatus = 0 WHERE idGroup = '{$idGroup}';";   
}
$result = mysqli_query($db,$sql);


http_response_code(200);
die();

?>