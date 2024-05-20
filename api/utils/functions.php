<?php

function getUUID(){
    global $db;

    $sql = "SELECT UUID() as id;";
    $result = mysqli_query($db,$sql);
    $row = mysqli_fetch_assoc($result);
    return $row['id'];
}

function capturaSequencial($type,$typeId,$id){
    global $db;
    $sql = "SELECT MAX(referenceCode) as referenceCode FROM {$type} WHERE {$typeId} = '{$id}';";
    $result = mysqli_query($db, $sql);
    if (!$result) {
        return (['success' => false,'message' => 'Erro ao buscar ordenação sequencial', 'debug' => mysqli_error($db)]);
    }

    if(mysqli_num_rows($result) < 1){
        return (['success' => true, 'referenceCode' => 0]);
    }

    $row = mysqli_fetch_assoc($result);

    return (['success' => true, 'referenceCode' => intval($row['referenceCode'])]);
}


function sendZAPIReq($payload,$encode = false)
{
    global $messageEndpoint, $clientToken;
    return true;
    if($messageEndpoint == null){
        return false;
    }

    $url = $messageEndpoint;
    $data = $payload;

    
    $jsonData = $encode ? json_encode($data) : $data;
    $ch = curl_init($url);
    
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "Client-Token: {$clientToken}"
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
