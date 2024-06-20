<?php 
//error_reporting(E_ALL);
//ini_set('display_errors', 1);
require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
require_once(__DIR__ . '/webhook-config.php');

$req = $json;

$zApiIdInstancia = mysqli_real_escape_string($db,$req['instanceId']);

validate([
    $zApiIdInstancia
]);

$sql = "SELECT 
    cg.idCGroup,
    cg.idInstance,

    i.zApiTokenInstancia,
    i.zApiSecret

    FROM cGroups cg 
    INNER JOIN instances i USING(idInstance)
    WHERE i.zApiIdInstancia = '{$zApiIdInstancia}';
";

if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar grupos comerciais');
if(mysqli_num_rows($result) < 1) error('Nenhum registro para essa instância');
while($row = mysqli_fetch_assoc($result)){
    $idCGroup = $row['idCGroup'];

    $zApiTokenInstancia = $row['zApiTokenInstancia'];
    $zApiSecret         = $row['zApiSecret'];

    atualizarWebhookZApiReceber($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret,true);
    atualizarWebhookZApiDesconectar($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret,true);

    // buscar a próxima instancia
    $sql = "SELECT * FROM instances WHERE idCGroup = '{$idCGroup}' ORDER BY orderNumber ASC;";
    if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar instancias');

    while($row = mysqli_fetch_assoc($result)){
        $zApiIdInstancia    = $row['zApiIdInstancia'];
        $zApiTokenInstancia = $row['zApiTokenInstancia'];
        $zApiSecret         = $row['zApiSecret'];
        $idInstance         = $row['idInstance'];

        $status = verificaStatusZApi($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
        if($status['error']) continue;
        if($status['ok'] != true) continue;

        $sql = "UPDATE cGroups SET idInstance = '{$idInstance}' WHERE idCGroup = '{$idCGroup}';";
        if(!$result = mysqli_query($db,$sql)) error('Falha ao definir instancia no Grupo Comercial');

        atualizarWebhookZApiReceber($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
        atualizarWebhookZApiDesconectar($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
        break;
    }

}