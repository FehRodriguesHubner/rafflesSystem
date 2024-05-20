<?php

require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');

// TOKEN WEBHOOK
$token = $_GET['token'];
$token_json = json_decode(base64_decode($token),true);
$senha     = $token_json['senha'];
$id_user   = $token_json['id_user'];

$sql = "SELECT active FROM users WHERE idUser = '{$id_user}' AND password = '{$senha}';";
$result = mysqli_query($db,$sql);

if(mysqli_num_rows($result) < 1){
    http_response_code(403);
    die();
}


$json = file_get_contents('php://input');
$json = json_decode($json,true);

