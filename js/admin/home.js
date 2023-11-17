window.addEventListener('DOMContentLoaded', async function () {
    // header nav
    renderHeaderPath([{
        label: '<i class="fa-solid fa-house"></i> Home',
        link: null
    }]);

    renderPageActive('home');

    //user data
    renderUserDataReplace();


    // STATUS INSTANCIA
    renderStatusInstancia();

});

function fetchInstancia() {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/instancia/verificar.php`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            }
        });

        let fetchJsonResponse;

        if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao buscar as informações da instância. Por favor, atualize a página ou volte novamente mais tarde'
            );

            res(false);

            return;
        }


        try {
            fetchJsonResponse = await fetchResponse.json();
        } catch (except) {

            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro ao analisar as informarções da instância. Por favor, atualize a página ou volte novamente mais tarde'
            );

            res(false);
            return;
        }

        res(fetchJsonResponse);

    });
}


async function renderStatusInstancia() {

    const fetchStatusInstancia = async () => {
        return new Promise(async function (res, rej) {

            let fetchResponse = await fetch(`${apiUrl}/instancia/verificar.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                }
            });

            var jsonRequestData;

            try {

                jsonRequestData = await fetchResponse.json();

            } catch (except) {
                console.log(except);
            }

                    if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
                res(false);
            }

            res(jsonRequestData);

        });

    }
    const fetchLimparInstancia = async () => {
        return new Promise(async function (res, rej) {

            let fetchResponse = await fetch(`${apiUrl}/instancia/limpar.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                }
            });

            var jsonRequestData;

            try {

                jsonRequestData = await fetchResponse.json();

            } catch (except) {
                console.log(except);
            }

                    if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
                res(false);
            }

            res(jsonRequestData);

        });

    }
    const fetchInstanciaWpp = async (data) => {
        return new Promise(async function (res, rej) {

            let fetchResponse = await fetch(`${apiUrl}/instancia/conectar.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                'body': JSON.stringify(data)
            });

            var jsonRequestData;

            try {

                jsonRequestData = await fetchResponse.json();

            } catch (except) {

                dispatchPopup('error','Atenção','Não foi possível verificar a instância no momento. Por favor, tente novamente mais tarde'
                );

                res(false);
                return;

            }

                    if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {

                dispatchPopup('warning','Atenção',jsonRequestData.message);
                res(false);

            } else {
                res(jsonRequestData);
            }


        });

    }

    var firstTime = true;
    // WPP ////////////////////////////

    const modalWPP = $("#custom-modal-wpp");

    var execStatusWpp = false;

    function attHTMLStatusWpp(instanciaResult) {
        const data = instanciaResult.instancia;

        const wppStatus = document.getElementById("instancia-wpp-status");
        const wppStatusText = document.getElementById("wpp-status-text");
        const wppStatusIcon = document.getElementById("wpp-status-icon");
        const wppDesc = document.getElementById("wpp-desc");
        const btnConecta = document.getElementById("btn-wpp-conecta");
        const btnLimpa = document.getElementById("btn-wpp-limpa");


        console.log(data);
        if (!data.existe || (data.existe && !data.instancia.auth && data.instancia.qr == null)) {
            wppStatusText.textContent = "Não conectado";
            wppStatusIcon.className = "fa fa-times-circle"; // Ícone de erro
            wppDesc.innerHTML = "Sua instância não está conectada no momento, clique no botão abaixo para inciar a conexão da instância!"; // Limpar wpp-desc
            btnConecta.style.display = "block";
            btnLimpa.style.display = "none";
            execStatusWpp = false;
            wppStatus.className = 'instancia-status text-danger';
        } else if (data.instancia.auth === true) {
            wppStatusText.textContent = "Conectado";
            wppStatusIcon.className = "fa fa-check-circle"; // Ícone de sucesso
            wppDesc.innerHTML = "Sua instância está conectada e pronta para uso!"; // Limpar wpp-desc
            btnConecta.style.display = "none";
            btnLimpa.style.display = "block";
            execStatusWpp = false;
            wppStatus.className = 'instancia-status text-success';

            $('#status-instancia').val(1);

        } else if (!data.instancia.auth && data.instancia.qr !== null) {
            execStatusWpp = true;
            wppStatusText.textContent = "Em processo de conexão...";
            wppStatusIcon.className = "fa fa-spinner fa-spin"; // Ícone de carregamento
            ////

            wppDesc.innerHTML = `
                        <p>Escaneie o código abaixo e aguarde a conexão ser feita:</p>
                        <div id="img-qr" class="d-flex justify-content-center"></div>
                    `;

            let qrcode = new QRCode(document.getElementById("img-qr"),
                {
                    text: data.instancia.qr,
                    width: 250,
                    height: 250,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

            btnConecta.style.display = "none";
            btnLimpa.style.display = "block";
            wppStatus.className = 'instancia-status text-warning';
        }

        Swal.close();

    }

    async function updateStatusWpp() {
        const instanciaResult = await fetchStatusInstancia();

        if(instanciaResult === false){
            execStatusWpp = false;
            dispatchPopup(
                'error',
                'Algo deu errado',
                'Ocorreu um erro ao verificar o status da Instância. Por favor, tente novamente mais tarde.'
            ).then(function(){
                location.reload();
            });
            return;
        }

        if(firstTime){
            $('[data-switch-load-view]').toggleClass('d-none');
            firstTime = false;
        }

        if (execStatusWpp != false) {
            execStatusWpp = false;
            attHTMLStatusWpp(instanciaResult);
            return true;
        }
    }
    
    var intervalStatusWpp = setInterval(function () {
        if ($('#wppDisplayDados').is(":visible")) {
            if (execStatusWpp == true) {
                updateStatusWpp();
            }
        }
    }, 8000);

    loadWppStatus();

    function loadWppStatus() {

        dispatchPopup(
            'info',
            'Verificando Instância...',
            'Buscando informações, aguarde!',
            {
                didOpen: () => {
                    Swal.showLoading()
                },
                showConfirmButton: false,
                allowOutsideClick: false
            }
        );
        execStatusWpp = true;
        updateStatusWpp();
    }

    //////////////////////// BOTOES

    $('#btn-wpp-conecta').on('click', async function () {
        execStatusWpp = false;


        Swal.fire({
            icon: 'info',
            title: 'Processando integração...',
            text: 'Aguarde, estamos estabelecendo sua conexão com o Whatsapp. Esse procedimento pode levar alguns instântes',
            didOpen: () => {
                Swal.showLoading()
            },
            showConfirmButton: false,
            allowOutsideClick: false
        });

        let result = await fetchInstanciaWpp();

        execStatusWpp = true;

        if (result == false) {

            return;
        }

        attHTMLStatusWpp({ instancia: { existe: true, instancia: result.instancia } });


    });

    $('#btn-wpp-limpa').on('click', async function () {
        execStatusWpp = false;


        Swal.fire({
            icon: 'info',
            title: 'Executando limpeza',
            text: 'Processando... aguarde!',
            didOpen: () => {
                Swal.showLoading()
            },
            showConfirmButton: false,
            allowOutsideClick: false
        });


        let result = await fetchLimparInstancia({
            "integracao": $('#id_integracao').val()
        });


        if (result == false) {
            dispatchPopup(
                'error',
                'Ocorreu um erro',
                'Não foi possível efetuar a limpeza da instancia no momento.'
            ).then(function () {
                execStatusWpp = true;
                loadWppStatus();
            });
            return;
        }

        execStatusWpp = true;
        loadWppStatus();

    });
}

$(function(){

    function fetchListaChat() {
        return new Promise(async function (res, rej) {
            let fetchResponse = await fetch(`${apiUrl}/servicos/dados/listar_chats.php`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
    
            let fetchJsonResponse;
    
                    if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
                dispatchPopup(
                    'error',
                    'Ops!',
                    'Ocorreu um erro ao buscar os dados da exportação. Por favor, atualize a página ou volte novamente mais tarde'
                );
    
                res(false);
    
                return;
            }
    
    
            try {
                fetchJsonResponse = await fetchResponse.json();
            } catch (except) {
    
                dispatchPopup(
                    'error',
                    'Ops!',
                    'Ocorreu um erro ao analisar o resultado da exportação. Por favor, atualize a página ou volte novamente mais tarde'
                );
    
                res(false);
                return;
            }
    
            res(fetchJsonResponse);
    
        });
    }

    function fetchListaContatos() {
        return new Promise(async function (res, rej) {
            let fetchResponse = await fetch(`${apiUrl}/servicos/dados/listar_contatos.php`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                }
            });
    
            let fetchJsonResponse;
    
                    if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
                dispatchPopup(
                    'error',
                    'Ops!',
                    'Ocorreu um erro ao buscar os dados da exportação. Por favor, atualize a página ou volte novamente mais tarde'
                );
    
                res(false);
    
                return;
            }
    
    
            try {
                fetchJsonResponse = await fetchResponse.json();
            } catch (except) {
    
                dispatchPopup(
                    'error',
                    'Ops!',
                    'Ocorreu um erro ao analisar o resultado da exportação. Por favor, atualize a página ou volte novamente mais tarde'
                );
    
                res(false);
                return;
            }
    
            res(fetchJsonResponse);
    
        });
    }
    
    var dataTablesExportados = null;
    
    $('#btn-exportar-chats').on('click',async function(){

        if(!checkInstancia(false)){
            return;
        }

        popupLoading();

        let result = await fetchListaChat();

        if(!result){
            return;
        }

        const modalContatos = new bootstrap.Modal(document.getElementById('modal-contatos'));

        $('#modalContatosTitle').text('Contatos de Chat Exportados');

        if (dataTablesExportados != null) {
            dataTablesExportados.destroy();
            popupLoading();
        }

        $('#table-contatos').empty();
        $('#table-contatos').html(`
                <thead>
                <tr>
                    <th>
                        nome
                    </th>
                    <th>
                        telefone
                    </th>
                    <th>
                        última mensagem
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot></tfoot>
        `);

        // CHAT

        for(let contato of result.chats){

            let name = contato['name'];
            let timestamp = contato['timestamp'];
            let telefone = contato['telefone'];
            let data = contato['data'];

            $('#table-contatos tbody').append(`
                <tr>
                    <td data-sort="${name.normalize('NFD').replace(/[\u0300-\u036f]/g, '')}">
                        ${name}
                    </td>
                    <td>
                        ${telefone}
                    </td>
                    <td data-sort="${timestamp}">
                        ${data}
                    </td>
                </tr>
            `);

        }


        dataTablesExportados = $('#table-contatos').DataTable({
            dom: 'Blfrtip',
            "buttons": [
                {
                    extend: 'excelHtml5', // Configura o botão para exportar para o formato Excel
                    text: `<i class="fa fa-download"></i>
                    &nbsp
                    Baixar Excel `,
                    className: 'btn btn-success'
                    
                },
                {
                    extend: 'print',
                    orientation: 'landscape',
                    pageSize: 'a3',
                    text: `<i class="fa fa-print"></i>
                    &nbsp
                    Imprimir `,
                    className: 'btn btn-warning'
                }
            ],
            responsive: true,
            language: {
                url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
            },
            order: [[2, 'desc']]
        });

        Swal.close();

        modalContatos.show();


    });

    $('#btn-exportar-contatos').on('click',async function(){

        if(!checkInstancia(false)){
            return;
        }

        popupLoading();

        let result = await fetchListaContatos();

        if(!result){
            return;
        }

        const modalContatos = new bootstrap.Modal(document.getElementById('modal-contatos'));

        $('#modalContatosTitle').text('Contatos Exportados');

        if (dataTablesExportados != null) {
            dataTablesExportados.destroy();
            popupLoading();
        }

        $('#table-contatos').empty();
        $('#table-contatos').html(`
                <thead>
                <tr>
                    <th>
                        nome
                    </th>
                    <th>
                        telefone
                    </th>
                </tr>
            </thead>
            <tbody></tbody>
            <tfoot></tfoot>
        `);

        // CHAT

        for(let contato of result.contatos){

            let name = contato['name'];
            let telefone = contato['telefone'];

            $('#table-contatos tbody').append(`
                <tr>
                    <td>
                        ${name}
                    </td>
                    <td>
                        ${telefone}
                    </td>
                </tr>
            `);

        }


        dataTablesExportados = $('#table-contatos').DataTable({
            dom: 'Blfrtip',
            "buttons": [
                {
                    extend: 'excelHtml5', // Configura o botão para exportar para o formato Excel
                    text: `<i class="fa fa-download"></i>
                    &nbsp
                    Baixar Excel `,
                    className: 'btn btn-success'
                    
                },
                {
                    extend: 'print',
                    orientation: 'landscape',
                    pageSize: 'a3',
                    text: `<i class="fa fa-print"></i>
                    &nbsp
                    Imprimir `,
                    className: 'btn btn-warning'
                }
            ],
            responsive: true,
            language: {
                url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
            },
            order: [[0, 'asc']]
        });

        Swal.close();

        modalContatos.show();


    });

});