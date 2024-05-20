<?php

require_once __DIR__ . '/../env.php';

$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off' || $_SERVER['SERVER_PORT'] == 443) ? "https://" : "http://";

$cdn = $protocol . $domain_cdn;
$url = $protocol . $domain_url;

// SSL SECURE
if($ssl_require){
    if (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] == "off" || strpos($_SERVER['HTTP_HOST'], 'www.') !== false) {
    
       $redirect = 'https://' . str_replace('www.', '', $_SERVER['HTTP_HOST']) . $_SERVER['REQUEST_URI'];
    
       header('HTTP/1.1 301 Moved Permanently');
       header('Location: ' . $redirect);
    
       exit();
    
    }
}