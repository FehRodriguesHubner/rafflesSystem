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