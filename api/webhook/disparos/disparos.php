<?php

require_once(__DIR__ . '/../webhook-config.php');

$id_disparo = $token_json['id_disparo'];

$finalizar = $json['finalizar'];
$array_disparos = $json['arrayDisparos'];

if(empty($array_disparos)){
    http_response_code(400);
    die();
}

$finalizar = $finalizar == true ? date('Y-m-d H:i') : null;

$json_disparos = json_encode($array_disparos, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);

$sql = "UPDATE pwpp_disparos SET 
    dados_resultado = ?,
    finalizado = ? 
    WHERE id_disparo = ?";
$stmt = mysqli_prepare($db, $sql);

if ($stmt) {
    // Associação de parâmetros
    mysqli_stmt_bind_param($stmt, "sss", $json_disparos, $finalizar, $id_disparo );
    // Execução da consulta
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['message' => 'Erro ao atualizar disparos', 'debug' => mysqli_error($db)]));
    }

} else {
    http_response_code(500);
    die(json_encode(['message' => 'Erro ao inciar atualização de disparos', 'debug' => mysqli_error($db)]));
}

http_response_code(200);
die();