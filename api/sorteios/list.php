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

$idGroup = mysqli_real_escape_string($db,$_GET['id']);

$sql = "SELECT * FROM raffles WHERE idGroup = '{$idGroup}';";
$result = mysqli_query($db,$sql);
$rows = [];
while($row = mysqli_fetch_assoc($result) ){
    array_push($rows,$row);
}

////// busca descendência
$sql = "SELECT 
    cGroups.label as cGroupLabel,
    cGroups.referenceCode as cGroupRef,

    stores.label as storeLabel,
    stores.referenceCode as storeRef,

    groups.label as label,
    groups.referenceCode as ref

FROM cGroups
INNER JOIN stores USING (idCGroup)
INNER JOIN groups USING (idStore)
WHERE groups.idGroup = '{$idGroup}';";

$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$tree = "{$row['cGroupLabel']} - {$row['storeLabel']} - {$row['label']} - Sorteios";
$reference = "GC{$row['cGroupRef']}L{$row['storeRef']}G{$row['ref']}";
//////////////

die(json_encode([
    'results' => $rows,
    'tree' => $tree,
    'reference' => $reference
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>