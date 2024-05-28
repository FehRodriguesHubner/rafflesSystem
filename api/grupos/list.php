<?php 
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
////////////

if(empty($_GET['id'])) {
    http_response_code(400); 
    die();
}

$idStore = mysqli_real_escape_string($db,$_GET['id']);

$sql = "SELECT * FROM groups WHERE idStore = '{$idStore}';";
$result = mysqli_query($db,$sql);
$rows = [];
while($row = mysqli_fetch_assoc($result) ){
    array_push($rows,$row);
}


////// busca descendência
$sql = "SELECT 
    cGroups.label as cGroupLabel,
    stores.label as label
FROM cGroups
INNER JOIN stores USING (idCGroup)
WHERE stores.idStore = '{$idStore}';";

$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$tree = "{$row['cGroupLabel']} / {$row['label']} / Grupos";
//////////////

die(json_encode([
    'results' => $rows,
    'tree' => $tree
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>