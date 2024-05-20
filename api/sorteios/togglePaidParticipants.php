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

$idParticipant = mysqli_real_escape_string($db,$_GET['id']);

if ($idParticipant == null) {
    http_response_code(400);
    die();
}

$sql = "SELECT paid FROM participants WHERE idParticipant = '{$idParticipant}';";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) < 1){
    http_response_code(404);
    die(json_encode(['success' => false], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}
$row = mysqli_fetch_assoc($result);
$paid = intval($row['paid']) == 1 ? 0 : 1; 

$sql = "UPDATE participants SET 
    paid = ?
WHERE idParticipant = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "is",$paid, $idParticipant);
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
die(json_encode(['currentPaid' => $paid]));

?>