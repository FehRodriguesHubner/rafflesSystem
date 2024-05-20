checkCookie();
const apiToken = getCookie('token');

window.addEventListener('DOMContentLoaded', async function(){
    // header nav

    renderHeaderPath([

        {
            label: 'Grupos',
            link: baseAdminUrl + '/congressos'
        },
        {
            label: 'Cadastros',
            link: null
        },

    ]);

    await renderAsideGroups();

    let idGroup = document.getElementById('id_group').value;

    if(idGroup != ''){
        renderPageActive(idGroup);
    }else{
        renderPageActive('todos');
    }


    //user data
    renderUserDataReplace();

    //content grid
    renderModelsGrid();

});

function fetchModels() {
    return new Promise(async function (res, rej) {
        
        let idGroup = document.getElementById('id_group').value;
        let url;

        if(idGroup != ''){
            url = `${apiUrl}/users?groups=${idGroup}`;
        }else{
            url = `${apiUrl}/users`
        }

        let fetchResponse = await fetch(`${apiUrl}/users?groups=${idGroup}`, {
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
                'Ocorreu um erro ao buscar os dados. Por favor, atualize a página ou volte novamente mais tarde'
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
                'Ocorreu um erro ao buscar os dados. Por favor, atualize a página ou volte novamente mais tarde'
            );
            
            res(false);
            return;
        }

        res(fetchJsonResponse);

    });
}

function fetchDeleteModel(id) {
    return new Promise(async function (res, rej) {
        let fetchResponse = await fetch(`${apiUrl}/users/${id}`, {
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
                'Ocorreu um erro tentar deletar o cadastro. Por favor, atualize a página ou volte novamente mais tarde'
            );

            res(false);

            return;
        }

        res(true);

    });
}

async function renderModelsGrid(){
    return new Promise(async function(res,rej){
        const dataTablesWrapper = document.querySelector('#datatables-models');
    
        let result = await fetchModels();
    
        if(result === false){
    
            res(false);
            return false;
            
    
        }
    
        let models = result.users;
    
        dataTablesWrapper.innerHTML = '';
    
        if(models.length < 1){
    
            dataTablesWrapper.classList.remove('card-profile', 'p-lg-4', 'p-md-3', 'p-2')
    
            dataTablesWrapper.innerHTML = /*html*/`
            <div class="d-flex flex-column">
                <p class="message-on-container mb-4">Nenhum cadastro até o momento.</p>     
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
                            #
                        </th>
                        <th>
                            Nome
                        </th>
                        <th>
                            RG
                        </th>
                        <th>
                            CPF
                        </th>
                        <th>
                            Cargo
                        </th>
                        <th>
                            Telefone
                        </th>
                        <th>
                            Celular
                        </th>
                        <th>
                            Nascimento
                        </th>
                        <th>
                            Idade
                        </th>
                        <th>
                            Sind.Base
                        </th>
                        <th>
                            E-mail
                        </th>
                        <th>
                            Cidade
                        </th>
                        <th>
                            Ramo
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
    
        for(let index in models){
    
            let model = models[index];

            let json = {
                "_id": "643d7afb2c0d954efbf03a17",
                "name": "Admin Dev",
                "cpf": "999.999.999-99",
                "rg": "99999999",
                "email": "admin@admin.com",
                "password_hash": "$2b$10$gr7VrsBsKnRj/igIiPUdUe0dZ7Iq6Q.3i5OnOJA7G/rvIhKryoEBq",
                "role": "admin",
                "sind": {
                    "_id": "643d7af02c0d954efbf03a14",
                    "name": "Admin",
                    "description": "Description of the group",
                    "createdAt": "2023-04-17T16:59:28.536Z",
                    "updatedAt": "2023-04-17T16:59:28.536Z",
                    "__v": 0
                },
                "phone": "51 999999999",
                "cellphone": "51 999999999",
                "birthday": "11/04/2020",
                "city": "Porto Alegre, RS",
                "occupation": "51 999999999",
                "age": "2",
                "ethnicity": "string",
                "createdAt": "2023-04-17T16:59:39.306Z",
                "updatedAt": "2023-04-17T16:59:39.306Z",
                "__v": 0
            };
    
            

            let age = model.age;

            if(age == null){
                age = '';
            }

            dataTablesWrapper.querySelector('tbody').insertAdjacentHTML('beforeend',/*html*/ `
                <tr>

                    <td>
                        <div>
                            <input type="checkbox" name="sel-chk" value="${model.id}">
                        </div>
                    </td>
                    <td>
                        <div>
                            <b class="text-capitalize">
                                ${model.name}
                            </b>
                        </div>
                    </td>
                    <td>
                        <div>
                            ${model.rg || ''}
                        </div>
                    </td>
                    <td>
                        <div>
                            ${model.cpf || ''}
                        </div>
                    </td>
                    <td>
                        <div>
                            ${model.role}
                        </div>
                    </td>
                    <td>
                        <div>
                            ${model.phone || ''}
                        </div>
                    </td>
                    <td>
                        <div>
                            ${model.cellphone}
                        </div>
                    </td>

                    <td>
                        <div>
                            ${model.birthday || ''}
                        </div>
                    </td>
                    <td>
                        <div>
                            ${age}
                        </div>
                    </td>

                    <td>
                        <div>
                            ${model?.sind?.name || ''}
                        </div>
                    </td>

                    <td>
                        <div>
                            ${model.email}
                        </div>
                    </td>

                    <td>
                        <div>
                            ${model.city}
                        </div>
                    </td>


                    <td>
                        <div>
                            ${model.occupation || ''}
                        </div>
                    </td>

                    <td class="text-end">
                        <div class="d-flex w-100">
                            <button data-action="delete" data-id="${model.id}" class="btn btn-danger d-flex ms-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                                    <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                                </svg>
                            </button>
    
                            <a href="${baseAdminUrl}/congressos/cadastros/editar?id=${model.id}">
                                <button class="btn btn-primary d-flex ms-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
                                        <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
                                        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
                                    </svg>
                                </button>
                            </a>
                        </div>
                    </td>
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
                    className:'text-white fw-bold',
                    text: `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-square" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M10.97 4.97a.75.75 0 0 1 1.071 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.235.235 0 0 1 .02-.022z"/>
                    </svg>
                    &nbsp
                    Selecionar todos`,
                    action: function ( e, dt, node, config ) {
                        $('[name="sel-chk"]').each(function(){
                            $(this).prop('checked',!$(this).prop('checked'));
                        });
                    }
                },
                // {
                //     text: `
                //     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
                //         <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z"/>
                //     </svg>
                //     &nbsp
                //     Enviar whatsapp`,
                //     action: function ( e, dt, node, config ) {

                //     },
                //     className: 'btn-success fw-bold'
                // },
                {
                    extend: 'pdfHtml5',
                    orientation: 'landscape',
                    pageSize: 'a3',
                    text: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-down" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1h-2z"/><path fill-rule="evenodd" d="M7.646 15.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 14.293V5.5a.5.5 0 0 0-1 0v8.793l-2.146-2.147a.5.5 0 0 0-.708.708l3 3z"/></svg>
                    &nbsp
                    Download PDF `,
                    className: 'btn-warning fw-bold'
                },
            ],
            "columnDefs": [
                {
                  "targets": [1,2,3,4,5,6,7,8,9,10,11,12],
                  "width": "200px"
                }
            ]
        });
    
    
        const deleteButtons = document.querySelectorAll('[data-action="delete"]');
    
        for(const button of deleteButtons){
    
            button.addEventListener('click', function(ev){
                ev.preventDefault();
    
                const id = button.getAttribute('data-id');
    
                dispatchPopup(
                    'warning',
                    'Atenção',
                    'Deseja mesmo deletar esse cadastro?',
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
                        let result = await fetchDeleteModel(id);
                        if(result){
                            await renderModelsGrid();
                            Swal.close();
                        }
                    }
                });
    
            });
    
        }

        res(true);

    });

}
