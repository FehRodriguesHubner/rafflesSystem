<?php 

////error_reporting(E_ALL);
////ini_set('display_errors', 1);

require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['idUser'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

$idCGroup = $json['id'];
$label = $json['label'];
$instructions = $json['instructions'];
$footer = $json['footer'];
$cnpj = $json['cnpj'];
$razaoSocial = $json['razaoSocial'];
$inscricaoEstadual = $json['inscricaoEstadual'];
$endereco = $json['endereco'];
$numero = $json['numero'];
$bairro = $json['bairro'];
$cidade = $json['cidade'];
$uf = $json['uf'];
$cep = $json['cep'];
$nameContact = $json['nameContact'];
$numberContact = $json['numberContact'];

if($label == null || $instructions == null || $idCGroup == null ){
    http_response_code(400);
    die();
}

$getRefCode = capturaSequencial('stores','idCGroup',mysqli_real_escape_string($db,$idCGroup));
if(!$getRefCode['success']){
    http_response_code(400);
    die(json_encode($getRefCode));
}
$referenceCode = $getRefCode['referenceCode'];
$referenceCode++;

$idStore = getUUID();

$sql = "INSERT INTO stores(
    idStore,
    idCGroup,
    referenceCode,
    label,
    instructions,
    footer,
    cnpj,
    razaoSocial,
    inscricaoEstadual,
    endereco,
    numero,
    bairro,
    cidade,
    uf,
    cep,
    nameContact,
    numberContact
) VALUES(
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
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
    mysqli_stmt_bind_param($stmt, "ssissssssssssssss", $idStore, $idCGroup, $referenceCode, $label, $instructions, $footer, $cnpj, $razaoSocial, $inscricaoEstadual, $endereco, $numero, $bairro, $cidade, $uf, $cep, $nameContact, $numberContact);
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
    }

} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao efetuar atualização', 'debug' => mysqli_error($db)]));
}

http_response_code(200);
die();

?>