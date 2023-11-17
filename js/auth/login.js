window.addEventListener('DOMContentLoaded', function () {

    const formLogin = document.getElementById('form-login');

    const inputEmail = document.getElementById('email');
    const inputPassword = document.getElementById('password');

    const arrayInputs = [
        inputEmail,
        inputPassword
    ];

    for(let index in arrayInputs){
        let element = arrayInputs[index];
        element.addEventListener('focus', function(el){
            cleanInputError(this);
        });
    }

    setCookie('token','');
    setCookie('email','');

    formLogin.addEventListener('submit',async function (ev) {
        ev.preventDefault();

        // VALIDAÇÃO
        const email = inputEmail.value.trim();
        const password = inputPassword.value;

        let erros = 0;

        if (!inputValidation(email, 'email')) {
            triggerInputError(inputEmail, 'Insira um endereço de e-mail válido!');
            erros++
        }

        if (!inputValidation(password)) {
            triggerInputError(inputPassword, 'Insira uma senha!');

            erros++
        }

        if (erros > 0) {
            dispatchPopup(
                'warning',
                'Atenção',
                'Verifique os campos destacados.'
            );
            return null;
        }

        // REQUISIÇÃO
        popupLoading();

        let fetchResponse = await fetch(`${apiUrl}/auth/login.php`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                email: email,
                pass: password
            })
        });

        if(fetchResponse.status != 200){

            try{
                let json = await fetchResponse.json();
                dispatchPopup('warning','Atenção inválido.',json.message);
            }catch(e){
                dispatchPopup('error','Ocorreu um erro','Por favor, tente novamente mais tarde');
            }

    
            return false;
        }else{
            let jsonResoponse;
            try{
                jsonResoponse = await fetchResponse.json();
            }catch(e){
                dispatchPopup('error','Ocorreu um erro','Não foi possível analisar a resposta da solicitação. Por favor, tente novamente mais tarde');
                return;
            }

            let email, name, user_level, id_user, emp_name;

            email = jsonResoponse.email;
            name = jsonResoponse.name;
            user_level  = jsonResoponse.user_level;
            id_user  = jsonResoponse.id_user;
            emp_name  = jsonResoponse.emp_name;

            setCookie('email',email,1);
            setCookie('name',name,1);
            setCookie('user_level',user_level,1);
            setCookie('id_user',id_user,1);
            setCookie('emp_name',emp_name,1);
            
            window.location.href = baseAdminUrl + '/home';
        }

    });

});