window.addEventListener('DOMContentLoaded', async function () {
    // header nav
    renderHeaderPath([
        {
            label: '<i class="fa-solid fa-house"></i> Home',
            link: baseAdminUrl + '/home'
        },
        {
            label: 'Histórico de disparos',
            link: null
        },
    ]);

    //aside
    renderPageActive('historico-disparos');

    //user data
    renderUserDataReplace();

    //content grid
    renderDisparos();



});

function fetchDisparos() {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/servicos/disparos/historico-disparos.php`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        });

        let fetchJsonResponse;

                if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            try {
                fetchJsonResponse = await fetchResponse.json();
            } catch (except) {

                dispatchPopup(
                    'error',
                    'Ops!',
                    'Ocorreu um erro com o resultado do processo. Por favor, atualize a página ou volte novamente mais tarde'
                );

                res(false);
                return;
            }

            dispatchPopup(
                'error',
                'Ops!',
                (fetchJsonResponse.message ? fetchJsonResponse.message : 'Ocorreu um erro. Por favor, atualize a página ou volte novamente mais tarde')
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
                'Ocorreu um erro ao processar o resultado dos dados. Por favor, atualize a página ou volte novamente mais tarde'
            );

            res(false);
            return;
        }

        res(fetchJsonResponse);

    });
}
var dataTablesDisparo = null;
async function renderDisparos() {
    return new Promise(async function (res, rej) {
        var dadosDisparos = {};
        var dataTablesContatos = null;

        if (dataTablesDisparo != null) {
            dataTablesDisparo.destroy();
            popupLoading();
        }

        const dataTablesWrapper = document.querySelector('#datatables-disparos');
        bloquearAtt = true;
        let result = await fetchDisparos();
        bloquearAtt = false;
        if (result === false) {
            res(false);
            return false;
        }

        let disparos = result.array_disparos;

        dataTablesWrapper.innerHTML = '';

        if (result.count < 1) {

            dataTablesWrapper.classList.remove('card-profile', 'p-lg-4', 'p-md-3', 'p-2')

            dataTablesWrapper.innerHTML = /*html*/`
            <div class="d-flex flex-column">
                <p class="message-on-container mb-4">Nenhum disparo registrado até o momento.</p>
                <a href="${baseAdminUrl}/servicos/disparos">
                    <button class="button-default bg-blue color-white" hover="brightness">Disparos em massa</button>
                </a>     
            </div>
    
            `;
            res(false);

            return false;

        }


        dataTablesWrapper.innerHTML = /*html*/ `
            <table class="table table-striped" width="100%">
                <thead>
                    <tr>
                        <th>
                            Situação
                        </th>

                        <th>
                            Início do disparo
                        </th>
                        
                        <th>
                            Progresso
                        </th>
                        <th>
                            Conclusão
                        </th>
                        <th>
                            Opções
                        </th>
                    </tr>
                </thead>
    
                <tbody>
    
                </tbody>
    
                <tfoot>
                </tfoot>
    
            </table>
        `;



        for (let index in disparos) {

            let disparo = disparos[index];

            let idDisparo = disparo['id_disparo'];

            let inicioDisparo = disparo['iniciado'];
            let fimDisparo = disparo['finalizado'];

            let progresso = `${disparo['progresso']}/${disparo['total']}`;

            dadosDisparos[idDisparo] = {
                'dados_disparo': disparo['dados_disparo'],
                'dados_resultado': disparo['dados_resultado'],
            };

            let dataSort = transformarData(inicioDisparo);

            let sitText = disparo.execucao == false ?
                `   <div class="fw-bold text-success">
                        <i style="font-size:20px" class="fa-solid fa-circle-check"></i>&nbsp;Concluído
                    </div> `:

                `   <div class="fw-bold text-warning d-flex align-items-center">
                        <div class="spinner-grow text-warning" style="width:20px; height:20px;" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>&nbsp;Em progresso
                    </div>`;

            dataTablesWrapper.querySelector('tbody').insertAdjacentHTML('beforeend',/*html*/ `
                <tr>
                    <td>
                        ${sitText}
                    </td>
                    
                    <td data-sort="${dataSort}">
                        ${inicioDisparo}
                    </td>

                    <td>
                        ${progresso}
                    </td>

                    <td>
                        ${fimDisparo}
                    </td>
                    
                    <td class="text-end">
                        <div class="d-flex w-100">
                            <a class="ms-auto me-2">
                                <button data-show-disparo="${idDisparo}" class="btn btn-info d-flex">
                                    <i class="fa-solid fa-eye"></i>
                                </button>
                            </a>
                        </div>
                    </td>
                </tr>
            `);

        }


        dataTablesDisparo = $('#datatables-disparos table').DataTable({
            responsive: true,
            language: {
                url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
            },
            order: [[1, 'desc']]
        });


        $('[data-show-disparo]').on('click', function () {

            let idDisparo = $(this).attr('data-show-disparo');

            let dados = dadosDisparos[idDisparo];
            console.log(dadosDisparos);
            let dadosResultado = dados['dados_resultado'];

            if (dadosResultado != null) {


                const modalDisparo = new bootstrap.Modal(document.getElementById('modal-disparo'));

                if (dataTablesContatos != null) {
                    dataTablesContatos.destroy();
                }

                $('#table-contatos').empty();
                $('#table-contatos').html(`
                    <thead>
                        <tr>
                            <td>
                                Situação
                            </td>
                            <td>
                                Telefone
                            </td>
                            <td>
                                Descrição
                            </td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                `);


                for (let resultado of dadosResultado) {

                    let sitText = resultado.error ?
                        `   <div class="fw-bold text-danger">
                                <i style="font-size:20px" class="fa-solid fa-circle-xmark"></i>&nbsp;Não enviado
                            </div> ` :
                        `   <div class="fw-bold text-success">
                                <i style="font-size:20px" class="fa-solid fa-circle-check"></i>&nbsp;Enviado
                            </div> `;

                    let descText = resultado.error ? resultado.message : '--';

                    $('#table-contatos tbody').append(`

                        <tr>
                            <td>
                                ${sitText}
                            </td>
                            <td class="texto-limitado">
                                ${resultado.envio.numero}
                            </td>
                            <td class="texto-limitado" style="max-width:250px">
                                ${descText}
                            </td>
                        </tr>

                    `);

                }

                dataTablesContatos = $('#table-contatos').DataTable({
                    responsive: true,
                    language: {
                        url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
                    },
                });

                modalDisparo.show();


            } else {
                dispatchPopup(
                    'warning',
                    'Nada pra mostrar aqui',
                    'Esse disparo ainda não tem dados a serem exibidos'
                );
            }


        });

        res(true);
        setTimeout(function(){
            Swal.close();
        },1000)

    });
}


function transformarData(dataString) {
    // Primeiro, remova os caracteres não numéricos da string
    const numeros = dataString.replace(/[^\d]/g, '');

    // Em seguida, reordene os números no formato desejado
    const ano = numeros.slice(4, 8);
    const mes = numeros.slice(2, 4);
    const dia = numeros.slice(0, 2);
    const hora = numeros.slice(8, 10);
    const minuto = numeros.slice(10, 12);

    // Combine os valores reordenados
    const dataTransformada = ano + mes + dia + hora + minuto;

    return dataTransformada;
}


let intervaloDeClique;
let bloquearAtt = true;
function clicarNoBotao() {
    if(!bloquearAtt){
        renderDisparos();
    }
}

function iniciarCliqueAutomatico() {
    intervaloDeClique = setInterval(clicarNoBotao, 10000); // 10000 milissegundos = 10 segundos
}

function pararCliqueAutomatico() {
    clearInterval(intervaloDeClique);
}

document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible') {
        iniciarCliqueAutomatico();
    } else {
        pararCliqueAutomatico();
    }
});

// Iniciar o clique automático quando a página é carregada
iniciarCliqueAutomatico();