const pageSlug = 'premios';
const pageName = 'Prêmios';
const campos = [
    {label:'Ref.', key: 'referenceCode' },
    {label:'Descrição', key: 'description'},
    {label:'Número sorteado', key: 'drawnNumber'},
    {label:'Ações', key: 'actions'}
];

window.addEventListener('DOMContentLoaded', async function () {
    renderUserDataReplace();
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> ' + pageName,
        link: null
    }]);
    //renderPageActive(pageSlug);
    ///////////////////////////

    renderDefault();

});

function fetchDefault(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/list.php?id=${id}`, {
            method: 'GET'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao buscar as informações necessárias. Por favor, atualize a página ou volte novamente mais tarde'
            );

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
            );

            rej(false);
            return;
        }

        res(fetchJsonResponse);

    });
}


function fetchDefaultDelete(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/delete.php?id=${id}`, {
            method: 'DELETE'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status == 403) {
            dispatchPopup(
                'warning',
                'Exclusão indevida!',
                'Certifique-se de excluir primeiro seus dependentes'
            );

            rej(false);

            return;
        }
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao efetuar a exclusão. Por favor, atualize a página ou volte novamente mais tarde'
            );

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
            );

            rej(false);
            return;
        }

        res(fetchJsonResponse);

    });
}

$(function(){
    $(document).on('click','[data-action="delete"]', async function(){
        let id = $(this).attr('data-id');

        popupLoading()

        try{
            await fetchDefaultDelete(id);
        }catch(e){
            console.log('delete falhou:',id)
            return;
        }

        renderDefault();

    });
});

async function renderDefault(){
    return new Promise(async function(res,rej){
        const id = $('#get_id').val();

        const dataTablesWrapper = document.querySelector('#datatables-models');
        var result;
        try{
            result = await fetchDefault(id);
        }catch(e){
            res(false);
            return;
        }
        //// TRATAMENTO DOS DADOS ////
        $('.title-header').text(result.tree);

        dataTablesWrapper.innerHTML = '';

        let data = result.results;
        
        if( data == null || data.length < 1){
    
            dataTablesWrapper.classList.remove('card-profile', 'p-lg-4', 'p-md-3', 'p-2')
    
            dataTablesWrapper.innerHTML = /*html*/`
            <div class="d-flex flex-column">
                <p class="message-on-container mb-4">Nenhum registro até o momento.</p>     
            </div>
    
            `;
            res(false);
            Swal.close();
            
            return false;
    
        }
    
        function montaHTMLTabela(campos){
            var strCampos = ``;
            for(let campo of campos){
                let strCampo = `
                    <th> ${campo.label} </th>
                `;
                strCampos += strCampo;
            }

            dataTablesWrapper.innerHTML = /*html*/ `
                <table class="table table-striped" width="100%">
                    <thead>
                        <tr>
                           ${strCampos}
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            `;
        }

        montaHTMLTabela(campos);
    
        for(let index in data){
    
            let row = data[index];
            let strRow = '';

            for(let campo of campos){
                let field = '--';

                // CUSTOM FIELDS //
                switch(campo.key){
                    case 'status':
                        if(row[campo.key] != null ){
                            field =  row[campo.key] == 1 ? '🟢 Ativo' : '🔴';
                        }
                            break;
                    case 'actions':
                        let popupButton = `
                            <a data-popup data-id="${row.idAward}" class="me-2">
                                <button class="btn btn-success d-flex">
                                    <i class="fa fa-gift"></i>
                                </button>
                            </a>
                        `;
                        if(row.drawnNumber != null){
                            popupButton = `
                                <a disabled class="me-2">
                                    <button disabled class="btn btn-secondary disabled d-flex">
                                        <i class="fa fa-gift"></i>
                                    </button>
                                </a>
                            `;
                        }

                        field = `
                        <div class="d-flex justify-content-end">
                            <button data-action="delete" title="Deletar" data-id="${row.idAward}" class="btn btn-danger d-flex justify-content-between align-items-center me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
                            <a title="Editar" href="${baseAdminUrl}${pageSlug}/editar/${row.idAward}" class="btn btn-secondary d-flex justify-content-between align-items-center me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </a>
                            ${popupButton}      
                        </div>
                        
                        `;

                        break;
                    default:
                        if(row[campo.key] != null ){
                            field = row[campo.key];
                        }

                        break;
                }


                let strField = `
                    <td>
                        <div>
                            ${field}
                        </div>
                    </td>`;
                strRow += strField;
            }

            dataTablesWrapper.querySelector('tbody').insertAdjacentHTML('beforeend',/*html*/ `
                <tr>
                    ${strRow}
                </tr>
            `);
    
        }
    
    
        $('#datatables-models table').DataTable({
            responsive: true,
            scrollX:true,
            language: {
                url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
            },
            dom: 'Bfrtip',
            buttons: [
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'a3',
                    text: `<i class="fa fa-download"></i>
                    &nbsp
                    Download PDF `,
                    className: 'btn-warning fw-bold'
                }
            ]
        });
    
        $('[data-popup]').on('click', function(){
            const id = $(this).attr('data-id');
            dispatchPopup(
                '',
                'Registrar Número Sorteado',
                'Digite abaixo o número sorteado',
                {
                    input: 'text',
                    inputAttributes: {
                        maxlength: 10
                    },
                    preConfirm: (value) => {
                        let auxValue = parseInt(value);
                        if (isNaN(auxValue)) {
                            Swal.showValidationMessage('Informe um número válido!');
                            return false;
                        }
                        return auxValue;
                    },
                    confirmButtonText: 'Confirmar',
                    showCancelButton: true,
                    cancelButtonText: 'Cancelar',

                }
            ).then(async (result) => {
                if (result.isConfirmed) {
                    // REQUISIÇÃO
                    dispatchPopup('warning','Confirmar sorteio',null,
                        {
                            html:`Deseja mesmo sortear o número <b>${result.value}</b> para este prêmio?`,
                            showCancelButton:true,
                            cancelButtonText:'Cancelar'
                        }
                    ).then(
                        async function(res){
                            if(res.isConfirmed){
                                popupLoading();

                                let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/popup.php`, {
                                    method: 'PUT',
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json',
                                    },
                                    body:JSON.stringify({
                                        id:id,
                                        value:result.value
                                    })
                                });
            
                                if(fetchResponse.status != 200){
                                    dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');
            
                                    return false;
            
                                }
            
                                dispatchPopup('success','Pronto!','Atualização realizada com sucesso.').then(function(){
                                    renderDefault();
                                });
                            }
                        }
                    )

                }
            });

        });

        res(true);

        Swal.close();


    });

}



