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
            label: 'Disparos em massa',
            link: null
        },
    ]);

    //aside
    renderPageActive('disparos');

    //user data
    renderUserDataReplace();

    formConfig();

});

function formConfig() {

    const mensagemInput = document.getElementById('mensagem');

    const arrayInputs = [
        {
            input: mensagemInput,
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

        if (erros > 0) {
            dispatchPopup('warning', 'Atenção', 'Verifique os campos destacados.');
            return null;
        }


        console.log(imagemB64);
        console.log(audioB64);

        const modalDisparo = new bootstrap.Modal(document.getElementById('modal-disparo'));
        modalDisparo.show();

        return;

    });

    // MODAL CONTATOS
    var listaDeEnvio = [];
    var dataTablesContatos = null;

    document.getElementById("inpContatos").addEventListener("change", function (e) {
        const file = e.target.files[0];

        // Check if the selected file is an Excel file
        if (file && file.name.endsWith(".xlsx")) {
            const reader = new FileReader();
            console.log('lendo...');
            reader.onload = function (e) {
                console.log('leu.');
                if(dataTablesContatos != null){
                    dataTablesContatos.destroy();
                }

                $('#table-contatos').empty();
                $('#table-contatos').html(`
                    <thead>
                        <tr>
                            <td>
                                Nome
                            </td>
                            <td>
                                Telefone
                            </td>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                `);


                const data = e.target.result;
                const workbook = XLSX.read(data, { type: "array" });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                const tableContatos = document.getElementById("table-contatos");
                
                listaDeEnvio = [];
                // Iterate through the Excel data and create rows
                XLSX.utils.sheet_to_json(worksheet).forEach((row) => {
                    const numeroFormatado = verificarNumeroTelefone(row.telefone);
                    if(numeroFormatado != false){
                        const dataRow = document.createElement("tr");
                        const nomeCell = document.createElement("td");
                        const telefoneCell = document.createElement("td");
                        nomeCell.textContent = row.nome || "";
                        telefoneCell.textContent = numeroFormatado;

                        dataRow.appendChild(nomeCell);
                        dataRow.appendChild(telefoneCell);
                        tableContatos.querySelector('tbody').appendChild(dataRow);
                        listaDeEnvio.push({nome:row.nome,telefone:numeroFormatado});
                    }
                });
                
                console.log(listaDeEnvio);
                
                // Enable the "Confirmar" button
                if(listaDeEnvio.length < 1){
                    $("#btn-confirmar-envio").attr('disabled',true);
                    alert('Nenhum contato encontrado no arquivo enviado');
                    return;
                }

                document.getElementById("btn-confirmar-envio").removeAttribute("disabled");

                dataTablesContatos = $('#table-contatos').DataTable({
                    responsive: true,
                    language: {
                        url: `${baseAdminUrl}/libs/jquery-datatable/locale/dataTables.pt_br.json`
                    },
                });
            };

            reader.readAsArrayBuffer(file);
        } else {
            alert("Por favor, selecione um arquivo no formato XLSX.");
            e.target.value = ""; // Clear the file input
        }
    });

    $('#btn-confirmar-envio').on('click',async function(){
        if(listaDeEnvio == null){
            alert('Envie uma lista de contatos válida antes de prosseguir');
        }

        if(listaDeEnvio.length < 1){
            alert('Envie uma lista de contatos válida antes de prosseguir');
        }

        let valorTipo = $('[name="rb-tipo"]:checked').val();

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

    });


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