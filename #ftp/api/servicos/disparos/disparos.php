<?php 

require_once(__DIR__ . '/../../../config/session-config.php');
require_once(__DIR__ . '/../../../config/https-redirect.php');
if (empty($_SESSION['id_user'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../../db/db-config.php');
require_once(__DIR__ . '/../../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$id_user = $_SESSION['id_user'];
$id_enterprise = $_SESSION['id_enterprise'];

$lista_envio = $json['lista_envio'];
$conteudo = $json['conteudo'];
$tipo = $json['tipo'];

switch(intval($tipo)){
    case 1:
        $tipo = 'text';
        break;
    case 2:
        $tipo = 'image';
        break;
    case 3:
        $tipo = 'audio';
        break;
}

$array_mensagens = [];
$array_mensagens[] = [
    "tipo" => $tipo,
    "conteudo" => $conteudo
];



$lista_envio_aux = [];

foreach($lista_envio as $envio){
    if($envio['telefone'] != null){
        $lista_envio_aux[] = ["numero" => $envio['telefone']];
    }
}

if(count($lista_envio_aux) < 1){
    http_response_code(400);
    die(json_encode([
        'message' => "Nenhum número encontrado na lista de envio",
    ], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
}

// GERA ID DISPARO
$sql = "SELECT uuid() as id;";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$id_disparo = $row['id'];

$dados_disparo = json_encode([
    'lista_envio' => $lista_envio
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

// INSERE REGISTRO DO DISPARO
$sql = "INSERT INTO pwpp_disparos(
    id_disparo,
    id_user,
    iniciado,
    dados_disparo
) VALUES (
    ?,
    ?,
    current_timestamp(),
    ?
)";
$stmt = mysqli_prepare($db, $sql);

if (!$stmt) {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao formar registro dos disparos', 'debug' => mysqli_error($db)]));
}

// Associação de parâmetros
mysqli_stmt_bind_param($stmt, "sss", $id_disparo, $id_user, $dados_disparo);
// Execução da consulta
if (!mysqli_stmt_execute($stmt)) {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao criar registro dos disparos', 'debug' => mysqli_error($db)]));
}

// CAPTURA DADOS PRO TOKEN
$sql = "SELECT password FROM pwpp_users WHERE id_user = '{$id_user}';";
$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);

// MONTA TOKEN
$token = base64_encode(json_encode([
    "id_user" => $id_user,
    "senha" => $row['password'],
    "id_disparo" => $id_disparo
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

// EXECUTA DISPARO
$retorno = executaWpp($ip_wpp,'api/enviar-disparos-em-massa',[
    "webhookUrl" => "{$url}api/webhook/disparos/disparos.php?token={$token}",
    "id" => $id_user,
    "idCliente" => $id_enterprise,
    "arrayMessages" => $array_mensagens,
    "listaDeEnvios" => $lista_envio_aux
]);

$message    = 'Ocorreu um erro ao verificar o retorno da solicitação. Por favor, contate o suporte';

if(isset($retorno['response'])){
    $message = $retorno['response']['message'];  
}

http_response_code($retorno['status']);
die(json_encode([
    'message' => $message
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
