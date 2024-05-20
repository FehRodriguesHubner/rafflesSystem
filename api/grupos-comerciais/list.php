<?php 

require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

////////////

$sql = "SELECT * FROM cGroups;";
$result = mysqli_query($db,$sql);
$rows = [];
while($row = mysqli_fetch_assoc($result) ){
    array_push($rows,$row);
}

die(json_encode([
    'results' => $rows
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>