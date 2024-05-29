<?php 

require_once(__DIR__ . '/../../../config/session-config.php');
require_once(__DIR__ . '/../../../config/https-redirect.php');
if (empty($_SESSION['id_user'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../../db/db-config.php');
require_once(__DIR__ . '/../../utils/functions.php');

/*
//ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
//error_reporting(E_ALL);
*/
$json = file_get_contents('php://input');
$json = json_decode($json,true);


$id_user = $_SESSION['id_user'];

// CAPTURA DADOS PRO TOKEN
$sql = "SELECT id_disparo, dados_disparo, dados_resultado, iniciado, finalizado FROM pwpp_disparos WHERE id_user = '{$id_user}' ORDER BY iniciado DESC;";

if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao buscar registros dos disparos', 'debug' => mysqli_error($db)]));
}

$array_disparos = [];
while($row = mysqli_fetch_assoc($result)){

    $id_disparo = $row['id_disparo'];
    $dados_disparo      = json_decode($row['dados_disparo'], true);
    $dados_resultado    = json_decode($row['dados_resultado'], true);
    if($dados_resultado){
        $progresso = count($dados_resultado);
    }else{
        $progresso = '--';
    }

    $total = count($dados_disparo['lista_envio']);

    $array_disparos[] = [
        'id_disparo' => $id_disparo,
        'iniciado' => date('d/m/Y H:i',strtotime($row['iniciado'])),
        'finalizado' => $row['finalizado'] == null ? '--' : date('d/m/Y H:i',strtotime($row['finalizado'])),
        'execucao' => $row['finalizado'] == null ? true : false,
        'total' => $total,
        'progresso' => $progresso,
        'dados_disparo' => $dados_disparo,
        'dados_resultado' => $dados_resultado
    ]; 

}



http_response_code(200);
die(json_encode([
    'array_disparos' => $array_disparos

], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
