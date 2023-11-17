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

// EXECUTA DISPARO
$retorno = executaWpp($ip_wpp,'api/listar-chats',[
    "id" => $id_user,
    "idCliente" => $id_enterprise,
]);

$message = 'Ocorreu um erro ao verificar. Por favor, contate o suporte';

if(isset($retorno['response'])){
    $message = $retorno['response']['message'];  
}

$contatos = $retorno['response']['contatos'];

$num_contatos = $contatos['numChats'];
$chats = $contatos['chats'];

$array_chats = [];
foreach($chats as $chat){

    if($chat['isGroup'] == true){
        continue;
    }

    $name = $chat['name'];
    $telefone = $chat['id']['_serialized'];
    $telefone = explode('@',$telefone)[0];
    $timestamp = $chat['timestamp'];

    $array_chats[] = [
        'data' => date('d/m/Y H:i',$timestamp),
        'timestamp' => $timestamp,  
        'name' => $name,  
        'telefone' => $telefone
    ];

}


http_response_code($retorno['status']);
die(json_encode([
    'num_contatos' => $num_contatos,
    'chats' => $array_chats,
    'message' => $message,
    'ret' => $retorno
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
