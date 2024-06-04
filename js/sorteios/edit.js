const pageSlug = 'sorteios';
const pageName = 'Sorteios';
const campos = [
    //{label:'ID', key: 'idCGroup' },
    {label:'Status', key: 'status'},
    {label:'Qtd. Números', key: 'numbers'},
    {label:'Preço Unitário', key: 'price'},
    {label:'Instruções de Pagamento', key: 'instructions'},
    {label:'Rodapé', key: 'footer'},
    {label:'Limite por Pessoa', key: 'buyLimit'},
    {label:'Porcentagem Restante (notificação) ', key: 'percentageNotify'},
    {label:'Número Restante (notificação) ', key: 'flatNotify'},
    {label:'Data Sorteio', key: 'raffleDate'},
    {label:'Link do Resultado', key: 'resultLink'},
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

        let fetchJsonResponse = null;
        try{
            fetchJsonResponse = await fetchResponse.json();
        }catch(ex){
            fetchJsonResponse = null;
        }

        console.log(fetchJsonResponse);
        if(fetchResponse.status != 200){
            if(fetchJsonResponse?.message != null){
                dispatchPopup('error','Ops! ocorreu um erro.',fetchJsonResponse?.message);   
            }else{
                dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');
            }

            return false;
        }else{
            if(fetchJsonResponse?.message != null){
                dispatchPopup('success','Pronto!',fetchJsonResponse?.message).then(function(){
                    history.back();
                });
                return;
            }
            dispatchPopup('success','Pronto!','Atualização realizada com sucesso.').then(function(){
                history.back();
            });
        }
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
            case 'instructions':
            case 'footer':
                $('#inputs-row').append(`
                    <div class="col-12">
                        <div class="input-group mb-3">
                            <label for="input-${campo.key}">${campo.label}</label>
                            <div class="w-100">
                                <div class="input-container">
                                    <textarea maxlength="500" id="input-${campo.key}" type="text" class="input-default"></textarea>
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
                if(result[campo.key] == 1){
                    $(`#input-${campo.key}`).prop('checked',true);
                    
                }else{
                    $(`#input-${campo.key}-2`).prop('checked',true);
                }
                break;
            case 'price':
                $(`#input-${campo.key}`).val(parseFloat(result[campo.key]).toLocaleString('pt-br',{minimumFractionDigits: 2}));
                break;
            case 'raffleDate':
                let raffleDate = result[campo.key];
                if(raffleDate != null){
                    raffleDate = raffleDate.split('-');
                    raffleDate = `${raffleDate[2]}/${raffleDate[1]}/${raffleDate[0]}`;
                }
                $(`#input-${campo.key}`).val(raffleDate);

                break;
            case 'resultLink':
            case 'buyLimit':
            case 'percentageNotify':
            case 'flatNotify':
                if(result[campo.key] != 0){
                    $(`#input-${campo.key}`).val(result[campo.key]);
                }
                break;
            default:
                $(`#input-${campo.key}`).val(result[campo.key]);
                break;
        }
        
    }
    
    // MÁSCARAS

    $('#input-instructions')
    .attr('data-optional','true');

    $('#input-footer')
    .attr('data-optional','true');

    $('#input-buyLimit')
    .attr('data-mask',"number")
    .attr('data-optional','true');

    $('#input-percentageNotify')
    .attr('data-mask',"number")
    .attr('data-optional','true');

    $('#input-flatNotify')
    .attr('data-mask',"number")
    .attr('data-optional','true');
    
    $('#input-resultLink')
    .attr('data-optional','true');

    $('#input-raffleDate')
    .attr('data-mask',"date")
    .attr('data-optional','true');

    $('#input-price')
    .attr('data-mask',"money")
    .attr('disabled',"true")
    .addClass('disabled');

    $('#input-numbers')
    .attr('data-mask',"number")
    .attr('disabled',"true")
    .addClass('disabled')

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

    ///////////////////////////

    // Função para desabilitar ou habilitar o outro input
    function toggleInputs() {
        if ($('#input-percentageNotify').val().length > 0) {
            $('#input-flatNotify').addClass('disabled').attr('disabled', true);
        } else {
            $('#input-flatNotify').removeClass('disabled').removeAttr('disabled');
        }

        if ($('#input-flatNotify').val().length > 0) {
            $('#input-percentageNotify').addClass('disabled').attr('disabled', true);
        } else {
            $('#input-percentageNotify').removeClass('disabled').removeAttr('disabled');
        }
    }

    // Eventos de entrada nos inputs
    $('#input-percentageNotify').on('input', toggleInputs);
    $('#input-flatNotify').on('input', toggleInputs);
    $('#input-flatNotify').trigger('input');
    
}
