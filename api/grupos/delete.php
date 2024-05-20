<?php 

//error_reporting(E_ALL);
//ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');

////////////
$idGroup = mysqli_real_escape_string($db,$_GET['id']);

$sql = "DELETE FROM groups WHERE idGroup = '{$idGroup}';";
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