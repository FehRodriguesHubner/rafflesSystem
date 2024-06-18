<?php

function success($response = null,$status = 200){
    http_response_code($status);

    if($response === null){
        $response = ['success' => true];
    }else 
    if(is_string($response)){
        $response = ['success' => true, 'message' => $response];
    } else
    if(is_array($response)){
        $response['success'] = true;
    }else{
        die();
    }

    die(json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

}

function error($response = null,$status = 500){
    global $db;
    http_response_code($status);

    if($response === null){
        $response = ['error' => true, 'dbError' => mysqli_error($db)];

    }else if(is_string($response)){
        $response = ['error' => true, 'message' => $response, 'dbError' => mysqli_error($db)];

    } else if(is_array($response)){
        $response['error'] = true;

    }else{
        die($response);
    }

    die(json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));

}

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


function sendZAPIReq($payload,$encode = true)
{
    global $messageEndpoint, $clientToken;
    
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

function sendReq($endpoint,$payload, $method = "POST", $timeout = 10, $headersArray = [])
{

    $url = $endpoint;
    
    
    $ch = curl_init($url);
    
    if($payload != null){
        $data = $payload;
        $jsonData = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $jsonData);
    }
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT_MS, ($timeout * 1000));

    array_push($headersArray,"Content-Type: application/json");
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headersArray);

    $response = curl_exec($ch);

    if ($response === false) {
        return [
            'status' => 200,
            'response' => [
                'message' => "Confira a reserva na listagem de participantes"
            ]
        ];
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

function montaListaGrupo($phoneId,$rowRaffle = null){
    global $db;

    // busca grupo
    $row = buscaGrupo($phoneId);

    $idGroup = $row['idGroup'];
    $labelGroup = $row['label'];
    $idStore = $row['idStore'];
    $showPaymentConfirm = $row['showPaymentConfirm'];

    //busca sorteio ativo
    $row = $rowRaffle === null ? buscaSorteioAtivo($idGroup) : $rowRaffle;
    
    $idRaffle = $row['idRaffle'];
    $numbers = intval($row['numbers']);
    $refCodeRaffle = intval($row['referenceCode']);
    $instructionsRaffle = $row['instructions'];
    $footerRaffle = $row['footer'];
    $price = floatval($row['price']);

    $priceBRL = number_format($price, 2, ',', '.');

    /// CAPTURA REFERENCIA DO SORTEIO
    $row = buscaReferenciaGrupo($idGroup);

    $refCodeGroup = intval($row['cGroupRef']) < 10 ? "0".$row['cGroupRef'] : $row['cGroupRef'];
    $refCodeStore = $row['storeRef'];
    $refCodeStore = intval($row['storeRef']) < 10 ? "0".$row['storeRef'] : $row['storeRef'];
    $referenceRaffle = "{$refCodeGroup}L{$refCodeStore}G{$row['ref']}S" . $refCodeRaffle;

    /// PESQUISA PRÊMIOS
    $awardsString = buscaStringPremios($idRaffle);


    /// CAPTURA INSTRUÇÃO DE PAGAMENTO
    $instructions = "--";
    if($instructionsRaffle == null || trim($instructionsRaffle) == ''){
        /// busca instrução da loja
        $instructions = buscaInstrucaoDaLoja($idStore);

    }else{
        $instructions = $instructionsRaffle;
    }

    /// PESQUISA PARTICIPANTES
    $jsonParticipants = buscaParticipantes($idRaffle);

    $participantsString = buscaStringParticipantes($numbers,$jsonParticipants,$showPaymentConfirm);


    /// CAPTURA FOOTER DE PAGAMENTO
    $footer = "";
    if($footerRaffle == null || trim($footerRaffle) == ''){
        $footer = buscaFooterLoja($idStore);

    }else{
        $footer = $footerRaffle;
    }


    $stringLista = 
    "{$labelGroup}".PHP_EOL.
    "{$referenceRaffle}".PHP_EOL.PHP_EOL.
    "🔥  *VALOR: R$ {$priceBRL} por número.*".PHP_EOL.
    "{$awardsString}".PHP_EOL.
    "{$instructions}".PHP_EOL.
    PHP_EOL.
    "_*REGRAS NA DESCRIÇÃO DO GRUPO*_".PHP_EOL.
    "{$participantsString}".PHP_EOL.
    PHP_EOL.
    "{$footer}";

    return $stringLista;
}

function buscaSorteioAtivo($idGroup){
    global $db;
    /// PESQUISA POR SORTEIO ATIVO
    $sql = "SELECT idRaffle, numbers, referenceCode, price, instructions, footer, percentageNotify, flatNotify, buyLimit FROM raffles WHERE idGroup = '{$idGroup}' AND `status` = 1;";
    if(!$result = mysqli_query($db,$sql)){
        http_response_code(500);
        die(json_encode(['ref' => 7, 'debug' => mysqli_error($db)]));
    }
    if(mysqli_num_rows($result) < 1) die(json_encode(['ref' => 8]));

    return mysqli_fetch_assoc($result);
}

function buscaGrupo($phoneId){
    global $db;

    /// BUSCA GRUPO
    $sql = "SELECT g.idGroup, g.botStatus, g.status, g.adminPhones, g.label, g.idStore, cg.showPaymentConfirm FROM groups g INNER JOIN stores s USING(idStore) INNER JOIN cGroups cg USING(idCGroup) WHERE g.phoneId = '{$phoneId}';";
    if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar grupo');
    if(mysqli_num_rows($result) < 1) error('Grupo não encontrado');
    return mysqli_fetch_assoc($result);

}

function buscaReferenciaGrupo($idGroup){
    global $db;

    $sql = "SELECT 
    cGroups.label as cGroupLabel,
    cGroups.referenceCode as cGroupRef,

    stores.label as storeLabel,
    stores.referenceCode as storeRef,

    groups.label as label,
    groups.referenceCode as ref

    FROM cGroups
    INNER JOIN stores USING (idCGroup)
    INNER JOIN groups USING (idStore)
    WHERE groups.idGroup = '{$idGroup}';";

    if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar referências do grupo');

    return mysqli_fetch_assoc($result);

}

function buscaStringPremios($idRaffle){
    global $db;

    $awardsString = '';
    $sql = "SELECT description, referenceCode FROM awards WHERE idRaffle = '{$idRaffle}' ORDER BY referenceCode ASC;";
    if(!$result = mysqli_query($db,$sql)){
        error('Falha ao buscar prêmios');
    }
    if(mysqli_num_rows($result) < 1) error('Nenhum prêmio cadastrado');

    while($row = mysqli_fetch_assoc($result)){
        $awardsString .= PHP_EOL ."*{$row['referenceCode']}º Prêmio:*". PHP_EOL ."{$row['description']}" . PHP_EOL;
    }

    return $awardsString;
}
function buscaInstrucaoDaLoja($idStore){
    global $db;

    $sql = "SELECT instructions FROM stores WHERE idStore = '{$idStore}';";
    if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar instruções da loja');

    if(mysqli_num_rows($result) < 1) return '*--*';

    $row = mysqli_fetch_assoc($result);
    $instructions = $row['instructions'];

    return $instructions;
}
function buscaParticipantes($idRaffle){
    global $db;

    $jsonParticipants = [];
    $sql = "SELECT name, paid, drawnNumber, phoneId FROM participants WHERE idRaffle = '{$idRaffle}' ORDER BY drawnNumber ASC;";
    if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar participantes');

    while($row = mysqli_fetch_assoc($result)){
        $jsonParticipants[strval($row['drawnNumber'])] = $row;
    }

    return $jsonParticipants;
}
function buscaFooterLoja($idStore){
    global $db;

    /// busca instrução da loja
    $sql = "SELECT footer FROM stores WHERE idStore = '{$idStore}';";
    if(!$result = mysqli_query($db,$sql)) error('Falha ao buscar rodapé da loja');

    if(mysqli_num_rows($result) < 1) return '*--*';
    $row = mysqli_fetch_assoc($result);

    return $row['footer'];
}

function buscaUltimosNumeros($numbers,$jsonParticipants){
    $lastNumbersString = "";
    for( $index = 1; $index <= $numbers; $index++){
        $drawnNumber = $index < 10 ? "0{$index}" : $index;
        if(!isset($jsonParticipants[strval($index)])){
            $lastNumbersString .= $drawnNumber . PHP_EOL ;
        }
    }
    return $lastNumbersString;
}

function buscaStringParticipantes($numbers,$jsonParticipants,$showPaymentConfirm = 0){
    
    $participantsString = "";
    for( $index = 1; $index <= $numbers; $index++){
        $drawnNumber = $index < 10 ? "0{$index}" : $index;
        $participantsString .= PHP_EOL ."{$drawnNumber} - ";
        if(isset($jsonParticipants[strval($index)])){
            $participant = $jsonParticipants[strval($index)];
            $participantName = explode(' ',$participant['name'])[0];
            $participantPhone = substr($participant['phoneId'],-4);
            $confirmPayment = "";
            if($showPaymentConfirm == 1){
                $confirmPayment = $participant['paid'] == 1 ? "🟢 " : "🟡 ";
            }
            $participantsString .= "{$confirmPayment}{$participantName} - ..._{$participantPhone}_";
        }
    }
    return $participantsString;
}

function validate($arrayValidate){
    foreach($arrayValidate as $input){
        if($input == null){
            error('Verifique os dados informados e tente novamente.',400);
        }
    }
}