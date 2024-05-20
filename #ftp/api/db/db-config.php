<?php
// Configurações do banco de dados
$host = "localhost"; // Host do servidor MySQL
$usuario = "neodev_whatsapp"; // Nome de usuário do MySQL
$senha = "PO@Sb}M.h+@r"; // Senha do MySQL
$banco = "neodev_whatsapp"; // Nome do banco de dados

// Criando uma conexão com o MySQL usando a extensão MySQLi
$db = new mysqli($host, $usuario, $senha, $banco);

// Verificando se a conexão foi estabelecida com sucesso
if ($db->connect_error) {
    die("Falha na conexão: " . $db->connect_error);
}

// Definindo o conjunto de caracteres para utf8 (opcional)
$db->set_charset("utf8");

?>
