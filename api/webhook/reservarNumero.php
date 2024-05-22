<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
require_once(__DIR__ . '/webhook-config.php');

$req = $json;

/// VARIÁVEIS
$phoneId            = mysqli_real_escape_string($db,$req['phone']);
$messageId          = $req['messageId'];

$participantPhoneId = mysqli_real_escape_string($db,$req['participantPhone']);
$senderName         = mysqli_real_escape_string($db,$req['senderName']);
$inputMessage       = $req['text']['message'];

// VALIDA VARIÁVEIS
if(
    empty($phoneId) ||
    empty($messageId) ||
    empty($req['text']) || 
    empty($req['text']['message']) ||
    $req['isGroup'] != true
){
    http_response_code(400);
    die(json_encode(['ref' => 0]));
}

/// BUSCA GRUPO
$sql = "SELECT idGroup, botStatus, status, adminPhones, label, idStore FROM groups WHERE phoneId = '{$phoneId}';";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 1, 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) < 1) die(json_encode(['ref' => 2]));

$row = mysqli_fetch_assoc($result);

$idGroup = $row['idGroup'];
$botStatus = $row['botStatus'];
$statusGroup = $row['status'];
$adminPhones = $row['adminPhones'];
$labelGroup = $row['label'];
$idStore = $row['idStore'];

if($botStatus != 1 || $statusGroup != 1) die(json_encode(['ref' => 3]));

/// VERIFICA SE É UM ADMIN
if($adminPhones != null){
    $adminPhones = explode(',',$adminPhones);
    if(in_array($phoneId,$adminPhones)) die(json_encode(['ref' => 4]));
}

///
//sleep(4);

/// TESTA MENSAGEM INPUTADA (TEXTOMATRIZ)
if(
    count(explode(' ',$inputMessage)) <= 3 &&
    !is_numeric($inputMessage)
){
    // enviando retorno de mensagem incorreta
    $reqRes = sendZAPIReq(
        [
            "phone" => "{$phoneId}",
            "message" =>    "🚫 Digite na mensagem somente o número desejado. _(Ex: *12*)_".PHP_EOL
                            .PHP_EOL.
                            "⚠️ Só 1 número por mensagem.".PHP_EOL.
                            "_Se quiser escolher mais números, envie cada um em uma mensagem separada._".PHP_EOL.
                            "📱 _*Se precisa falar com o suporte, utilize o número que está na descrição do grupo.*_",
            "messageId" => "{$messageId}"
        ]
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 5, 'req' => $reqRes]));
}

if(!is_numeric($inputMessage)){
    http_response_code(400);
    die(json_encode(['ref' => 6]));
}

$chosenNumber = intval($inputMessage);

/// PESQUISA POR SORTEIOS
$sql = "SELECT idRaffle, numbers, referenceCode, price, instructions, percentageNotify, flatNotify, buyLimit FROM raffles WHERE idGroup = '{$idGroup}' AND `status` = 1;";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 7, 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) < 1) die(json_encode(['ref' => 8]));

$row = mysqli_fetch_assoc($result);

$idRaffle = $row['idRaffle'];
$numbers = intval($row['numbers']);
$refCodeRaffle = intval($row['referenceCode']);
$instructionsRaffle = intval($row['instructions']);
$percentageNotify = intval($row['percentageNotify']);
$flatNotify = intval($row['flatNotify']);
$buyLimit = intval($row['buyLimit']);
$price = floatval($row['price']);

$priceBRL = number_format($price, 2, ',', '.');


/// VERIFICA SE NÚMERO ESTÁ FORA DO RANGE
if($chosenNumber > $numbers || $chosenNumber <= 0 ){
    // enviando retorno de mensagem incorreta
    $reqRes = sendZAPIReq(
        [
            "phone" => "{$phoneId}",
            "message" =>    "⚠️ _*Reserva não efetuada! - Número {$chosenNumber}*_".PHP_EOL.
                            "O sorteio atual permite somente números entre 1 e {$numbers}.".PHP_EOL.
                            "Selecione outro número para participar...",
            "messageId"=> "{$messageId}"
        ]
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 9, 'req' => $reqRes]));
}

/// VERIFICA SE NÚMERO JÁ NÃO FOI ESCOLHIDO
$sql = "SELECT drawnNumber FROM participants WHERE idRaffle = '{$idRaffle}' AND drawnNumber = {$chosenNumber};";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 10, 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) > 0){

    $reqRes = sendZAPIReq(
        [
            "phone" => "{$phoneId}",
            "message" =>    "🚫 _*Reserva não efetuada!*_".PHP_EOL.
                            PHP_EOL.
                            "O número *{$chosenNumber}* não está mais disponível.".PHP_EOL.
                            "Selecione outro número para participar...",
            "messageId" => "{$messageId}"
         ]
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 11]));
} 

/// VERIFICA SE JÁ NÃO ATINGIU O LIMITE
if($buyLimit > 0){
    $sql = "SELECT count(*) as num FROM participants WHERE idRaffle = '{$idRaffle}' AND phoneId = '{$participantPhoneId}';";
    if(!$result = mysqli_query($db,$sql)){
        http_response_code(500);
        die(json_encode(['ref' => 11.1, 'debug' => mysqli_error($db)]));
    }
    $row = mysqli_fetch_assoc($result);
    $participantNumbers = intval($row['num']);
    if($participantNumbers >= $buyLimit){
        $reqRes = sendZAPIReq(
            [
                "phone"=> "{$phoneId}",
                "message"=>     "🚫 _*Reserva não efetuada!*_".PHP_EOL.
                                PHP_EOL.
                                "Você não pode efetuar mais de {$buyLimit} reserva(s).",
                "messageId"=> "{$messageId}"
            ]
        );
        
        http_response_code(400);
        die(json_encode(['ref' => 11.2]));
    }
}

/// EFETUA A RESERVA
$idParticipant = getUUID();
$sql = "INSERT INTO participants(
    idParticipant,
    idRaffle,
    phoneId,
    drawnNumber,
    paid,
    name
)VALUES(
    ?,
    ?,
    ?,
    ?,
    0,
    ?
)";
$stmt = mysqli_prepare($db, $sql);
if ($stmt) {
    mysqli_stmt_bind_param($stmt, "sssis",$idParticipant,$idRaffle,$participantPhoneId,$chosenNumber,$senderName);
    if (!mysqli_stmt_execute($stmt)) {
        http_response_code(500);
        die(json_encode(['ref' => 12, 'debug' => mysqli_error($db)]));
    }
} else {
    http_response_code(500);
    die(json_encode(['ref' => 13, 'debug' => mysqli_error($db)]));
}

/// NOTIFICA NÚMERO RESERVADO
$reqResReservado = sendZAPIReq(
    [
        "phone" => "{$phoneId}",
        "message" => "✅ Número *{$chosenNumber}* reservado para você {$senderName}",
        "messageId"=> "{$messageId}"
    ]
);


/// PESQUISA PRÊMIOS
$awardsString = '';
$sql = "SELECT description, referenceCode FROM awards WHERE idRaffle = '{$idRaffle}' ORDER BY referenceCode ASC;";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 14, 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) < 1) die(json_encode(['ref' => 15]));
while($row = mysqli_fetch_assoc($result)){
    $awardsString .= PHP_EOL ."*{$row['referenceCode']}º Prêmio:*". PHP_EOL ." {$row['description']}" . PHP_EOL;
}

/// PESQUISA PARTICIPANTES
$jsonParticipants = [];
$sql = "SELECT name, paid, drawnNumber, phoneId FROM participants WHERE idRaffle = '{$idRaffle}' ORDER BY drawnNumber ASC;";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 16, 'debug' => mysqli_error($db)]));
}

while($row = mysqli_fetch_assoc($result)){
    $jsonParticipants[strval($row['drawnNumber'])] = $row;
}
$participantsString = "";
$lastNumbersString = "";
for( $index = 1; $index <= $numbers; $index++){
    $drawnNumber = $index < 10 ? "0{$index}" : $index;

    $participantsString .= PHP_EOL ."{$drawnNumber} - ";

    if(isset($jsonParticipants[strval($index)])){
        $participant = $jsonParticipants[strval($index)];
        $participantName = explode(' ',$participant['name'])[0];
        $participantPhone = substr($participant['phoneId'],-4);

        $participantsString .= "{$participantName} - ..._{$participantPhone}";
    }else{
        $lastNumbersString .= $drawnNumber . PHP_EOL ;
    }
}

/// CAPTURA INSTRUÇÃO DE PAGAMENTO
$instructions = "--";
if($instructionsRaffle == null || trim($instructionsRaffle) == ''){
    /// busca instrução da loja
    $sql = "SELECT instructions FROM stores WHERE idStore = '{$idStore}';";
    if(!$result = mysqli_query($db,$sql)){
        http_response_code(500);
        die(json_encode(['ref' => 17, 'debug' => mysqli_error($db)]));
    }
    if(mysqli_num_rows($result) > 0){
        $row = mysqli_fetch_assoc($result);
        $instructions = $row['instructions'];
    } 

}else{
    $instructions = $instructionsRaffle;
}

/// CAPTURA REFERENCIA DO SORTEIO
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

$result = mysqli_query($db,$sql);
$row = mysqli_fetch_assoc($result);
$refCodeGroup = intval($row['cGroupRef']) < 10 ? "0".$row['cGroupRef'] : $row['cGroupRef'];
$refCodeStore = $row['storeRef'];
$refCodeStore = intval($row['storeRef']) < 10 ? "0".$row['storeRef'] : $row['storeRef'];
$referenceRaffle = "{$refCodeGroup}L{$refCodeStore}G{$row['ref']}S" . $refCodeRaffle;
//////////////

$footerString = $price > 0 ? "
É bem simples Escolhe teu numero e faz o pix que te marcamos na LISTA

PIX  para ficar fácil de copiar⤵️

{$pixKey}" : '';

/// NOTIFICA NOVA LISTA
$reqResList = sendZAPIReq(
    [
        "phone" => "{$phoneId}",
        "message"=> "{$labelGroup}".PHP_EOL.
        "{$referenceRaffle}".PHP_EOL.
        "🔥  *VALOR: R$ {$priceBRL} por número.*".PHP_EOL.
        "{$awardsString}".PHP_EOL.
        "{$instructions}".PHP_EOL.
        "_*REGRAS NA DESCRIÇÃO DO GRUPO*_".PHP_EOL.
        "{$participantsString}".PHP_EOL.
        "{$footerString}"
    ]
);

/// DESLIGA BOT SE NUMEROS ESGOTARAM
if(count($jsonParticipants) >= $numbers ){
    $reqRes = sendZAPIReq(
        [
            "phone"=> "{$phoneId}",
            "message"=>     "Números Esgotados".PHP_EOL.
                            "Conferindo aqui os pagamentos e já vamos para o sorteio."
        ]
    );

    // notifica admins
    if($adminPhones != null){
        foreach($adminPhones as $adminPhone){
            $reqRes = sendZAPIReq(
                [
                    "phone"=> "{$adminPhone}",
                    "message"=>     "✅ *Venda finalizada*".PHP_EOL.
                                    "- Grupo: {$labelGroup}".PHP_EOL.
                                    "- Sorteio: {$referenceRaffle}".PHP_EOL.
                                    "- Números Vendidos: {$numbers}".PHP_EOL.
                                    PHP_EOL.
                                    "Confira os pagamentos e execute o sorteio."
                ]
            );
        }
    }

    //desliga bot
    $sql = "UPDATE groups set botStatus = 0 WHERE idGroup = '{$idGroup}';";
    if(!$result = mysqli_query($db,$sql)){
        http_response_code(500);
        die(json_encode(['ref' => 18, 'debug' => mysqli_error($db)]));
    }
    //desliga sorteio
    $sql = "UPDATE raffles set status = 0 WHERE idRaffle = '{$idRaffle}';";
    if(!$result = mysqli_query($db,$sql)){
        http_response_code(500);
        die(json_encode(['ref' => 19, 'debug' => mysqli_error($db)]));
    }

    http_response_code(200);
    die();

}

// Calcular a quantidade de números restantes
$sold = count($jsonParticipants);
$remaining = $numbers - $sold;

if($remaining == 1){
    $reqResLastNumbers = sendZAPIReq(
        [
            "phone" => "{$phoneId}",
            "message" =>    "*Último número livre*".PHP_EOL.
                            "{$lastNumbersString}"
        ]
    );

} else

/// NOTIFICA NUMEROS RESTANTES
if($flatNotify > 0 || $percentageNotify > 0){
    // vendidos
    if($percentageNotify > 0 ){

        // Calcular a porcentagem de números restantes
        $remainingPercentage = ($remaining / $numbers) * 100;

        if ($remainingPercentage <= $percentageNotify) {
            $notify = true;
        } else {
            $notify = false;
        }

    } else if($flatNotify > 0){

        if($remaining <= $flatNotify){
            $notify = true;
        }

    }

    if($notify === true){
        $reqResLastNumbers = sendZAPIReq(
            [
                "phone"=> "{$phoneId}",
                "message"=>     
                    "Últimos números livres".PHP_EOL.
                    "{$lastNumbersString}"
            ]
        );
    }
}


http_response_code(200);
die(json_encode($reqResList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));