<?php


error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
require_once(__DIR__ . '/webhook-config.php');

// DEFINIÇÕES
//$messageEndpoint = "https://api.z-api.io/instances/3CDB39D34A9AA0A9F6BBBE5925AA0C3E/token/9E79847126558B68BA22EFFF/send-text";
//$clientToken = "F89f55d08c2164b36b206c9200107f8f5S";

$messageEndpoint = "test";
$clientToken = "F89f55";
$pixKey = "50367535000173";



// veio de algum grupo
$req = $json;

$phoneId            = mysqli_real_escape_string($db,$req['phone']);
$messageId          = $req['messageId'];

$participantPhoneId = mysqli_real_escape_string($db,$req['participantPhone']);
$senderName         = mysqli_real_escape_string($db,$req['senderName']);

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
sleep(4);

/// TESTA MENSAGEM INPUTADA (TEXTOMATRIZ)
$inputMessage = $req['text']['message'];
if(explode(' ',$inputMessage) <= 3 && is_nan($inputMessage)){
    // enviando retorno de mensagem incorreta
    $reqRes = sendZAPIReq(
        `{
            "phone": "{$phoneId}",
            "message": "🚫 Digite na mensagem somente o número desejado. _(Ex: *12*)_
          
          ⚠️ Só 1 número por mensagem.
          _Se quiser escolher mais números, envie cada um em uma mensagem separada._
          
          📱 _*Se precisa falar com o suporte, utilize o número que está na descrição do grupo.*_",
            "messageId": "{$messageId}"
        }`, false
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 5, 'req' => $reqRes]));
}

if(is_nan(intval(substr($inputMessage,0,2)))){
    http_response_code(400);
    die(json_encode(['ref' => 6]));
}

$chosenNumber = intval($inputMessage);

/// PESQUISA POR SORTEIOS
$sql = "SELECT idRaffle, numbers, referenceCode, price, instructions, percentageNotify, flatNotify FROM raffles WHERE idGroup = '{$idGroup}' AND `status` = 1;";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 7, 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) < 1) die(json_encode(['ref' => 8]));

$idRaffle = $row['idRaffle'];
$numbers = intval($row['numbers']);
$refCodeRaffle = intval($row['referenceCode']);
$instructionsRaffle = intval($row['instructions']);
$percentageNotify = intval($row['percentageNotify']);
$flatNotify = intval($row['flatNotify']);
$price = floatval($row['price']);

$priceBRL = number_format($price, 2, ',', '.');


/// VERIFICA SE NÚMERO ESTÁ FORA DO RANGE
if($chosenNumber > $numbers || $chosenNumber <= 0 ){
    // enviando retorno de mensagem incorreta
    $reqRes = sendZAPIReq(
        `{
            "phone": "{$phoneId}",
            "message": "⚠️ _*Reserva não efetuada! - Número {$chosenNumber}*_
          
          O sorteio atual permite somente números entre 1 e {$numbers}.
          Selecione outro número para participar...",
            "messageId": "{$messageId}"
         }`, false
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 9, 'req' => $reqRes]));
}

/// VERIFICA SE NÚMERO JÁ NÃO FOI ESCOLHIDO
$sql = "SELECT drawnNumber FROM participants WHERE idRaffle = '{$idRaffle}';";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 10, 'debug' => mysqli_error($db)]));
}
if(mysqli_num_rows($result) > 0){

    $reqRes = sendZAPIReq(
        `{
            "phone": "{$phoneId}",
            "message": "🚫 _*Reserva não efetuada!*_

            O número *{$chosenNumber}* não está mais disponível.
            Selecione outro número para participar...",
            "messageId": "{$messageId}"
         }`, false
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 11]));
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
    `{
        "phone": "{$phoneId}",
        "message": "✅ Número *{$chosenNumber}* reservado para você {$senderName}",
        "messageId": "{$messageId}"
     }`, false
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
    $awardsString .= PHP_EOL ."*{$row['referenceCode']}º Prêmio:*". PHP_EOL ." {$row['description']}*" . PHP_EOL;
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
    $drawnNumber = $index < 10 ? "0{$drawnNumber}" : $drawnNumber;

    $participantsString .= PHP_EOL ."{$drawnNumber} - ";

    if(isset($jsonParticipants[strval($index)])){
        $participant = $jsonParticipants[strval($index)];
        $participantName = explode(' ',$participant['name'])[0];
        $participantPhone = substr($participant['phoneId'],0,-4);

        $participantsString .= "{$participantName} - {$participantPhone}_... ";
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
    `{
        "phone": "{$phoneId}",
        "message": "
        {$labelGroup}
        {$referenceRaffle}
        🔥  *VALOR: R$ {$priceBRL} por número.*
        
        {$awardsString}
        
        {$instructions}
        
        _*REGRAS NA DESCRIÇÃO DO GRUPO*_
        
        {$participantsString}
        
        {$footerString}"
     }`, false
);

/// DESLIGA BOT SE NUMEROS ESGOTARAM
if(count($jsonParticipants) >= $numbers ){
    $reqResList = sendZAPIReq(
        `{
            "phone": "{$phoneId}",
            "message": "Números Esgotados
            Conferindo aqui os pagamentos e já vamos para o sorteio."
         }`, false
    );

    // notifica admins
    if($adminPhones != null){
        foreach($adminPhones as $adminPhone){
            $reqResList = sendZAPIReq(
                `{
                    "phone": "{$adminPhone}",
                    "message": "✅ *Venda finalizada*

                    - Grupo: {$labelGroup}
                    - Sorteio: {$referenceRaffle}
                    - Números Vendidos: {$numbers}
                    
                    Confira os pagamentos e execute o sorteio."
                 }`, false
            );
        }
    }


    http_response_code(200);
    die();

}

/// NOTIFICA NUMEROS RESTANTES
if($flatNotify > 0 || $percentageNotify > 0){
    // vendidos
    $sold = count($jsonParticipants);

    // Calcular a quantidade de números restantes
    $remaining = $numbers - $sold;

    if($remaining == 1){
        
        $reqResLastNumbers = sendZAPIReq(
            `{
                "phone": "{$phoneId}",
                "message": "*Último número livre*
                {$lastNumbersString}
                "
            }`, false
        );

    }else {
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
                `{
                    "phone": "{$phoneId}",
                    "message": "Últimos números livres

                    {$lastNumbersString}
                    "
                }`, false
            );
        }
    }

}




http_response_code(200);
die();