checkCookie();
const apiToken = getCookie('token');

window.addEventListener('DOMContentLoaded', async function(){
    //header nav
    renderHeaderPath([
        {
            label: 'Grupos',
            link: baseAdminUrl + '/congressos'
        },
        {
            label: 'Cadastro',
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

function formConfig(){

    const nameInput       = document.getElementById('name');
    const descriptionInput       = document.getElementById('description');
    
    const arrayInputs = [
        {
            input: nameInput,
            value: ''
        },
        {
            input: descriptionInput,
            value: ''
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
            triggerInputError(descriptionInput, 'Insira uma descrição válida!');
            erros++
        }

        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }

        // REQUISIÇÃO
        popupLoading();
        let fetchResponse = await fetch(`${apiUrl}/groups`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body:JSON.stringify({
                name: nameInput.value,
                description:descriptionInput.value
            })
        });

        if(fetchResponse.status != 201){
            dispatchPopup('error','Ops! ocorreu um erro.','Por favor, tente novamente mais tarde.');
            return false;
        }

        dispatchPopup('success','Pronto!','Cadastro realizado com sucesso.').then(function(){
            window.location.href = baseAdminUrl + '/congressos';
        });

    });

}


async function renderInputs(arrayInputs){

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