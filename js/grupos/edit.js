const pageSlug = 'grupos';
const pageName = 'Grupos';
const campos = [
    {label:'Nome Grupo', key: 'label'},
    {label:'Link do Grupo', key: 'link'},
    {label:'Telefone Grupo (Whatsapp ID)', key: 'phoneId'},
    //{label:'Status do Bot', key: 'botStatus'},
    {label:'Status', key: 'status'},
    {label:'Telefones Admin (separados por vírgula)', key: 'adminPhones'},
    {label:'Mensagem de Gatilho', key: 'triggerMessage'},
    {label:'Link de Redirecionamento', key: 'redirectLink'},
    //{label:'Ações', key: 'actions'},
];


window.addEventListener('DOMContentLoaded', async function () {
    renderUserDataReplace();
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> ' + pageName,
        link: null
    }]);
    //renderPageActive(pageSlug);
    ///////////////////////////

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
            jsonCampos[campo.key] = element.val().trim();
        }
        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }
        const id = $('#get_id').val();
        jsonCampos.id = id;

        ///////
        //jsonCampos['botStatus'] = $('#input-botStatus').is(':checked') ? 1 : 0;
        jsonCampos['status'] = $('#input-status').is(':checked') ? 1 : 0;

        // REQUISIÇÃO
        popupLoading();

        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/edit.php`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(jsonCampos)
        });

        if(fetchResponse.status != 200){
            
            try{
                let json = await fetchResponse.json();
                dispatchPopup('warning','Atenção.',json.message);
            }catch(e){
                dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');
            }


            return false;

        }

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
        // adiciona campo
        switch(campo.key){
            case 'status' :
            case 'botStatus' :
                $('#inputs-row').append(`
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <label for="input-${campo.key}">${campo.label}</label>
                            <div class="w-100">
                                <div class="input-container">

                                    <label class="rb-container">
                                        <input checked id="input-${campo.key}" value="1" type="radio" name="input-${campo.key}" />
                                        Ativado
                                        <span class="rb-checkmark"></span>
                                    </label>
                                    
                                    <label class="rb-container">
                                        <input id="input-${campo.key}-2" value="0" type="radio" name="input-${campo.key}" />
                                        Desativado
                                        <span class="rb-checkmark"></span>
                                    </label>

                                    <small class="input-message"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                break;
            default:
                $('#inputs-row').append(`
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <label for="input-${campo.key}">${campo.label}</label>
                            <div class="w-100">
                                <div class="input-container">
                                    <input maxlength="50" id="input-${campo.key}" type="text" class="input-default">
                                    <small class="input-message"></small>
                                </div>
                            </div>
                        </div>
                    </div>
                `);
                break;
        }

        // define valor do campo
        switch(campo.key){
            case 'status':
            case 'botStatus':
                if(result[campo.key] == 1){
                    $(`#input-${campo.key}`).prop('checked',true);
                    
                }else{
                    $(`#input-${campo.key}-2`).prop('checked',true);
                }
                break;
            default:
                $(`#input-${campo.key}`).val(result[campo.key]);
                break;
        }
        
    }

    // MÁSCARAS

    $('#input-triggerMessage')
        .attr('data-optional','true');

    $('#input-redirectLink')
        .attr('data-optional','true');
    
    $('#input-referenceCode')
        .attr('data-optional','true');

    $('#input-adminPhones')
    .attr('maxlength','500')
    .attr('data-optional','true');

    maskInputs();


    $('[id^="input-"]').each(function(){
        if($(this).attr('data-optional') != 'true'){
            const inputGroup = $(this).closest('.input-group');

            const label = inputGroup.find(' > label');

            if(label.attr('data-required') == 'true') return;

            label.attr('data-required',true);
            label.html(`<b>${label.text()}*</b>`); 
        }
    });

    $('#input-adminPhones').on('input', function() {
        let validCharacters = /^[0-9,+]*$/;
        let value = $(this).val();

        // Remove any invalid characters
        if (!validCharacters.test(value)) {
            $(this).val(value.replace(/[^0-9,+]/g, ''));
        }
    });
    
}
