<?php 

//error_reporting(E_ALL);
//ini_set('display_errors', 1);

require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$label = $json['label'];
$idCGroup = $json['id'];
$zApiIdInstancia = $json['zApiIdInstancia'];
$zApiTokenInstancia = $json['zApiTokenInstancia'];
$zApiSecret = $json['zApiSecret'];
$orderNumber = abs($json['orderNumber']);

validate([
   $label,
   $idCGroup,
   $zApiIdInstancia,
   $zApiTokenInstancia,
   $zApiSecret,
   $orderNumber
]);

$status = verificaStatusZApi($zApiIdInstancia,$zApiTokenInstancia,$zApiSecret);
if($status['error']) error('A instância é inválida');

if($status['ok'] != true) {
    error('Instância não conectada com o Whatsapp ou sem conexão com a internet');
};

$idInstance = getUUID();

$sql = "INSERT INTO instances(
    idInstance,
    idCGroup,
    label,
    zApiIdInstancia,
    zApiTokenInstancia,
    zApiSecret,
    orderNumber
) VALUES(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
);";

$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "ssssssi", 
        $idInstance,
        $idCGroup,
        $label,
        $zApiIdInstancia,
        $zApiTokenInstancia,
        $zApiSecret,
        $orderNumber
    );
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar cadastro', 'debug' => mysqli_error($db)]));
    }

} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar cadastro', 'debug' => mysqli_error($db)]));
}

success();

?>