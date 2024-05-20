checkCookie();
const apiToken = getCookie('token');

window.addEventListener('DOMContentLoaded',async function(){
    //header nav
    renderHeaderPath([
        {
            label: 'Grupos',
            link: baseAdminUrl + '/congressos'
        },
        {
            label: 'Edição',
            link: null
        },
    ]);
    await renderAsideGroups();
    //aside
    renderPageActive('congressos');

    //user data
    renderUserDataReplace();

    formConfig();

});


async function formConfig(){

    let result = await fetchCategory();

    if(result === false){
        return false;
    }
    
    let nameValue = result.name;
    let descriptionValue = result.description;

    const nameInput         = document.getElementById('name');
    const descriptionInput  = document.getElementById('description');
    
    const arrayInputs = [
        {
            input: nameInput,
            value: nameValue
        },
        {
            input: descriptionInput,
            value: descriptionValue
        },
    ];

    for(let index in arrayInputs){
        let element = arrayInputs[index].input;
        element.addEventListener('focus', function(el){
            cleanInputError(this);
        });
    }

    renderInputs(arrayInputs);

    window.document.getElementById('form-category').addEventListener('submit',async function(ev){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        
        let erros = 0;

        if (!inputValidation(nameInput.value.trim())) {
            triggerInputError(nameInput, 'Insira um nome válido!');
            erros++
        }
        if (!inputValidation(descriptionInput.value.trim())) {
            triggerInputError(descriptionInput, 'Insira um nome válido!');
            erros++
        }

        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }

        // REQUISIÇÃO

        const idCategory = document.querySelector('#id-category').value;

        popupLoading();
        let fetchResponse = await fetch(`${apiUrl}/groups/${idCategory}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body:JSON.stringify({
                name: nameInput.value,
                description: descriptionInput.value
            })
        });

        if(fetchResponse.status != 200){
            dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');

            return false;

        }

        dispatchPopup('success','Pronto!','Atualização realizada com sucesso.').then(function(){
            window.location.href = baseAdminUrl + '/congressos';
        });

    });

}

function fetchCategory() {
    return new Promise(async function (res, rej) {
        
        const idCategory = document.querySelector('#id-category').value;

        let fetchResponse = await fetch(`${apiUrl}/groups/${idCategory}`, {
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
                'Ocorreu um erro ao buscar as congressos. Por favor, atualize a página ou volte novamente mais tarde'
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
                'Ocorreu um erro ao buscar as congressos. Por favor, atualize a página ou volte novamente mais tarde'
            );
            
            res(false);
            return;
        }

        res(fetchJsonResponse);

    });
}


async function renderInputs(arrayInputs){

    let data = await getUserData();

    if(data == false){
        dispatchPopup('error','Ops!','Ocorreu um erro ao carregar os dados do usuário para a edição');
    }

    for(let index in arrayInputs){

        let jsonInput = arrayInputs[index];

        let input = jsonInput.input;

        input.value = jsonInput.value;

        if(!jsonInput.readonly){
            input.removeAttribute('readonly');
        }

        input.dispatchEvent(new Event('input'));
        input.closest('.placeholder-input').classList.remove('placeholder-input');
    }

}