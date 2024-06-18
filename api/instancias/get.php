<?php 
/*
//error_reporting(E_ALL);
//ini_set('display_errors', 1);*/
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');

////////////
$idInstance = mysqli_real_escape_string($db,$_GET['id']);

$sql = "SELECT * FROM instances WHERE idInstance = '{$idInstance}';";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);

die(json_encode($row, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>