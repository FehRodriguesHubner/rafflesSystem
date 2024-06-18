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

$idRaffle = mysqli_real_escape_string($db,$json['idRaffle']);

/// VALIDA SORTEIO ATIVO
$sql = "SELECT g.phoneId FROM raffles r INNER JOIN groups g USING(idGroup) WHERE g.status = 1 AND r.status = 1 AND g.botStatus = 1 AND r.idRaffle = '{$idRaffle}'";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) < 1){
    http_response_code(403);
    die(json_encode(['message' => 'O Sorteio não está ativo']));
}
$row = mysqli_fetch_assoc($result);
$phoneId = $row['phoneId'];

$listMsg = montaListaGrupo($phoneId);

/// NOVA LISTA
$jsonList = [
    "phone" => "{$phoneId}",
    "message"=> $listMsg
];
$reqResList = sendZAPIReq($jsonList);

success($reqResList['response'],$reqResList['status']);

?>