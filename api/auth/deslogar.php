<?php
require_once(__DIR__ . '/../../config/session-config.php');
require_once(__DIR__ . '/../../config/https-redirect.php');
if (empty($_SESSION['id_user'])) {http_response_code(401);die();}
require_once(__DIR__ . '/../db/db-config.php');
$json = file_get_contents('php://input');
$json = json_decode($json,true);

session_destroy();

http_response_code(200);
die(json_encode(['message' => 'Deslogado com sucesso']));
