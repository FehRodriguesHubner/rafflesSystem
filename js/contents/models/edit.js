checkCookie();
const apiToken = getCookie('token');

window.addEventListener('DOMContentLoaded', async function () {
    //header nav
    renderHeaderPath([
        {
            label: 'Grupos',
            link: baseAdminUrl + '/congressos'
        },
        {
            label: 'Editar Cadastro',
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


async function formConfig() {

    let result = await fetchModel();

    if (result === false) {
        return false;
    }

    let nameValue = result.name;
    let cpfValue = result.cpf;
    let rgValue = result.rg;
    let emailValue = result.email;
    let phoneValue = result.phone;
    let cellphoneValue = result.cellphone;
    let birthdayValue = result.birthday;
    let cityValue = result.city;
    let occupationValue = result.occupation;
    let sindValue = result.sind.id;
    let ethnicityValue = result.ethnicity;
    let sexualOrientation = result.sexual_orientation;
    let gender = result.gender;
    let roleValue = result.role;
    let groupsValues = result.groups;

    const nameInput = document.getElementById('name');
    const cpfInput = document.getElementById('cpf');
    const rgInput = document.getElementById('rg');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const cellphoneInput = document.getElementById('cellphone');
    const birthdayInput = document.getElementById('birthday');
    const cityInput = document.getElementById('city');
    const occupationInput = document.getElementById('occupation');
    const sindInput = document.getElementById('sind');
    const roleInput = document.getElementById('role');

    const arrayInputs = [
        {
            input: nameInput,
            value: nameValue
        },
        {
            input: cpfInput,
            value: cpfValue
        },
        {
            input: rgInput,
            value: rgValue
        },
        {
            input: emailInput,
            value: emailValue
        },
        {
            input: phoneInput,
            value: phoneValue
        },
        {
            input: cellphoneInput,
            value: cellphoneValue
        },
        {
            input: birthdayInput,
            value: birthdayValue
        },
        {
            input: cityInput,
            value: cityValue
        },
        {
            input: occupationInput,
            value: occupationValue
        },
        {
            input: roleInput,
            value: roleValue
        },
        {
            input: sindInput,
            value: ''
        }
    ];


    for (let index in arrayInputs) {
        let element = arrayInputs[index].input;
        element.addEventListener('focus', function (el) {
            cleanInputError(this);
        });
    }

    renderInputs(arrayInputs);

    $('#cpf').mask('000.000.000-00');
    $('#rg').mask('00.000.000-00');
    $('#phone').mask('(00) 0000-0000');
    $('#cellphone').mask('(00) 00000-0000');
    $('#birthday').mask('00/00/0000');

    // orientação sexual
    let count = 0;
    var arraySexualOrientation = null;
    if (sexualOrientation != null && sexualOrientation != "") {
        try {
            arraySexualOrientation = JSON.parse(sexualOrientation);
        } catch (e) {
            console.log(e);
            arraySexualOrientation = null;
        }
    }

    for (let genero of generos) {
        count++;
        let id = `chk-genero-${count}`;

        let checked = false;

        if (arraySexualOrientation != null) {
            if (arraySexualOrientation.includes(genero)) {
                checked = true;
            }
        }

        $('#generos-wrapper').append(`
            <label class="chk-container text-gray">
                <input ${checked ? 'checked' : ''} id="${id}" name="chk-genero" value="${genero}" type="checkbox">
                <span class="checkmark translate-middle-y top-50"></span>
                ${genero}
            </label>
        `);
    }

    // genero
    count = 0;

    for (let genero of generos2) {
        count++;
        let id = `rb-genero-${count}`;
        let checked = false;

        if (gender != null) {
            if (gender == genero) {
                checked = true;
            }
        }

        $('#generos2-wrapper').append(`

            <label class="chk-container radio text-gray">
                <input id="${id}" ${checked ? 'checked' : ''} name="rb-genero" value="${genero}" type="radio">
                <span class="checkmark translate-middle-y top-50"></span>
                ${genero}
            </label>
        `);
    }

    //ETNIA
    count = 0;
    for (let etnia of etnias) {
        count++;
        let id = `rb-etnia-${count}`;
        let checked = false;
        if (ethnicityValue != null) {
            if (ethnicityValue == etnia) {
                checked = true;
            }
        }

        $('#etnias-wrapper').append(`
           <label class="chk-container radio text-gray">
               <input ${checked ? 'checked': ''} id="${id}" name="rb-etnia" value="${etnia}" type="radio">
               <span class="checkmark translate-middle-y top-50"></span>
               ${etnia}
           </label>
       `);
    }


    //GROUP
    for(let group of allGroups){
        let id = `chk-group-${group.id}`;
        let nome = group.name;
        let checked = false;

        if (sindValue != null) {
            if (sindValue == group.id) {
                checked = true;
            }
        }

        $('#sind').append(`
            <option ${checked? 'selected':''} value="${group.id}">
                ${nome}
            </option>
        `);

        checked = false;

        for(let groupVal of groupsValues){
            if(groupVal.id == group.id){
                checked = true;
            }
        }

        $('#grupos-wrapper').append(`
            <label class="chk-container text-gray">
                <input ${checked? 'checked':''} id="${id}" name="chk-group" value="${group.id}" type="checkbox">
                <span class="checkmark translate-middle-y top-50"></span>
                ${nome}
            </label>
        `);

    }
        


    window.document.getElementById('form-model').addEventListener('submit', async function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();

        let erros = 0;

        if (!inputValidation(nameInput.value.trim())) {
            triggerInputError(nameInput, 'Insira um nome válido!');
            erros++
        }

        if (!inputValidation(cellphoneInput.value.trim(), 'cellphone')) {
            triggerInputError(cellphoneInput, 'Informe um celular válido');
            erros++
        }

        if (!inputValidation(sindInput.value.trim())) {
            triggerInputError(sindInput, 'Informe um sindicato base');
            erros++
        }

        if (erros > 0) {
            dispatchPopup('warning', 'Atenção', 'Verifique os campos destacados.');
            return null;
        }


        let generosArray = [];

        $('[name="chk-genero"]:checked').each(function () {
            generosArray.push($(this).val());
        });

        if (generosArray.length > 0) {
            generosArray = JSON.stringify(generosArray);
        } else {
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

        // REQUISIÇÃO
        popupLoading();
        const id = $('#id').val();
        let fetchResponse = await fetch(`${apiUrl}/users/${id}`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            },
            body: JSON.stringify({
                name: nameInput.value,
                cpf: cpfInput.value,
                rg: rgInput.value,
                email: emailInput.value,
                phone: phoneInput.value,
                role: roleInput.value || 'Não definido',
                cellphone: cellphoneInput.value,
                birthday: birthdayInput.value,
                city: cityInput.value,
                occupation: occupationInput.value,
                ethnicity: etnia,
                sexual_orientation: generosArray,
                gender: genero,
                sind: sindInput.value,
                groups_ids: groupsArray
            })
        });

                if (fetchResponse.status == 401) {window.location.href = baseAdminUrl;return;}
        if (fetchResponse.status != 200) {
            var fetchJsonResponse;

            try {
                fetchJsonResponse = await fetchResponse.json();
            } catch (except) {
                dispatchPopup('error', 'Ops! ocorreu um erro.', 'Não foi possível ao verificar o resultado de sua ação. Por favor, tente novamente mais tarde.');
                return false;
            }


            dispatchPopup('warning', 'Atenção', fetchJsonResponse.message);

            return false;

        }

        dispatchPopup('success', 'Pronto!', 'Cadastro realizado com sucesso.').then(function () {
            window.location.href = baseAdminUrl + '/congressos';
        });

    });

}

function fetchModel() {
    return new Promise(async function (res, rej) {
        const id = $('#id').val();
        let fetchResponse = await fetch(`${apiUrl}/users/${id}`, {
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
                'Ocorreu um erro ao buscar o cadatro. Por favor, atualize a página ou volte novamente mais tarde'
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
                'Ocorreu um erro ao buscar o cadastro. Por favor, atualize a página ou volte novamente mais tarde'
            );

            res(false);
            return;
        }

        res(fetchJsonResponse);

    });
}


async function renderInputs(arrayInputs) {

    for (let index in arrayInputs) {

        let jsonInput = arrayInputs[index];

        let input = jsonInput.input;

        input.value = jsonInput.value;

        if (!jsonInput.readonly) {
            input.removeAttribute('readonly');
        }

        input.dispatchEvent(new Event('input'));
        input.closest('.placeholder-input').classList.remove('placeholder-input');
    }

}
