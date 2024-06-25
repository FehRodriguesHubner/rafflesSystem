<?php 
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
require_once(__DIR__ . '/webhook-config.php');

$req = $json;
$affected = 0;

$currentZApiIdInstancia = mysqli_real_escape_string($db,$req['instanceId']);

validate([
    $currentZApiIdInstancia
]);

$sql = "SELECT 
    cg.idCGroup,
    cg.idInstance,

    i.zApiTokenInstancia,
    i.zApiSecret

    FROM cGroups cg 
    INNER JOIN instances i USING(idInstance)
    WHERE i.zApiIdInstancia = '{$currentZApiIdInstancia}';
";

if(!$resultGC = mysqli_query($db,$sql)) error('Falha ao buscar grupos comerciais');

if(mysqli_num_rows($resultGC) < 1) error('Nenhum registro para essa instância');

while($row = mysqli_fetch_assoc($resultGC)){
    $idCGroup = $row['idCGroup'];
    $oldZApiTokenInstancia = $row['zApiTokenInstancia'];
    $oldZApiSecret         = $row['zApiSecret'];

    //atualizarWebhookZApiReceber($currentZApiIdInstancia,$oldZApiTokenInstancia,$oldZApiSecret,true);
    //atualizarWebhookZApiDesconectar($currentZApiIdInstancia,$oldZApiTokenInstancia,$oldZApiSecret,true);

    // buscar a próxima instancia
    $sql = "SELECT * FROM instances WHERE idCGroup = '{$idCGroup}' ORDER BY orderNumber ASC;";
    if(!$resultInstance = mysqli_query($db,$sql)) error('Falha ao buscar instancias');
    if(mysqli_num_rows($resultInstance) < 1) continue;

    while($row = mysqli_fetch_assoc($resultInstance)){
        $zApiIdInstancia    = $row['zApiIdInstancia'];
        $zApiTokenInstancia = $row['zApiTokenInstancia'];
        $zApiSecret         = $row['zApiSecret'];
        $idInstance         = $row['idInstance'];

        $status = verificaStatusZApi($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
        if($status['error']) continue;
        if($status['ok'] != true) continue;

        $sql = "UPDATE cGroups SET idInstance = '{$idInstance}' WHERE idCGroup = '{$idCGroup}';";

        if(!$resultUpdate = mysqli_query($db,$sql)) error('Falha ao definir instancia no Grupo Comercial');
        $affected += mysqli_affected_rows($db);
        atualizarWebhookZApiReceber($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
        atualizarWebhookZApiDesconectar($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
        break;
    }

}

success("Concluído ({$affected})");