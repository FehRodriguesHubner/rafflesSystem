<?php 

require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['id_user'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$id_user = $_SESSION['id_user'];
$id_enterprise = $_SESSION['id_enterprise'];


$retorno = executaWpp($ip_wpp,'api/criar-instancia',[
    "token" => "token1234",
    "id" => $id_user,
    "descricao" => "Instância de painel",
    "idCliente" => $id_enterprise,
    "desativar" => false
]);

$message    = 'Ocorreu um erro ao verificar o retorno da solicitação. Por favor, contate o suporte';

$QRurl = null;

$returnInstancia = false;

$registrar_instancia = true;

if(isset($retorno['response'])){
    $message = $retorno['response']['message'];
    
    if($retorno['response']['auth'] == true){
        $status = 'ready';
        $registrar_instancia = true;
    }else{
        $status = 'qr';
        $QRurl = $retorno['response']['url'];
        $registrar_instancia = true;
    }        
}


http_response_code($retorno['status']);
die(json_encode([
    'instancia' => $retorno['response'],
    'status' => $status,
    'url' => $QRurl,
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>