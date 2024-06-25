const pageSlug = 'sorteios';
const pageName = 'Sorteios';
const campos = [
    //{label:'ID', key: 'idCGroup' },
    { label: 'Ref.', key: 'referenceCode' },
    { label: 'Status do Sorteio', key: 'status' },
    { label: 'Preço Unitário', key: 'price' },
    { label: 'Qtd. Números', key: 'numbers' },
    { label: 'Data Sorteio', key: 'raffleDate' },
    //{label:'Instruções de Pagamento', key: 'instructions'},
    //{label:'Limite por Pessoa', key: 'buyLimit'},
    //{label:'Porcentagem Restante (notificação) ', key: 'percentageNotify'},
    //{label:'Número Restante (notificação) ', key: 'flatNotify'},
    //{label:'Link do Resultado', key: 'resultLink'},
    { label: 'Ações', key: 'actions' },
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

        if (fetchResponse.status == 401) { window.location.href = baseAdminUrl; return; }
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
function fetchModalDefault(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/participants.php?id=${id}`, {
            method: 'GET'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) { window.location.href = baseAdminUrl; return; }
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
function fetchTogglePaid(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/togglePaidParticipants.php?id=${id}`, {
            method: 'PUT'
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) { window.location.href = baseAdminUrl; return; }
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

        if (fetchResponse.status == 401) { window.location.href = baseAdminUrl; return; }
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

$(function () {
    $(document).on('click', '[data-action="delete"]', async function () {
        let id = $(this).attr('data-id');

        popupLoading()

        try {
            await fetchDefaultDelete(id);
        } catch (e) {
            console.log('delete falhou:', id)
            return;
        }

        renderDefault();

    });
    var selectedModalId = null;
    const defaultModal = new bootstrap.Modal('#modal-default', {
        keyboard: false
    });

    $(document).on('click', '[data-modal="default"]', async function (e) {
        e.preventDefault()
        popupLoading();

        let id = $(this).attr('data-id');
        selectedModalId = id;
        const dataTablesWrapper = document.querySelector('#participantsWrapper');
        var result;

        try {
            result = await fetchModalDefault(id);
        } catch (e) {
            console.log(e);
            return;
        }

        //// TRATAMENTO DOS DADOS ////
        dataTablesWrapper.innerHTML = '';

        let data = result.results;

        $('#countParticipants').text(data.length);

        if (data == null || data.length < 1) {

            dataTablesWrapper.innerHTML = /*html*/`
            <div class="d-flex flex-column">
                <p class="message-on-container mb-4">Nenhum registro até o momento.</p>     
            </div>
    
            `;
            Swal.close();
            defaultModal.show();
            //return false;

        }

        function montaHTMLTabela(campos) {
            var strCampos = ``;
            for (let campo of campos) {
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

        const campos = [
            { label: 'Número', key: 'drawnNumber' },
            { label: 'Tel.', key: 'phoneId' },
            { label: 'Nome', key: 'name' },
            { label: 'Reserva', key: 'createdAt' },
            { label: 'Pago', key: 'paid' },
        ];

        montaHTMLTabela(campos);

        for (let index in data) {

            let row = data[index];
            let strRow = '';

            for (let campo of campos) {
                let field = '--';
                let sortValue = null;
                // CUSTOM FIELDS //
                switch (campo.key) {
                    case 'createdAt':
                        if (row[campo.key] != null) {
                            sortValue = row[campo.key];
                            field = formatDateTime(row[campo.key]);
                        }
                        break;
                    case 'paid':
                        if (row[campo.key] == 1) {
                            field = `
                            <div class="d-flex justify-content-end">     
                                <a class="me-2">
                                    <button data-toggle-paid data-id="${row.idParticipant}" class="btn btn-danger d-flex justify-content-center align-items-center">
                                        <i class="fa fa-dollar"></i> &nbsp; Desfazer
                                    </button>
                                </a>       
                            </div>
                            `;
                        } else {
                            field = `
                            <div class="d-flex justify-content-end">     
                                <a class="me-2">
                                    <button data-toggle-paid data-id="${row.idParticipant}" class="btn btn-success d-flex justify-content-center align-items-center">
                                        <i class="fa fa-dollar"></i> &nbsp; Confirmar
                                    </button>
                                </a>       
                            </div>
                            `;
                        }

                        break;
                    case 'drawnNumber':
                        sortValue = parseInt(row[campo.key]);
                        field = `${row[campo.key]}`;
                        break;
                    default:
                        if (row[campo.key] != null) {
                            field = row[campo.key];
                        }

                        break;
                }

                sortValue = sortValue == null ? '' : `data-order="${sortValue}"`;

                let strField = `
                    <td ${sortValue}>
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


        $(dataTablesWrapper).find('table').DataTable({
            pageLength: 30, // Adiciona a paginação de 30 itens por página
            responsive: true,
            scrollX: true,
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
                },
                { // Custom Button definition
                    text: `<i class="fa fa-list"></i> &nbsp Enviar Lista Atualizada `, // Button text
                    className: 'btn-success', // Button class for styling
                    action: function (e, dt, node, config) {
                        dispatchPopup('warning','Atenção','Tem certeza que deseja enviar a lista atualizada no grupo?',{showCancelButton:true,cancelButtonText:'Cancelar'}).then(async function(swalRes){
                            if(!swalRes.isConfirmed) return;

                            const idRaffle = id;
                            try{
                                jsonResponse = await fetchReq(`sorteios/sendList.php`,{
                                    "idRaffle": idRaffle
                                });
                            }catch(except){ console.log(except); return;}

                            dispatchPopup('success','Pronto!','Lista enviada com sucesso!');

                        })
                    }
                  }
            ],
            columnDefs: [
                {
                    targets: 0, // Define a primeira coluna (index 0)
                    type: 'num' // Define o tipo como numérico
                }
            ]
        });

        Swal.close();
        defaultModal.show();


    });

    $(document).on('click', '[data-toggle-paid]', async function () {
        const button = $(this);

        const id = button.attr('data-id');

        button
            .removeClass('btn-success')
            .removeClass('btn-danger')
            .addClass('btn-primary')
            .html(`
            <span class="spinner-grow spinner-grow-sm" aria-hidden="true"></span>
            <span role="status">Carregando...</span>
        `)
            .attr('disabled', true);

        try {
            result = await fetchTogglePaid(id);
        } catch (e) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao alterar o pagamento, as informações serão recarregadas',
            ).then(function () {
                renderDefault();
            })
            return;
        }

        if (result.currentPaid == 1) {
            button
                .removeClass('btn-primary')
                .addClass('btn-danger')
                .html(`
                <i class="fa fa-dollar"></i> &nbsp; Desfazer
            `)
                .removeAttr('disabled');

        } else {
            button
                .removeClass('btn-primary')
                .addClass('btn-success')
                .html(`
                <i class="fa fa-dollar"></i> &nbsp; Confirmar
            `)
                .removeAttr('disabled');
        }

        return;

    });

    // CADASTRA PARTICIPANTE
    $(document).on('focus','input', function(){
        cleanInputError(this);
    });
    const btnRegisterParticipant = $('#btnRegisterParticipant');
    const btnSubmitParticipant = $('#btnSubmitParticipant');
    const wrapperRegisterParticipant = $('#wrapperRegisterParticipant');

    btnRegisterParticipant.on('click', function () {
        wrapperRegisterParticipant.fadeIn();
    })

    btnSubmitParticipant.on('click', async function () {

        const inputDrawnNumber = $('#input-drawnNumber');
        const inputPhoneId = $('#input-phoneId');
        const inputName = $('#input-name');
        const arrayInputs = [inputDrawnNumber,inputPhoneId,inputName];
        let erros = 0;
        for(let element of arrayInputs){
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
        }
        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }

        popupLoading();

        let fetchResponse = await fetch(`${apiUrl}/${pageSlug}/popup.php`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: selectedModalId,
                drawnNumber:inputDrawnNumber.val(),
                phoneId: inputPhoneId.val(),
                name: inputName.val()
            })
        });

        let jsonResponse;
        try {
            jsonResponse = await fetchResponse.json();
        } catch (ex) {
            dispatchPopup('error', 'Ops! ocorreu um erro.', 'Não foi possível verificar o retorno da sua solicitação. Por favor, tente novamente mais tarde.');
            console.log(ex);
            return false;
        }

        if (fetchResponse.status != 200) {
            dispatchPopup('warning', 'Atenção', (jsonResponse.message || 'Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.'));
            return false;

        }
        wrapperRegisterParticipant.fadeOut();

        defaultModal.hide();
        for(let element of arrayInputs){ element.val('')}
        dispatchPopup('success', 'Pronto!', 'Cadastro realizado com sucesso.').then(function () {
            renderDefault();
        });


    })

    maskInputs();


});

async function renderDefault() {
    return new Promise(async function (res, rej) {
        const id = $('#get_id').val();

        const dataTablesWrapper = document.querySelector('#datatables-models');
        var result;
        try {
            result = await fetchDefault(id);
        } catch (e) {
            res(false);
            return;
        }
        //// TRATAMENTO DOS DADOS ////

        $('.title-header').text(result.tree);

        dataTablesWrapper.innerHTML = '';

        let data = result.results;

        if (data == null || data.length < 1) {

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

        function montaHTMLTabela(campos) {
            var strCampos = ``;
            for (let campo of campos) {
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

        for (let index in data) {

            let row = data[index];
            let strRow = '';

            for (let campo of campos) {
                let field = '--';

                // CUSTOM FIELDS //
                switch (campo.key) {
                    case 'price':
                        if (row[campo.key] != null) {

                            field = `R$ ${parseFloat(row[campo.key]).toLocaleString('pt-br', { minimumFractionDigits: 2 })}`;
                        }
                        break;
                    case 'raffleDate':
                        let raffleDate = row[campo.key];

                        if (raffleDate != null) {
                            raffleDate = raffleDate.split('-');
                            raffleDate = `${raffleDate[2]}/${raffleDate[1]}/${raffleDate[0]}`;
                        } else {
                            raffleDate = '--';
                        }
                        field = raffleDate;

                        break;
                    case 'referenceCode':
                        if (row[campo.key] != null) {
                            let referenceCode = row[campo.key];
                            referenceCode = referenceCode < 10 ? '0' + referenceCode : referenceCode;
                            field = `${result.reference}S${referenceCode}`;
                        }
                        break;
                    case 'status':
                        if (row[campo.key] != null) {
                            field = row[campo.key] == 1 ? '🟢 Ativo' : '🔴';
                        }
                        break;
                    case 'actions':
                        field = `
                        <div class="d-flex justify-content-end">
                            <button data-action="delete" title="Deletar" data-id="${row.idRaffle}" class="btn btn-danger d-flex justify-content-between align-items-center me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
                            <a title="Editar" href="${baseAdminUrl}${pageSlug}/editar/${row.idRaffle}" class="btn btn-secondary d-flex justify-content-between align-items-center me-2">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </a>
                            <a title="Prêmios" href="${baseAdminUrl}${pageSlug}/acessar/${row.idRaffle}" class="me-2">
                                <button class="btn btn-info d-flex">
                                    <i class="fa fa-gift"></i>
                                </button>
                            </a>       
                            <a title="Participantes" data-modal="default" data-id="${row.idRaffle}" class="me-2">
                                <button class="btn btn-success d-flex">
                                    <i class="fa fa-user"></i>
                                </button>
                            </a>       
                        </div>
                        
                        `;

                        break;
                    default:
                        if (row[campo.key] != null) {
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
            scrollX: true,
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


        res(true);

        Swal.close();


    });

}



