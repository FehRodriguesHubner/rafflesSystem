const pageSlug = 'premios';
const pageName = 'Prêmios';
const campos = [
    //{label:'ID', key: 'idCGroup' },
    {label:'Descrição', key: 'description'},
    //{label:'Número sorteado', key: 'drawnNumber'}
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
    $('#form-create').on('submit',async function(ev){
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
        jsonCampos['status'] = $('#input-status').is(':checked') ? 1 : 0;

        // REQUISIÇÃO
        popupLoading();

        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/create.php`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify(jsonCampos)
        });

        if(fetchResponse.status != 200){
            dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');

            return false;

        }

        dispatchPopup('success','Pronto!','Cadastro realizado com sucesso.').then(function(){
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
        
    for(let campo of campos){
        // adiciona campo
        switch(campo.key){
            case 'description':
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
        
    }

    // MÁSCARAS

    $('#input-drawnNumber')
    .attr('data-mask',"number")
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
    
}
