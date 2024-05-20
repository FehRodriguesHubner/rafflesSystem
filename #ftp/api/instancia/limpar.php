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

$retorno = executaWpp($ip_wpp,'api/deletar-instancia',[
    "token" => "token1234",
    "id" => $id_user,
    "idCliente" => $id_enterprise,
]);

$message    = 'Ocorreu um erro ao verificar o retorno da solicitação. Por favor, contate o suporte';

$QRurl = null;

$returnInstancia = false;

if(isset($retorno['response'])){
    $returnInstancia = $retorno['response'];    
}

$_SESSION['conectada_instancia'] = false;

http_response_code($retorno['status']);
die(json_encode([
    'instancia' => $returnInstancia
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>