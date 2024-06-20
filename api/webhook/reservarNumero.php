<?php


//error_reporting(E_ALL);
//ini_set('display_errors', 1);

set_time_limit(240); // (4 minutos)
ini_set('max_execution_time', 240); //(4 minutos)

require_once(__DIR__ . '/../../config/https-redirect.php');
require_once(__DIR__ . '/../db/db-config.php');
require_once(__DIR__ . '/../utils/functions.php');
require_once(__DIR__ . '/webhook-config.php');

$req = $json;

/// VARIÁVEIS
$phoneId            = mysqli_real_escape_string($db,$req['phone']);
$zApiIdInstanciaReq    = mysqli_real_escape_string($db,$req['instanceId']);
$messageId          = $req['messageId'];

$participantPhoneId = mysqli_real_escape_string($db,$req['participantPhone']);
$senderName         = mysqli_real_escape_string($db,$req['senderName']);
if(isset($req['text']['message'])){
    $inputMessage       = $req['text']['message'];
} else
if(isset($req['image']['caption'])){
    $inputMessage       = $req['image']['caption'];
}

if($senderName == null || empty($senderName) || trim($senderName) == ""){
    $senderName = "[sem-nome]";
}

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

/// TESTANDO MENSAGEM
$arrayMsg = explode(' ',$inputMessage);
if(count($arrayMsg) >= 10) error('Mais de 10 mensagens',400);

$msgHasNumber = false;
$msgIsNumber = is_numeric($inputMessage);
foreach($arrayMsg as $word){

    if(is_numeric($word)) $msgHasNumber = true;

}

if($msgHasNumber === false) error('Sem número',400);

/// BUSCA GRUPO
$row = buscaGrupo($phoneId);

$idGroup = $row['idGroup'];
$botStatus = $row['botStatus'];
$statusGroup = $row['status'];
$adminPhones = $row['adminPhones'];
$labelGroup = $row['label'];
$idStore = $row['idStore'];
$zApiIdInstancia = $row['zApiIdInstancia'];
if($zApiIdInstancia != $zApiIdInstanciaReq) error('Instância inválida');

/// TESTA MENSAGEM INPUTADA (TEXTOMATRIZ)
if(
    $msgIsNumber === false
){
    // enviando retorno de mensagem incorreta
    sleep(rand(3,8));
    $reqRes = enviarMensagemZApi(
        [
            "phone" => "{$phoneId}",
            "message" =>    "🚫 Digite na mensagem somente o número desejado. _(Ex: *12*)_".PHP_EOL
                            .PHP_EOL.
                            "⚠️ Só 1 número por mensagem.".PHP_EOL.
                            "_Se quiser escolher mais números, envie cada um em uma mensagem separada._".PHP_EOL.
                            "📱 _*Se precisa falar com o suporte, utilize o número que está na descrição do grupo.*_",
            "messageId" => "{$messageId}"
        ], $phoneId
    );
    
    http_response_code(400);
    die(json_encode(['ref' => 5, 'req' => $reqRes]));
}

if(!is_numeric($inputMessage)){
    http_response_code(400);
    die(json_encode(['ref' => 6]));
}

$chosenNumber = intval($inputMessage);


if($botStatus != 1 || $statusGroup != 1) error('Status inativo',400);

/// VERIFICA SE É UM ADMIN
if($adminPhones != null){
    $adminPhones = explode(',',$adminPhones);
    if(in_array($participantPhoneId,$adminPhones)) die(json_encode(['ref' => 4]));
}


/// PESQUISA POR SORTEIOS
$rowRaffle = buscaSorteioAtivo($idGroup);

$idRaffle = $rowRaffle['idRaffle'];
$numbers = intval($rowRaffle['numbers']);
$refCodeRaffle = intval($rowRaffle['referenceCode']);
$instructionsRaffle = $rowRaffle['instructions'];
$footerRaffle = $rowRaffle['footer'];
$percentageNotify = intval($rowRaffle['percentageNotify']);
$flatNotify = intval($rowRaffle['flatNotify']);
$buyLimit = intval($rowRaffle['buyLimit']);
$price = floatval($rowRaffle['price']);

$priceBRL = number_format($price, 2, ',', '.');


/// VERIFICA SE NÚMERO ESTÁ FORA DO RANGE
if($chosenNumber > $numbers || $chosenNumber <= 0 ){
    // enviando retorno de mensagem incorreta
    sleep(rand(3,8));
    $reqRes = enviarMensagemZApi(
        [
            "phone" => "{$phoneId}",
            "message" =>    "⚠️ _*Reserva não efetuada! - Número {$chosenNumber}*_".PHP_EOL.
                            "O sorteio atual permite somente números entre 1 e {$numbers}.".PHP_EOL.
                            "Selecione outro número para participar...",
            "messageId"=> "{$messageId}"
        ], $phoneId
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
    sleep(rand(3,8));
    $reqRes = enviarMensagemZApi(
        [
            "phone" => "{$phoneId}",
            "message" =>    "🚫 _*Reserva não efetuada!*_".PHP_EOL.
                            PHP_EOL.
                            "O número *{$chosenNumber}* não está mais disponível.".PHP_EOL.
                            "Selecione outro número para participar...",
            "messageId" => "{$messageId}"
        ], $phoneId
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
        sleep(rand(3,8));
        $reqRes = enviarMensagemZApi(
            [
                "phone"=> "{$phoneId}",
                "message"=>     "🚫 _*Reserva não efetuada!*_".PHP_EOL.
                                PHP_EOL.
                                "O sorteio atual permite que cada participante selecione no máximo {$buyLimit} número(s).",
                "messageId"=> "{$messageId}"
            ], $phoneId
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
sleep(rand(3,12));
$reqResReservado = enviarMensagemZApi(
    [
        "phone" => "{$phoneId}",
        "message" => "✅ Número *{$chosenNumber}* reservado para você {$senderName}",
        "messageId"=> "{$messageId}"
    ], $phoneId
);

/// CAPTURA REFERENCIA DO SORTEIO
$row = buscaReferenciaGrupo($idGroup);
$refCodeGroup = intval($row['cGroupRef']) < 10 ? "0".$row['cGroupRef'] : $row['cGroupRef'];
$refCodeStore = $row['storeRef'];
$refCodeStore = intval($row['storeRef']) < 10 ? "0".$row['storeRef'] : $row['storeRef'];
$referenceRaffle = "{$refCodeGroup}L{$refCodeStore}G{$row['ref']}S" . $refCodeRaffle;
//////////////

/// DESLIGA BOT SE NUMEROS ESGOTARAM
$jsonParticipants = buscaParticipantes($idRaffle);
$outOfNumbers = false;
if(count($jsonParticipants) >= $numbers ){
    $outOfNumbers = true;

    // notifica admins
    if($adminPhones != null){
        foreach($adminPhones as $adminPhone){
            $reqRes = enviarMensagemZApi(
                [
                    "phone"=> "{$adminPhone}",
                    "message"=>     "✅ *Venda finalizada*".PHP_EOL.
                                    "- Grupo: {$labelGroup}".PHP_EOL.
                                    "- Sorteio: {$referenceRaffle}".PHP_EOL.
                                    "- Números Vendidos: {$numbers}".PHP_EOL.
                                    PHP_EOL.
                                    "Confira os pagamentos e execute o sorteio."
                ], $phoneId
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

}

/// VERIFICANDO LISTA
$sql = "SELECT queueUpdateList FROM groups WHERE idGroup = '{$idGroup}';";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 20, 'debug' => mysqli_error($db)]));
}
$row = mysqli_fetch_assoc($result);
$queueUpdateList = $row['queueUpdateList'];

$currentTimestamp = strtotime(date('Y-m-d H:i:s'));
if($queueUpdateList != null){
    $timestampUpdate = strtotime($queueUpdateList);
    if($timestampUpdate >= $currentTimestamp){
        http_response_code(200);
        die(json_encode([
            'ref' => 22, 
            'desc' => 'Lista agendada',
            'debug' => [
                '$timestampUpdate' => $timestampUpdate,
                '$currentTimestamp' => $currentTimestamp,
                '$queueUpdateList' => $queueUpdateList,
            ]
        ]));
    }
}

$sleepSeconds = rand(60,75);
$queueUpdateList = $currentTimestamp + $sleepSeconds;
$queueUpdateList = date('Y-m-d H:i:s',$queueUpdateList);

$sql = "UPDATE groups SET queueUpdateList = '{$queueUpdateList}' WHERE idGroup = '{$idGroup}';";
if(!$result = mysqli_query($db,$sql)){
    http_response_code(500);
    die(json_encode(['ref' => 23, 'debug' => mysqli_error($db)]));
}
sleep($sleepSeconds);

/////////////////////////////////////// PÓS SLEEP

$listMsg = montaListaGrupo($phoneId, $rowRaffle);
$lastNumbersString = buscaUltimosNumeros($numbers,$jsonParticipants);

/// NOVA LISTA
$jsonList = [
    "phone" => "{$phoneId}",
    "message"=> $listMsg
];
$reqResList = enviarMensagemZApi($jsonList,$phoneId);
if(count($jsonParticipants) >= $numbers ){

    $outOfNumbersText = $price > 0 ? "Conferindo aqui os pagamentos e já vamos para o sorteio." : "Conferindo aqui e já vamos para o sorteio.";

    $reqRes = enviarMensagemZApi(
        [
            "phone"=> "{$phoneId}",
            "message"=>     "Números Esgotados".PHP_EOL.
                            $outOfNumbersText
        ], $phoneId
    );
} else {
    // Calcular a quantidade de números restantes
    $sold = count($jsonParticipants);
    $remaining = $numbers - $sold;
    
    if($remaining == 1){
        $reqResLastNumbers = enviarMensagemZApi(
            [
                "phone" => "{$phoneId}",
                "message" =>    "*Último número livre*".PHP_EOL.
                                "{$lastNumbersString}"
            ], $phoneId
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
            $reqResLastNumbers = enviarMensagemZApi(
                [
                    "phone"=> "{$phoneId}",
                    "message"=>     
                        "Últimos números livres".PHP_EOL.
                        "{$lastNumbersString}"
                ], $phoneId
            );
        }
    }
}

http_response_code(200);
die(json_encode($reqResList, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE));