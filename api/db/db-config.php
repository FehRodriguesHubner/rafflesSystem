<?php

// Configurações do banco de dados
$host = $db_host; // Host do servidor MySQL
$usuario = $db_usuario; // Nome de usuário do MySQL
$senha = $db_senha; // Senha do MySQL
$banco = $db_banco;

// Criando uma conexão com o MySQL usando a extensão MySQLi
$db = new mysqli($host, $usuario, $senha, $banco);

// Verificando se a conexão foi estabelecida com sucesso
if ($db->connect_error) {
    die("Falha na conexão: " . $db->connect_error);
}

// Definindo o conjunto de caracteres para utf8 (opcional)
$db->set_charset("utf8mb4");


?>
