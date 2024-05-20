<?php

$urlWpp = "http://194.163.141.250:3333";
$secretWpp = "NEO*__FMS-DFG_KKL";

function executaWpp($hostUrl,$endpoint,$payload)
{
    global $urlWpp,$secretWpp;

    if($hostUrl == null){
        $hostUrl = $urlWpp;
    }

    $url = "{$urlWpp}/{$endpoint}";
    $data = $payload;

    $jsonData = json_encode($data);
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "x-secret: {$secretWpp}"
    ));

    $response = curl_exec($ch);

    if ($response === false) {
        echo 'cURL Error: ' . curl_error($ch);
    }

    

    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);
    
    $responseData = json_decode($response, true);

    if ($responseData) {
        return [
            'status' => $httpCode,
            'response' => $responseData
        ];
    } else {
        return [
            'status' => $httpCode,
            'url' => $url,
            'response' => [
                'message' => "Ocorreu um erro ao verificar o retorno da solicitação"
            ]
        ];
    }
}