checkCookie();
const apiToken = getCookie('token');

window.addEventListener('DOMContentLoaded', async function(){
    // header nav
    renderHeaderPath([{
        label: 'Grupos',
        link: null
    }]);

    await renderAsideGroups();

    renderPageActive('congressos');

    //user data
    renderUserDataReplace();

    //content grid
    renderCategoriesGrid();

});

function fetchCategories() {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/groups`, {
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
                'Ocorreu um erro ao buscar os congressos. Por favor, atualize a página ou volte novamente mais tarde'
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
                'Ocorreu um erro ao analisar os congressos. Por favor, atualize a página ou volte novamente mais tarde'
            );
            
            res(false);
            return;
        }

        res(fetchJsonResponse);

    });
}

function fetchDeleteCategory(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/groups/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            }
        });


                if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            dispatchPopup(
                'error',
                'Ops!',
                'Ocorreu um erro tentar deletar o congresso. Por favor, atualize a página ou volte novamente mais tarde'
            );

            res(false);

            return;
        }

        res(true);

    });
}

async function renderCategoriesGrid(){
    return new Promise(async function(res,rej){
        const dataTablesWrapper = document.querySelector('#datatables-categories');
    
        let result = await fetchCategories();
    
        if(result === false){
            res(false);
            return false;
        }
    
        let categories = result.groups;
    
        dataTablesWrapper.innerHTML = '';
    
        if(result.count < 1){
    
            dataTablesWrapper.classList.remove('card-profile', 'p-lg-4', 'p-md-3', 'p-2')
    
            dataTablesWrapper.innerHTML = /*html*/`
            <div class="d-flex flex-column">
                <p class="message-on-container mb-4">Nenhuma congresso cadastrado no momento.</p>
                <a href="${baseAdminUrl}/congressos/cadastrar">
                    <button class="button-default bg-blue color-white" hover="brightness">Cadastrar</button>
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
                            Nome
                        </th>
                        <th>
                            Ação
                        </th>
                    </tr>
                </thead>
    
                <tbody>
    
                </tbody>
    
                <tfoot>
                </tfoot>
    
            </table>
        `;


    
        for(let index in categories){
    
            let category = categories[index];

    
            dataTablesWrapper.querySelector('tbody').insertAdjacentHTML('beforeend',/*html*/ `
                <tr>
                    <td>
                        <div>
                            <b class="text-capitalize">
                                ${category.name}
                            </b>
                        </div>
                    </td>
                    <td class="text-end">
                        <div class="d-flex w-100">
                            <a href="${baseAdminUrl}/congressos/acessar?id=${category.id}" class="ms-auto me-2">
                                <button data-id="${category._id}" class="btn btn-success d-flex ">
                                    Acessar
                                </button>
                            </a>
                            <button data-action="delete" data-id="${category.id}" class="btn btn-danger d-flex justify-content-between align-items-center ">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
    
                            <a href="${baseAdminUrl}/congressos/editar/${category.id}" class="btn btn-secondary d-flex ms-2 d-flex justify-content-between align-items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </a>

                        </div>
                    </td>
                </tr>
            `);
    
        }
    
    
        $('#datatables-categories table').DataTable({
            responsive: true,
            language: {
                url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
            },
        });
    
    
        const deleteButtons = document.querySelectorAll('[data-action="delete"]');
    
        for(const button of deleteButtons){
    
            button.addEventListener('click', function(ev){
                ev.preventDefault();
    
                const id = button.getAttribute('data-id');
    
                dispatchPopup(
                    'warning',
                    'Atenção',
                    'Deseja mesmo deletar essa congresso?',
                    {
                        confirmButtonText:'Deletar',
                        showCancelButton:true,
                        cancelButtonText:'Cancelar',
                        reverseButtons:true
                    },{
                        confirmButton: 'popup-confirm-custom button-default bg-red w-100 color-white',
                    }
                ).then(async function(result){
                    if(result.isConfirmed){
                        popupLoading();
                        let result = await fetchDeleteCategory(id);
                        if(result){
                            await renderCategoriesGrid();
                            Swal.close();
                        }
                    }
                });
    
            });
    
        }

        res(true);

    });

}
