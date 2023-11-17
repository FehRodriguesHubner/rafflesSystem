<?php

require_once __DIR__ . '/https-redirect.php';
require_once __DIR__ . '/session-config.php';

date_default_timezone_set('America/Sao_Paulo');

if (empty($_SESSION['id_user'])) {
    header('Location: ' . $url . 'login');
}


