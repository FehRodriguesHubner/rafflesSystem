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

$retorno = executaWpp(null,'api/consulta-instancia',[
    "token" => "token1234",
    "id" => $id_user,
    "descricao" => "Instância de painel",
    "idCliente" => $id_enterprise,
    "desativar" => true
]);

$message    = 'Ocorreu um erro ao verificar o retorno da solicitação. Por favor, contate o suporte';

$QRurl = null;

$returnInstancia = false;

$_SESSION['conectada_instancia'] = false;

if(isset($retorno['response'])){
    $returnInstancia = $retorno['response']; 
    
    if($returnInstancia['instancia']['auth'] == true){
        $_SESSION['conectada_instancia'] = true;
    }

}

if($retorno['status'] == 0){
    http_response_code(404);
}else{
    http_response_code($retorno['status']);
}

die(json_encode([
    'instancia' => $returnInstancia,
    'status' => $retorno['status'],
    'IP' =>$urlWpp
], JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));

?>