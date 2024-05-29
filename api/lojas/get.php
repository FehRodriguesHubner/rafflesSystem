<?php 
header('Content-Type:text/html; charset=utf-8');
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');


////////////
$idStore = mysqli_real_escape_string($db,$_GET['id']);

$sql = "SELECT * FROM stores WHERE idStore = '{$idStore}';";
$result = mysqli_query($db,$sql);
if(mysqli_num_rows($result) < 1){
    http_response_code(404);
    die(json_encode(['success' => false], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

$row = mysqli_fetch_assoc($result);

die(json_encode($row, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>