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
$retorno = executaWpp($ip_wpp,'api/listar-contatos',[
    "id" => $id_user,
    "idCliente" => $id_enterprise,
]);

$message = 'Ocorreu um erro ao verificar. Por favor, contate o suporte';

if(isset($retorno['response'])){
    $message = $retorno['response']['message'];  
}

$contatos = $retorno['response']['contatos'];

$num_contatos = $contatos['numContatos'];
$chats = $contatos['contatos'];

$array_chats = [];
foreach($chats as $chat){

    if($chat['isGroup'] == true){
        continue;
    }

    if($chat['isMyContact'] == false){
        continue;
    }

    $name = $chat['name'];
    $telefone = $chat['number'];

    $array_chats[] = [
        'name' => $name,  
        'telefone' => $telefone
    ];

}


http_response_code($retorno['status']);
die(json_encode([
    'num_contatos' => $num_contatos,
    'contatos' => $array_chats,
    'message' => $message
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));
