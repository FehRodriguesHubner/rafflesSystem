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
            label: 'Novo Cadastro',
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

    const nameInput       = document.getElementById('name');
    const cpfInput       = document.getElementById('cpf');
    const rgInput       = document.getElementById('rg');
    const emailInput       = document.getElementById('email');
    const phoneInput       = document.getElementById('phone');
    const cellphoneInput       = document.getElementById('cellphone');
    const birthdayInput       = document.getElementById('birthday');
    const cityInput       = document.getElementById('city');
    const occupationInput       = document.getElementById('occupation');
    const roleInput       = document.getElementById('role');
    const sindInput       = document.getElementById('sind');
    

    // INPUTS
    const arrayInputs = [
        {
            input: nameInput,
            value: ''
        },
        {
            input: cpfInput,
            value: ''
        },
        {
            input: rgInput,
            value: ''
        },
        {
            input: emailInput,
            value: ''
        },
        {
            input: phoneInput,
            value: ''
        },
        {
            input: cellphoneInput,
            value: ''
        },
        {
            input: birthdayInput,
            value: ''
        },
        {
            input: cityInput,
            value: ''
        },
        {
            input: occupationInput,
            value: ''
        },
        {
            input: roleInput,
            value: ''
        },
        {
            input: sindInput,
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

    $('#cpf').mask('000.000.000-00');
    $('#rg').mask('00.000.000-00');
    $('#phone').mask('(00) 0000-0000');
    $('#cellphone').mask('(00) 00000-0000');
    $('#birthday').mask('00/00/0000');

    //orientação sexual
    let count = 0;
    for(let genero of generos){
        count++;
        let id = `chk-genero-${count}`;

        $('#generos-wrapper').append(`

            <label class="chk-container text-gray">
                <input id="${id}" name="chk-genero" value="${genero}" type="checkbox">
                <span class="checkmark translate-middle-y top-50"></span>
                ${genero}
            </label>
        `);
    }
    //GENEROS
    count = 0;
    for(let genero of generos2){
        count++;
        let id = `rb-genero-${count}`;

        $('#generos2-wrapper').append(`

            <label class="chk-container radio text-gray">
                <input id="${id}" name="rb-genero" value="${genero}" type="radio">
                <span class="checkmark translate-middle-y top-50"></span>
                ${genero}
            </label>
        `);
    }

    //ETNIA
    count = 0;
    for(let etnia of etnias){
        count++;
        let id = `rb-etnia-${count}`;

        $('#etnias-wrapper').append(`
            <label class="chk-container radio text-gray">
                <input id="${id}" name="rb-etnia" value="${etnia}" type="radio">
                <span class="checkmark translate-middle-y top-50"></span>
                ${etnia}
            </label>
        `);
    }

    //GROUP
    for(let group of allGroups){
        let id = `chk-group-${group.id}`;
        let nome = group.name;

        $('#grupos-wrapper').append(`
            <label class="chk-container text-gray">
                <input id="${id}" name="chk-group" value="${group.id}" type="checkbox">
                <span class="checkmark translate-middle-y top-50"></span>
                ${nome}
            </label>
        `);

        $('#sind').append(`
            <option value="${group.id}">
                ${nome}
            </option>
        `);

    }
    


    window.document.getElementById('form-model').addEventListener('submit',async function(ev){
        ev.preventDefault();
        ev.stopImmediatePropagation();
        
        let erros = 0;

        if (!inputValidation(nameInput.value.trim())) {
            triggerInputError(nameInput, 'Insira um nome válido!');
            erros++
        }


        if (!inputValidation(cellphoneInput.value.trim(),'cellphone')) {
            triggerInputError(cellphoneInput, 'Informe um celular válido');
            erros++
        }

        if (!inputValidation(sindInput.value.trim())) {
            triggerInputError(sindInput, 'Informe um sindicato base');
            erros++
        }

        if (erros > 0) {
            dispatchPopup('warning','Atenção', 'Verifique os campos destacados.');
            return null;
        }

        // REQUISIÇÃO
        popupLoading();

        let generosArray = [];

        $('[name="chk-genero"]:checked').each(function(){
            generosArray.push($(this).val());
        });

        if(generosArray.length > 0){
            generosArray = JSON.stringify(generosArray);
        }else{
            generosArray = null;
        }

        let genero = $('[name="rb-genero"]:checked').val();
        let etnia = $('[name="rb-etnia"]:checked').val();
        
        let groupsArray = [];
        $('[name="chk-group"]:checked').each(function(){
            groupsArray.push($(this).val());
        });

        if (!groupsArray.includes(sindInput.value)) {
            // Se não estiver, adiciona-o ao array
            groupsArray.push(sindInput.value);
        }

        let fetchResponse = await fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body:JSON.stringify({
                name: nameInput.value,
                cpf: cpfInput.value,
                rg: rgInput.value,
                email: emailInput.value,
                password: "12345",
                role: roleInput.value || 'Não definido',
                
                sind: sindInput.value,
                phone: phoneInput.value,
                cellphone: cellphoneInput.value,
                birthday: birthdayInput.value,
                city: cityInput.value,
                occupation: occupationInput.value,
                ethnicity: etnia,
                age: "1",
                sexual_orientation: generosArray,
                gender:genero,
                groups_ids:groupsArray
            })
        });

        if(fetchResponse.status != 201){
            dispatchPopup('error','Ops! ocorreu um erro.','Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');
    
            return false;

        }

        dispatchPopup('success','Pronto!','Cadastro realizado com sucesso.').then(function(){
            window.location.href = baseAdminUrl + '/congressos/acessar?id=' + $('#id_group').val();
        });

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
