const pageSlug = 'lojas';
const pageName = 'Lojas';
const campos = [
    //{label:'ID', key: 'idCGroup' },
    {label:'Nome Loja', key: 'label'},
    {label:'Instruções de Pagamento', key: 'instructions'},
    {label:'Rodapé', key: 'footer'},
    {label:'CNPJ', key: 'cnpj'},
    {label:'Razão Social', key: 'razaoSocial'},
    {label:'Inscrição Estadual', key: 'inscricaoEstadual'},
    {label:'Endereço', key: 'endereco'},
    {label:'Número', key: 'numero'},
    {label:'Bairro', key: 'bairro'},
    {label:'Cidade', key: 'cidade'},
    {label:'UF', key: 'uf'},
    {label:'CEP', key: 'cep'},
    {label:'Nome Contato', key: 'nameContact'},
    {label:'Número Contato', key: 'numberContact'},
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
            case 'footer':
            case 'instructions':
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
    $('#input-numberContact')
        .attr('data-mask',"phone")
        .attr('data-type','phone')
        .attr('data-optional','true');


    $('#input-cnpj')
        .attr('data-mask',"cnpj")
        .attr('data-type',"cnpj")
        .attr('data-optional','true');

    $('#input-razaoSocial')
        .attr('data-optional','true');

    $('#input-inscricaoEstadual')
        .attr('data-optional','true');

    $('#input-endereco')
        .attr('data-optional','true');

    $('#input-numero')
        .attr('data-mask','number')
        .attr('data-optional','true');

    $('#input-bairro')
        .attr('data-optional','true');

    $('#input-cidade')
        .attr('data-optional','true');

    $('#input-uf')
        .attr('data-optional','true');

    $('#input-cep')
        .attr('data-mask',"cep")
        .attr('data-type','cep')
        .attr('data-optional','true');

    $('#input-nameContact')
        .attr('data-optional','true');

    $('#input-footer')
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
