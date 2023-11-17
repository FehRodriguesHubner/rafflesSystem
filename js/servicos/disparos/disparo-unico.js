checkInstancia();

window.addEventListener('DOMContentLoaded', async function () {
    //header nav
    renderHeaderPath([
        {
            label: '<i class="fa-solid fa-house"></i> Home',
            link: baseAdminUrl + '/home'
        },
        {
            label: 'Histórico de Disparos',
            link: baseAdminUrl + '/servicos/historico-disparos'
        },
        {
            label: 'Disparo único',
            link: null
        },
    ]);

    //aside
    renderPageActive('disparo-unico');

    //user data
    renderUserDataReplace();

    formConfig();

});

function formConfig() {

    const mensagemInput = document.getElementById('mensagem');
    const telefoneInput = document.getElementById('telefone');

    const arrayInputs = [
        {
            input: mensagemInput,
            value: ''
        },
        {
            input: telefoneInput,
            value: ''
        },
    ];

    for (let index in arrayInputs) {
        let element = arrayInputs[index].input;
        element.addEventListener('focus', function (el) {
            cleanInputError(this);
        });
    }


    renderInputs(arrayInputs);

    $('[name="rb-tipo"]').on('change', function () {
        let tipoDisparo = $('[name="rb-tipo"]:checked').val();
        console.log('tipoDisparo', tipoDisparo);

        $('[data-container-tipo]').each(function () {
            $(this).addClass('d-none');
        })

        switch (parseInt(tipoDisparo)) {
            case 1:
                displayDisparoTexto();
                break;
            case 2:
                displayDisparoImagem();
                break;
            case 3:
                displayDisparoAudio();
                break;
        }

    });

    function displayDisparoImagem() {
        $('#containerTipoImagem').removeClass('d-none');
    }
    function displayDisparoTexto() {
        //$('#containerTipoImagem').removeClass('d-none');
    }
    function displayDisparoAudio() {
        $('#containerTipoAudio').removeClass('d-none');
    }

    // IMAGEM

    var imagemB64 = null;
    var audioB64 = null;

    $(document).ready(function () {
        $("#imageInput").change(function () {
            readURL(this);
        });

        $("#audioInput").change(function () {
            readAudioURL(this);
        });

    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $("#imagePreview").css("background-image", `url(${e.target.result})`);
                $("#imagePreview").show();
                imagemB64 = e.target.result;
            };
            reader.readAsDataURL(input.files[0]);
        }
    }

    function readAudioURL(input) {
        if (input.files && input.files[0]) {
            var audioPlayer = document.getElementById("audioPreview");
            let blob = input.files[0]; // Obtém o Blob diretamente
        
            var reader = new FileReader();
            reader.onload = function(event) {
                // O resultado será a representação Base64 dos dados do Blob
                audioB64 = event.target.result.split(',')[1]; // Pega apenas a parte Base64
            };
            reader.readAsDataURL(blob);
        
            let blobSrc = URL.createObjectURL(blob);
            audioPlayer.src = blobSrc;
            audioPlayer.style.display = "block";
        }
        
    }

    window.document.getElementById('form-message').addEventListener('submit', async function (ev) {
        ev.preventDefault();
        ev.stopImmediatePropagation();

        let valorTipo = $('[name="rb-tipo"]:checked').val();

        switch(parseInt(valorTipo)){
            case 2:
                if(imagemB64 == null){
                    dispatchPopup('warning','Atenção','Envie uma imagem antes de prosseguir')
                    return;
                }
            break;
            case 3:
                if(audioB64 == null){
                    dispatchPopup('warning','Atenção','Envie um arquivo de audio antes de prosseguir.')
                    return;
                }
            break;
        }

        let erros = 0;

        if(valorTipo != 3){
            if (!inputValidation(mensagemInput.value.trim())) {
                triggerInputError(mensagemInput, 'Insira uma mensagem válida');
                erros++
            }
        }

        if (!inputValidation(telefoneInput.value.trim(),'phone')) {
            triggerInputError(telefoneInput, 'Insira um telefone válido');
            erros++
        }

        if (erros > 0) {
            dispatchPopup('warning', 'Atenção', 'Verifique os campos destacados.');
            return null;
        }

        /////////////////////////////////////

        listaDeEnvio = [{
            nome: '(Disparo único)',
            telefone: verificarNumeroTelefone($('#telefone').val())
        }]
       
        if(listaDeEnvio.length < 1){
            alert('Envie uma lista de contatos válida antes de prosseguir');
        }

        var conteudo;

        switch(parseInt(valorTipo)){
            case 1:
                conteudo = $('#mensagem').val();
                break;
            case 2:
                
                conteudo = {
                    b64: imagemB64.split(',')[1],
                    legenda: $('#mensagem').val()
                }
                break;
            case 3:
                conteudo = {
                    b64: audioB64
                }
            break;
        }

        popupLoading();

        let result = await fetchDisparo(listaDeEnvio, conteudo, valorTipo);

        if(result == false){
            Swal.close();
            return;
        }
        
        setTimeout(function(){
            window.location.href = baseAdminUrl + '/servicos/historico-disparos';
        },3000);


        return;

    });

    // MODAL CONTATOS
    var listaDeEnvio = [];

    function fetchDisparo(listaDeEnvio,conteudo, tipo) {
        return new Promise(async function (res, rej) {
        
            let fetchResponse = await fetch(`${apiUrl}/servicos/disparos/disparos.php`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    lista_envio: listaDeEnvio,
                    conteudo: conteudo,
                    tipo: tipo
                })
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
    
            res(true);
    
        });
    }

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