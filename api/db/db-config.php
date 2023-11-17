<?php
// Configurações do banco de dados
$host = "localhost"; // Host do servidor MySQL
$usuario = "root"; // Nome de usuário do MySQL
$senha = "admin"; // Senha do MySQL
$banco = "wpp_painel"; // Nome do banco de dados

// Criando uma conexão com o MySQL usando a extensão MySQLi
$db = new mysqli($host, $usuario, $senha, $banco);

// Verificando se a conexão foi estabelecida com sucesso
if ($db->connect_error) {
    die("Falha na conexão: " . $db->connect_error);
}

// Definindo o conjunto de caracteres para utf8 (opcional)
$db->set_charset("utf8");

?>
