// loader
window.addEventListener('load', function () {
    setTimeout(() => { document.querySelector("#page-loader").classList.add('closed'); }, 500)
});

window.addEventListener(`DOMContentLoaded`, function(){

    /* Máscaras de formulário */

    if(document.querySelector(`.mask-data`)){

        let arMaskData = document.querySelectorAll(`.mask-data`)
        
        for (const e of arMaskData) {
            
            e.addEventListener(`keyup`, (event)=>{
                mascara(`##/##/####`, e, event, true)
            })
        }
    }

    if(document.querySelector(`.mask-cpf`)){

        let arMaskCPF = document.querySelectorAll(`.mask-cpf`)
        
        for (const e of arMaskCPF) {
            
            e.addEventListener(`keyup`, (event)=>{
                mascara(`###.###.###-##`, e, event, true)
            })
        }
    }

    if(document.querySelector(`.mask-cnpj`)){

        let arMaskCNPJ = document.querySelectorAll(`.mask-cnpj`)
        
        for (const e of arMaskCNPJ) {
            
            e.addEventListener(`keyup`, (event)=>{
                mascara(`##.###.###/####-##`, e, event, true)
            })
        }
    }

    if(document.querySelector(`.mask-document`)){

        let arMaskDocument = document.querySelectorAll(`.mask-document`)
        
        for (const e of arMaskDocument) {
            
            e.addEventListener(`keyup`, (event)=>{
                let l = e.value.length

                if(l > 14){

                    mascara(`##.###.###/####-##`, e, event, true)
                }else{

                    mascara(`###.###.###-##`, e, event, true)
                }
            })
        }
    }

    if(document.querySelector(`.mask-cep`)){

        let arMaskCEP = document.querySelectorAll(`.mask-cep`)
        
        for (const e of arMaskCEP) {
            
            e.addEventListener(`keyup`, (event)=>{
                mascara(`#####-###`, e, event, true)
            })
        }
    }

    if(document.querySelector(`.mask-phone`)){

        let arMaskPhone = document.querySelectorAll(`.mask-phone`)
        
        for (const e of arMaskPhone) {
            
            e.addEventListener(`keyup`, (event)=>{
                let l = e.value.length

                if(l > 14){

                    mascara(`(##) #####-####`, e, event, true)
                }else{

                    mascara(`(##) ####-####`, e, event, true)
                }

            })
        }
    }

    if(document.querySelector(`.mask-card-number`)){

        let arMaskCardNumber = document.querySelectorAll(`.mask-card-number`)
        
        for (const e of arMaskCardNumber) {
            
            e.addEventListener(`keyup`, (event)=>{
                mascara(`#### #### #### ####`, e, event, true)
            })
        }
    }

    if(document.querySelector(`.mask-card-cod`)){

        let arMaskCardCod = document.querySelectorAll(`.mask-card-cod`)
        
        for (const e of arMaskCardCod) {
            
            e.addEventListener(`keyup`, (event)=>{
                mascara(`####`, e, event, true)
            })
        }
    }

    /* Fim Máscaras de formulário */

})

// DEFAULT BEHAVIORS

// sidenav & burger menu
const sidenav = document.querySelector("[sidenav]");
const buttonBurguer = document.querySelector('[button-burguer]');
const overlay = document.querySelector('.overlay');
if (buttonBurguer) {
    buttonBurguer.addEventListener('click', function (e) {
        sidenav.classList.add("active");
        overlay.classList.add("active");
    });
}
if (overlay) {
    overlay.addEventListener('click', function (e) {
        sidenav.classList.remove("active");
        overlay.classList.remove("active");
    });
}


// TEMPLATE COMPONENTS

async function defaultHeaderConfig(){
    const apiUrl = window.location.origin + '/api';

    const linksContainer = document.getElementById('header-links-container');
    const dataContainer = document.getElementById('header-user-data');
    const mainButton = document.getElementById('header-main-button');
    
    const linksMobileContainer = document.getElementById('header-links-mobile-container');
    const dataMobileContainer = document.getElementById('header-mobile-user-data');
    const mainMobileButton = document.getElementById('header-mobile-main-button');

    const fetchData = await getUserData();

    const userData = fetchData;


    if(userData){
        dispatchErrorUserData();
    }

    if(userData.id_user == null){
        renderizarHeaderDeslogado();
    }else{
        switch(parseInt(userData.typeCode)){
            case 1:
                renderizaHeaderUsuarioLogado();
                break;
            case 2:
                renderizaHeaderLojaLogado();
                break;
            default:
                renderizarHeaderDeslogado();
                break;
        }
    }


    function dispatchErrorUserData(){
        // desktop
        dataContainer.classList.remove('placeholder-custom-size');
        dataContainer.style.width = 'unset';
        dataContainer.innerHTML = (/*html*/`
            <div class="d-flex justify-content-center align-items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28.1751 15.2503C27.3938 14.4691 26.1284 14.4691 25.3467 15.2503L21.5001 19.1753L17.5084 15.2503C16.7272 14.4691 15.4617 14.4691 14.6801 15.2503C13.8984 16.0316 13.8988 17.297 14.6801 18.0787L18.5992 21.9978L14.7501 25.917C13.9688 26.6982 13.9688 27.9637 14.7501 28.7453C15.5312 29.5264 16.7967 29.5271 17.5784 28.7453L21.5001 24.8253L25.4192 28.7445C26.2003 29.5256 27.4659 29.5262 28.2476 28.7445C29.0288 27.9632 29.0288 26.6978 28.2476 25.9162L24.3284 21.997L28.2476 18.0778C29.0251 17.3003 29.0251 16.0337 28.1751 15.2503ZM21.5001 0.666992C9.71675 0.666992 0.166748 10.217 0.166748 22.0003C0.166748 33.7837 9.71675 43.3337 21.5001 43.3337C33.2834 43.3337 42.8334 33.7837 42.8334 22.0003C42.8334 10.217 33.2834 0.666992 21.5001 0.666992ZM21.5001 39.3337C11.9417 39.3337 4.16675 31.5578 4.16675 22.0003C4.16675 12.4428 11.9417 4.66699 21.5001 4.66699C31.0584 4.66699 38.8334 12.4428 38.8334 22.0003C38.8334 31.5578 31.0584 39.3337 21.5001 39.3337Z" fill="#FF3541"/>
                </svg> Erro ao buscar os dados            
            </div>
        `);
        
        // mobile
        dataMobileContainer.classList.remove('placeholder-custom-size');
        dataMobileContainer.innerHTML = (/*html*/`
            <div class="d-flex justify-content-center align-items-center gap-1">
                <svg width="20" height="20" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M28.1751 15.2503C27.3938 14.4691 26.1284 14.4691 25.3467 15.2503L21.5001 19.1753L17.5084 15.2503C16.7272 14.4691 15.4617 14.4691 14.6801 15.2503C13.8984 16.0316 13.8988 17.297 14.6801 18.0787L18.5992 21.9978L14.7501 25.917C13.9688 26.6982 13.9688 27.9637 14.7501 28.7453C15.5312 29.5264 16.7967 29.5271 17.5784 28.7453L21.5001 24.8253L25.4192 28.7445C26.2003 29.5256 27.4659 29.5262 28.2476 28.7445C29.0288 27.9632 29.0288 26.6978 28.2476 25.9162L24.3284 21.997L28.2476 18.0778C29.0251 17.3003 29.0251 16.0337 28.1751 15.2503ZM21.5001 0.666992C9.71675 0.666992 0.166748 10.217 0.166748 22.0003C0.166748 33.7837 9.71675 43.3337 21.5001 43.3337C33.2834 43.3337 42.8334 33.7837 42.8334 22.0003C42.8334 10.217 33.2834 0.666992 21.5001 0.666992ZM21.5001 39.3337C11.9417 39.3337 4.16675 31.5578 4.16675 22.0003C4.16675 12.4428 11.9417 4.66699 21.5001 4.66699C31.0584 4.66699 38.8334 12.4428 38.8334 22.0003C38.8334 31.5578 31.0584 39.3337 21.5001 39.3337Z" fill="#FF3541"/>
                </svg> Erro ao buscar os dados            
            </div>
        `);
    }

    function renderizarHeaderDeslogado(){
        // DESKTOP
        dataContainer.remove();
        linksContainer.insertAdjacentHTML('beforeend',/*html*/`
            <a href="${window.location.origin}/login" class="link-header">Login</a>
        `);

        linksContainer.insertAdjacentHTML('beforeend',/*html*/`
            <a href="${window.location.origin}/cadastro" class="link-header">Cadastre-se</a>
        `);
        mainButton.innerHTML = `Portal do Anunciante`;
        mainButton.closest('a').href = `${window.location.origin}/login`;
        mainButton.classList.remove('d-none');

        // MOBILE
        dataMobileContainer.remove();
        linksMobileContainer.insertAdjacentHTML('beforeend',/*html*/`
            <a class="link-sidenavigator" href="${window.location.origin}/login">Login</a>
        `);
        linksMobileContainer.insertAdjacentHTML('beforeend',/*html*/`
            <a class="link-sidenavigator" href="${window.location.origin}/cadastro">Cadastre-se</a>
        `);
        mainMobileButton.innerHTML = `Portal do Anunciante`;
        mainMobileButton.closest('a').href = `${window.location.origin}/login`;
        mainMobileButton.classList.remove('d-none');
    }

    function renderizaHeaderUsuarioLogado(){
        dataContainer.remove();
        mainButton.innerHTML = `Portal do Anunciante`;
        mainButton.classList.remove('d-none');
        mainButton.closest('a').href = `${window.location.origin}/perfil`;
        // mobile
        dataMobileContainer.remove();
        mainMobileButton.innerHTML = `Portal do Anunciante`;
        mainMobileButton.classList.remove('d-none');
        mainMobileButton.closest('a').href = `${window.location.origin}/perfil`;
    }

    function renderizaHeaderLojaLogado(){
        dataContainer.remove();
        mainButton.innerHTML = `Portal do Anunciante`;
        mainButton.classList.remove('d-none');
        mainButton.closest('a').href = `${window.location.origin}/meus-classificados`;
        // mobile
        dataMobileContainer.remove();
        mainMobileButton.innerHTML = `Portal do Anunciante`;
        mainMobileButton.classList.remove('d-none');
        mainMobileButton.closest('a').href = `${window.location.origin}/meus-classificados`;
    }

}


// UTILS FUNCTIONS
const baseUrl = window.location.origin;

var userData = null;
async function getUserData(){
    return new Promise(async (resolve, reject) => {
        if(userData == null){
            let data = await fetchUserData();

            if(data == false){
                resolve(false);
                return;
            }

            userData = data['userData'];

        }
    
        resolve(userData);
    
    });
}

function fetchUserData() {
    return new Promise(async function (res, rej) {
        res({
            id_user: 1,
            name: 'Usuário logado',
            email: 'Usuário logado'
        });

    });
}

async function renderUserDataReplace(){
    let data = await getUserData();
    
    if(data == false){
        
        dispatchPopup('error','Ops!','Ocorreu um erro ao buscar os dados do usuário para a renderização. Por favor, atualize a página ou volte novamente mais tarde').then(function(){
        });

        return false;
    }

    // USER TEXT DATA
    let arrayElementsUser = document.querySelectorAll('[data-replace-user]');
    for(let index in arrayElementsUser){

        let element = arrayElementsUser[index];

        if(typeof element != 'object'){
            continue;
        }
        
        let attr = element.getAttribute('data-replace-user');

        let info = data[attr];


        if(data[attr] == undefined || data[attr] == '' ){
            info = "Não informado";
        }
        
        element.innerHTML = info;

        element.classList.remove('placeholder-custom-size');

        element.removeAttribute('style');
    }

    // USER AVATAR
    let arrayElementsAvatar = document.querySelectorAll('[data-replace-user-avatar]');
    for(let index in arrayElementsAvatar){

        let element = arrayElementsAvatar[index];

        if(typeof element != 'object'){
            continue;
        }
        
        let info = null;
        
        let id = data['id_user'];

        info = /*html*/`
            <img src="${window.location.origin}/api/uploads/avatar/${id}.jpeg"  onerror="this.onerror=null;this.src='${window.location.origin}/img/user-placeholder.jpg';" />
        `;

        element.innerHTML = info;

        element.classList.remove('placeholder-custom-size');

        element.removeAttribute('style');
    }

}

// OTHERS

function b64MbSize(base64String){
    // Remove MIME-type from the base64 if exists
    var length = base64String.length;
    
    var fileSizeInByte = Math.ceil(parseFloat(length) / 4) * 3;

    return fileSizeInByte * 0.000001;
}

function dispatchPopup(icon,title,text,config = {}, customClass = {}){
    let htmlIcon = '';

    switch(icon){
        case 'warning':
            htmlIcon = `<svg width="60" height="60" viewBox="0 0 50 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M48.7545 37.3337L28.4402 2.66699C27.6593 1.33366 26.2879 0.666992 24.9164 0.666992C23.545 0.666992 22.1736 1.33366 21.3069 2.66699L1.00215 37.3337C-0.473087 39.9908 1.47368 43.3337 4.60596 43.3337H45.2345C48.3545 43.3337 50.3069 40.0003 48.7545 37.3337ZM5.5431 38.7622L24.8307 5.69556L44.2879 38.7622H5.5431ZM24.9164 29.7241C23.2631 29.7241 21.9222 31.0651 21.9222 32.7184C21.9222 34.3718 23.266 35.7127 24.9202 35.7127C26.5745 35.7127 27.9107 34.3718 27.9107 32.7184C27.9069 31.067 26.5736 29.7241 24.9164 29.7241ZM22.6307 15.1432V24.286C22.6307 25.5527 23.6593 26.5718 24.9164 26.5718C26.1736 26.5718 27.2022 25.5479 27.2022 24.286V15.1432C27.2022 13.886 26.1831 12.8575 24.9164 12.8575C23.6498 12.8575 22.6307 13.886 22.6307 15.1432Z" fill="#F9B127"/></svg>`;
            break;
        case 'error':
            htmlIcon = `<svg width="60" height="60" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.1751 15.2503C27.3938 14.4691 26.1284 14.4691 25.3467 15.2503L21.5001 19.1753L17.5084 15.2503C16.7272 14.4691 15.4617 14.4691 14.6801 15.2503C13.8984 16.0316 13.8988 17.297 14.6801 18.0787L18.5992 21.9978L14.7501 25.917C13.9688 26.6982 13.9688 27.9637 14.7501 28.7453C15.5312 29.5264 16.7967 29.5271 17.5784 28.7453L21.5001 24.8253L25.4192 28.7445C26.2003 29.5256 27.4659 29.5262 28.2476 28.7445C29.0288 27.9632 29.0288 26.6978 28.2476 25.9162L24.3284 21.997L28.2476 18.0778C29.0251 17.3003 29.0251 16.0337 28.1751 15.2503ZM21.5001 0.666992C9.71675 0.666992 0.166748 10.217 0.166748 22.0003C0.166748 33.7837 9.71675 43.3337 21.5001 43.3337C33.2834 43.3337 42.8334 33.7837 42.8334 22.0003C42.8334 10.217 33.2834 0.666992 21.5001 0.666992ZM21.5001 39.3337C11.9417 39.3337 4.16675 31.5578 4.16675 22.0003C4.16675 12.4428 11.9417 4.66699 21.5001 4.66699C31.0584 4.66699 38.8334 12.4428 38.8334 22.0003C38.8334 31.5578 31.0584 39.3337 21.5001 39.3337Z" fill="#FF3541"/></svg>
            `;
            break;
        case 'success':
            htmlIcon = `<svg width="60" height="60" viewBox="0 0 43 44" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M28.0834 15.2503L18.8334 24.5087L14.8417 20.5837C14.0605 19.8024 12.7951 19.8024 12.0134 20.5837C11.2317 21.3649 11.2322 22.6303 12.0134 23.412L17.3467 28.7453C17.8084 29.142 18.3167 29.3337 18.8334 29.3337C19.3501 29.3337 19.8567 29.1383 20.2476 28.7477L30.9142 18.0811C31.6955 17.2998 31.6955 16.0344 30.9142 15.2527C30.133 14.4711 28.8667 14.4753 28.0834 15.2503ZM21.5001 0.666992C9.71675 0.666992 0.166748 10.217 0.166748 22.0003C0.166748 33.7837 9.71675 43.3337 21.5001 43.3337C33.2834 43.3337 42.8334 33.7837 42.8334 22.0003C42.8334 10.217 33.2834 0.666992 21.5001 0.666992ZM21.5001 39.3337C11.9417 39.3337 4.16675 31.5578 4.16675 22.0003C4.16675 12.4428 11.9417 4.66699 21.5001 4.66699C31.0584 4.66699 38.8334 12.4428 38.8334 22.0003C38.8334 31.5578 31.0584 39.3337 21.5001 39.3337Z" fill="#24B04B"/></svg>
            `;
            break;
    }

    return Swal.fire({
        iconHtml: htmlIcon,
        customClass: {
            icon: 'popup-icon-custom',
            popup: 'popup-custom',
            content: 'popup-content-custom',
            confirmButton: 'popup-confirm-custom button-default bg-blue w-100 color-white',
            cancelButton: 'popup-cancel-custom button-default border-blue-800 color-blue-800',
            title: 'popup-title-custom',
            actions: 'popup-actions-custom',
            ...customClass
        },
        icon,
        title,
        text,
        ...config
    })

}

function popupLoading(){
    Swal.fire({
        icon: 'info',
        title: 'Processando',
        text: 'Aguarde...',
        didOpen: () => {
            Swal.showLoading()
        },
        customClass: {
            popup: 'popup-custom',
            title: 'popup-title-custom',
            actions: 'popup-actions-custom'
        },
        showConfirmButton: false,
        allowOutsideClick: false
    });
}

// JQUERY FUNCTIONS
function maskInputs(){
    $('[data-mask="cpf"]').mask('000.000.000-00');
    $('[data-mask="cep"]').mask('00000-000');
    $('[data-mask="birth"]').mask('00/00/0000');

    var SPMaskBehavior = function(val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 00000-0000' : '(00) 0000-00009';
    },
    spOptions = {
        onKeyPress: function(val, e, field, options) {
            field.mask(SPMaskBehavior.apply({}, arguments), options);
        }
    };

    $('[data-mask="phone"]').mask(SPMaskBehavior, spOptions);
}


// INPUTS FUNCTIONS

function inputValidation(text, type = null) {
    if (text == null) {
        return false;
    }
    if (text == '' || text.trim() == '') {
        return false;
    }

    if (type == 'email') {
        if (!validateEmail(text)) {
            return false;
        }
    }

    if (type == 'cpf') {
        if (!validateCPF(text)) {
            return false;
        }
    }

    if (type == 'rg') {
        if (text.length < 12) {
            return false;
        }
    }

    if (type == 'phone') {
        if(verificarNumeroTelefone(text) === false){
            return false;
        }
    }
    if (type == 'cellphone') {
        if (text.length < 15) {
            return false;
        }
    }
    if (type == 'date') {
        if (!validateDate(text)) {
            return false;
        }
    }

    return true;
}

function calculateAge(dateOfBirthString, currentDatestring) {
    // Converte as strings de data em objetos Date
    var dateOfBirth = new Date(convertDate(dateOfBirthString));
    var currentDate = new Date(currentDatestring);
  
    // Calcula a diferença entre as datas em milissegundos
    var diffInMs = currentDate - dateOfBirth;
  console.log('diff',diffInMs,currentDate,dateOfBirth);
    // Converte a diferença de milissegundos para anos
    var age = Math.floor(diffInMs / (1000 * 60 * 60 * 24 * 365.25));
  
    return age;
  }

  function convertDate(dateString) {
    const dateParts = dateString.split("/");
    return `${dateParts[1]}/${dateParts[0]}/${dateParts[2]}`;
  }
  

  function validateDate(dateString) {
    // Verifica se a string da data está no formato "dd/mm/yyyy"
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) {
      // Divide a string da data em dia, mês e ano
      var day = parseInt(dateString.substring(0, 2), 10);
      var month = parseInt(dateString.substring(3, 5), 10);
      var year = parseInt(dateString.substring(6), 10);
      // Verifica se o ano está dentro do intervalo válido
      if (year >= 1900 && year <= new Date().getFullYear()) {
        // Verifica se o mês está dentro do intervalo válido
        if (month >= 1 && month <= 12) {
          // Verifica se o dia está dentro do intervalo válido para o mês e ano fornecidos
          var lastDayOfMonth = new Date(year, month, 0).getDate();
          if (day >= 1 && day <= lastDayOfMonth) {
            // A data é válida
            return true;
          }
        }
      }
    }
    // A data é inválida
    return false;
  }
  
  

function validateCPF(cpf){
    cpf = cpf.replace(/\D/g, '');
    if(cpf.toString().length != 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    var result = true;
    [9,10].forEach(function(j){
        var soma = 0, r;
        cpf.split(/(?=)/).splice(0,j).forEach(function(e, i){
            soma += parseInt(e) * ((j+2)-(i+1));
        });
        r = soma % 11;
        r = (r <2)?0:11-r;
        if(r != cpf.substring(j, j+1)) result = false;
    });
    return result;
}

function triggerInputError(inputElement, text = null) {
    let inputContainer = inputElement.closest('.input-container');
    inputContainer.classList.add('error');

    if (text != null) {
        inputContainer.querySelector('.input-message').innerHTML = text;
    }

}

function cleanInputError(inputElement) {
    let inputContainer = inputElement.closest('.input-container');
    inputContainer.classList.remove('error');

    inputContainer.querySelector('.input-message').innerHTML = '';
}

function validateEmail(input) {

    var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (input.match(validRegex)) {

        return true;

    } else {


        return false;

    }

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


async function populateSelect(results,targetInput,placeholder){
    let option = document.createElement('option');
    option.setAttribute('value', '');
    option.innerHTML = placeholder;
    targetInput.innerHTML = '';
    targetInput.append(option);

    for(let index in results){
        let result = results[index];

        let option = document.createElement('option');
        option.setAttribute('value', result.id);
        option.innerHTML = result.label;
        targetInput.append(option);
    }
}