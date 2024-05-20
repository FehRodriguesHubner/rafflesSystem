<?php 

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');

////////////
$idAward = mysqli_real_escape_string($db,$_GET['id']);


$sql = "SELECT idParticipant 
    FROM participants 
    INNER JOIN raffles using (idRaffle)
    INNER JOIN awards using (idRaffle)
    WHERE idAward = '{$idAward}';";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) > 1){
    http_response_code(403);
    die(json_encode(['success' => false,'message' => 'Você não pode excluir um prêmio de um sorteio que haja participantes'], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}


$sql = "DELETE FROM awards WHERE idAward = '{$idAward}';";
try{
    $result = mysqli_query($db,$sql);
}catch(Exception $ex){
    http_response_code(500);
    if(mysqli_errno($db) == 1451){
        http_response_code(403);
    }
    die();
}

die(json_encode(['success' => true], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>