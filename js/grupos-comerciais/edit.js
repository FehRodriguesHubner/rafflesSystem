const pageSlug = 'grupos-comerciais';
const pageName = 'Grupos Comerciais';
const campos = [
    //{label:'ID', key: 'idCGroup' },
    {label:'Nome Grupo', key: 'label'},
    {label:'Exibir Confirmação de Pagamento na LISTA', key: 'showPaymentConfirm', type: FIELD_TYPE_RADIO},
    {label:'Nome Contato', key: 'nameContact', required: false},
    {label:'Número Contato', key: 'numberContact', type: FIELD_TYPE_PHONE, required: false},
];

window.addEventListener('DOMContentLoaded', async function () {
    renderUserDataReplace();
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> ' + pageName,
        link: null
    }]);
    renderPageActive(pageSlug);
    ///////////////////////////
    try{
        const id = $('#get_id').val();
        let jsonResponse = await fetchReq(`instancias/list.php?id=${id}`);
        const instances = jsonResponse.results;
        instances.splice(0,0,{label:'Selecione uma instância',value:''});
        if(instances.length > 0){
            for(let instance of instances){
                instance.value = instance.idInstance;
            }

            campos.splice(2,0,{
                label:'Instância z-api', 
                key: 'idInstance',
                type: FIELD_TYPE_SELECT, content: instances
            });
        }

    }catch(ex){return;}
    
    //////////////////////////

    renderDefaultForm();

});

$(function(){
    $(document).on('focus','input', function(){
        cleanInputError(this);
    });

    // submit
    $('#form-edit').on('submit',async function(ev){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        let erros = 0;
        const jsonCampos = {};
        for(let campo of campos){
            const element = $(`#input-${campo.key}`);
            const type = element.attr('data-type');
            if(
                (element.attr('data-optional') != null && element.val().trim() != '') ||
                element.attr('data-optional') == null
            ){
                if (!inputValidation(element.val().trim(),type)) {
                    triggerInputError(element, 'Verifique o valor informado!');
                    erros++
                }
            }

            if(campo.type === FIELD_TYPE_RADIO){
                jsonCampos[campo.key] = $(`[name="input-${campo.key}"]:checked`).val().trim();
            }else{
                jsonCampos[campo.key] = element.val().trim();
            }

        }
        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }
        const id = $('#get_id').val();
        jsonCampos.id = id;


        // REQUISIÇÃO
        popupLoading();
        try{
            await fetchReq(`${pageSlug}/edit.php`, jsonCampos);
        }catch(except){ console.log(except); return;}

        dispatchPopup('success','Pronto!','Atualização realizada com sucesso.').then(function(){
            history.back();
        });

    });

})

function fetchDefault() {
    return new Promise(async function (res, rej) {
        const id = $('#get_id').val();
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/get.php?id=${id}`, {
            method: 'GET'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao buscar as informações necessárias. Por favor, atualize a página ou volte novamente mais tarde'
            ).then(function(){
                location.href = baseAdminUrl;
            });

            rej(false);

            return;
        }


        try {
            fetchJsonResponse = await fetchResponse.json();
        } catch (except) {

            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao analisar as informarções necessárias. Por favor, atualize a página ou volte novamente mais tarde'
            ).then(function(){
                location.href = baseAdminUrl;
            });

            rej(false);
            return;
        }

        res(fetchJsonResponse);

    });
}

async function renderDefaultForm(){
    var result;
    try{
        result = await fetchDefault();
    }catch(e){
        console.log(e);
        return;
    }

    if(result === false){
        return false;
    }

    
    
    for(let campo of campos){
        renderInput(campo,result);
        
    }

    maskInputs();

    renderRequired();
    
}
