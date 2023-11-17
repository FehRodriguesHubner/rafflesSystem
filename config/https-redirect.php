<?php

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

/*
$cdn = $protocol . 'whatsapp.neo-e.dev.br/';
$url = $protocol . 'whatsapp.neo-e.dev.br/';
*/


$cdn = $protocol . 'localhost/wpp-painel/';
$url = $protocol . 'localhost/wpp-painel/';


// if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] == "off" || strpos($_SERVER['HTTP_HOST'], 'www.') !== false) {

//   $redirect = 'https://' . str_replace('www.', '', $_SERVER['HTTP_HOST']) . $_SERVER['REQUEST_URI'];

//   header('HTTP/1.1 301 Moved Permanently');
//   header('Location: ' . $redirect);

//   exit();

// }