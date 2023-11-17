// replace function
const baseAdminUrl = window.location.origin;
const apiUrl  = `${baseAdminUrl}/api`;
/*
const baseAdminUrl = window.location.origin + '/wpp-painel';
const apiUrl  = `http://localhost/wpp-painel/api`;
*/
const generos = [
    'Heterossexual',
    'Homossexual',
    'Bissexual',
    'Pansexual',
    'Assexual',
    'Outros'
];

const generos2 = [
    "Feminino", "Masculino", "Transgênero Feminino", "Transgênero Masculino","Não Binário"
];

const etnias = [
    "Branca", "Negra", "Parda", "Indígena", "Amarela"
];

var allGroups = null;

function fetchUserData() {
    return new Promise(async function (res, rej) {

        let email = getCookie('email');
        let name = getCookie('name');
        let emp_name = getCookie('emp_name');
        let role = getCookie('role');

        res({
            userData:{
                id_user: 1,
                name: name,
                email: email,
                emp_name: emp_name,
                role: role
            }
        });

    });
}

function fetchCategories() {
    return new Promise(async function (res, rej) {

        const apiToken = getCookie('token');

        let fetchResponse = await fetch(`${apiUrl}/groups`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiToken}`
            }
        });

        let fetchJsonResponse;

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


function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  
function getCookie(cname) {
let name = cname + "=";
let ca = document.cookie.split(';');
for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
    c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
    return c.substring(name.length, c.length);
    }
}
return "";
}
  
function checkCookie() {
    let token = getCookie("token");
}