<?php 
error_reporting(E_ALL);
ini_set('display_errors', 1);
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

$idRaffle = mysqli_real_escape_string($db,$_GET['id']);

$sql = "SELECT * FROM awards WHERE idRaffle = '{$idRaffle}';";
$result = mysqli_query($db,$sql);
$rows = [];
while($row = mysqli_fetch_assoc($result) ){
    array_push($rows,$row);
}

////// busca descendência
$sql = "SELECT 
    cGroups.label as cGroupLabel,
    stores.label as storeLabel,
    groups.label as groupLabel,
    raffles.referenceCode as label
FROM cGroups
INNER JOIN stores USING (idCGroup)
INNER JOIN groups USING (idStore)
INNER JOIN raffles USING (idGroup)
WHERE raffles.idRaffle = '{$idRaffle}';";

$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$tree = "{$row['cGroupLabel']} / {$row['storeLabel']} / {$row['groupLabel']} / S{$row['label']} / Prêmios";
//////////////

die(json_encode([
    'results' => $rows,
    'tree' => $tree
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>