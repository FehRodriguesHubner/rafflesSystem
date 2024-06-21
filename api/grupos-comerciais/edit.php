<?php 
/*
//error_reporting(E_ALL);
//ini_set('display_errors', 1);*/
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$idCGroup = mysqli_real_escape_string($db,$json['id']);
$label = $json['label'];
$nameContact = $json['nameContact'];
$numberContact = $json['numberContact'];
$showPaymentConfirm = strval($json['showPaymentConfirm']);
$idInstance = $json['idInstance'];

validate([
    $idCGroup,
    $label,
    $idInstance
]);

// valida instância
$instance = buscaDadosInstancia($idInstance);
if($instance['idInstance'] == null) error('Instância não encontrada');

$zApiIdInstancia = $instance['zApiIdInstancia'];
$zApiTokenInstancia = $instance['zApiTokenInstancia'];
$zApiSecret = $instance['zApiSecret'];

$GC = buscarGC($idCGroup);
$oldZApiIdInstancia = $GC['zApiIdInstancia'];
$oldInstance = buscaDadosInstancia($idInstance);

mysqli_begin_transaction($db);


$sql = "UPDATE cGroups SET label = ?, nameContact = ?, numberContact = ?, showPaymentConfirm = ?, idInstance = ? WHERE idCGroup = ?";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sssiss", $label,$nameContact,$numberContact,$showPaymentConfirm,$idInstance,$idCGroup);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
    }

} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
}

$status = verificaStatusZApi($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
if($status['error']) error('Instância inválida');


if($status['ok'] != true) {
    error('Instância não conectada com o Whatsapp ou sem conexão com a internet');
};

if($oldZApiIdInstancia != $zApiIdInstancia){
    $resultRecive       = atualizarWebhookZApiReceber($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
    $resultDesconectar  = atualizarWebhookZApiDesconectar($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
    
    if($oldInstance['idInstance'] != null){
        $instance = buscaDadosInstancia($oldInstance['idInstance']);
        
        $zApiIdInstancia = $instance['zApiIdInstancia'];
        $zApiTokenInstancia = $instance['zApiTokenInstancia'];
        $zApiSecret = $instance['zApiSecret'];

        $resultRecive       = atualizarWebhookZApiReceber($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret,true);
        $resultDesconectar  = atualizarWebhookZApiDesconectar($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret,true);

    }
}

mysqli_commit($db);

success(['message' => 'Atualização do Grupo Comercial concluída!','debug' => ['recive' => $resultRecive , 'desconectar' => $resultDesconectar]]);

?>