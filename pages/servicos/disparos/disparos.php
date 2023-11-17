<?php

require_once __DIR__ . '/../../../config/init-config.php';

?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <!-- dependencies -->
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="<?php echo $cdn ?>libs/bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>/libs/fontawesome/css/all.min.css">
    <link rel="stylesheet" href="<?php echo $cdn ?>libs/sweetalert2/css/sweetalert2.min.css">
    <!-- datatables -->
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/datatables.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/css/buttons.bootstrap4.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/css/dataTables.bootstrap4.min.css">
    <!-- styles global -->
    <link rel="stylesheet" href="<?php echo $cdn ?>css/styles.css">
    <link rel="stylesheet" href="<?php echo $cdn ?>css/cms.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/adm-styles.css">

    <title>Disparos em massa</title>
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="manifest" href="/site.webmanifest">
    <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
    <meta name="msapplication-TileColor" content="#da532c">
    <meta name="theme-color" content="#ffffff">
</head>

<body>
    <main class="d-flex">        
        <?php
        require_once __DIR__ . '/../../../template/aside.phtml';
        ?>

        <section class="wrapper-contents">
            <?php require_once __DIR__ . '/../../../template/header.phtml'; ?>
            <section class="main-wrapper-contants">
                <form id="form-message" class="card-profile form-wrapper">
                    <header class="d-flex p-4 pb-2 flex-column">
                        <div class="back-to d-flex align-items-center">
                            <a href="<?php echo $url; ?>home">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.96401 18.6983L4.53543 12.984C4.27315 12.7084 4.14258 12.3546 4.14258 12.0002C4.14258 11.6459 4.27315 11.2921 4.53543 11.0164L9.96401 5.30211C10.5075 4.73011 11.4115 4.70668 11.9841 5.25022C12.5533 5.79429 12.5779 6.69943 12.0354 7.26975L8.89901 10.5716L18.714 10.5716C19.5031 10.5716 20.1426 11.2111 20.1426 12.0002C20.1426 12.7893 19.5031 13.4288 18.714 13.4288L8.89901 13.4288L12.0354 16.7307C12.5779 17.3015 12.5544 18.2067 11.9841 18.7502C11.4115 19.2937 10.5075 19.2703 9.96401 18.6983Z" fill="#3B454F" />
                                </svg>
                            </a>
                            &nbsp;
                            <span class="card-container-title">Efetuar Disparos em Massa</span>
                        </div>
                    </header>

                    <div class="mt-3">
                        <div class="wrapper-infos-form">
                            <section class="p-3 pt-md-0 pt-0 p-md-4">
                                <div class="row">

                                    <!-- TIPO DA MENSAGEM -->

                                    <div class="col-12">
                                        <div class="input-group">
                                            <label for="name">Tipo da mensagem</label>
                                            <div class=" w-100">
                                                <div class="input-container">

                                                    <div class="row">
                                                        <div class="col-md-4">
                                                            <div class="card mb-4">
                                                                <label for="rb-tipo-texto" class="card-body d-flex justify-content-center flex-column text-primary">
                                                                    <h1 class="card-title text-center mb-4"><i class="fa-solid fa-comment"></i></h1>

                                                                    <h6 class="card-subtitle mb-2 text-muted text-center">Texto</h6>
                                                                    <input checked type="radio" value="1" name="rb-tipo" id="rb-tipo-texto">
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="card mb-4">
                                                                <label for="rb-tipo-imagem" class="card-body d-flex justify-content-center flex-column text-primary">
                                                                    <h1 class="card-title text-center mb-4"><i class="fa-solid fa-image"></i></h1>
                                                                    <h6 class="card-subtitle mb-2 text-muted text-center">Imagem</h6>
                                                                    <input type="radio" value="2" name="rb-tipo" id="rb-tipo-imagem">
                                                                </label>
                                                            </div>
                                                        </div>
                                                        <div class="col-md-4">
                                                            <div class="card mb-4">
                                                                <label for="rb-tipo-audio" class="card-body d-flex justify-content-center flex-column text-primary">
                                                                    <h1 class="card-title text-center mb-4"><i class="fa-solid fa-microphone"></i></h1>
                                                                    <h6 class="card-subtitle mb-2 text-muted text-center">Áudio</h6>
                                                                    <input type="radio" value="3" name="rb-tipo" id="rb-tipo-audio">
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <small class="input-message"></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <!-- CONTAINER TIPO IMAGEM -->

                                    <div class="col-12">
                                        <div data-container-tipo id="containerTipoImagem" class="d-none mb-3">
                                            <form id="imageUploadForm">
                                                <div class="form-group">
                                                    <label for="imageInput">Selecione uma imagem:</label>
                                                    <input type="file" class="form-control-file d-none" id="imageInput" accept="image/*">
                                                </div>
                                                <div class="form-group ">
                                                    <label for="imageInput" class="w-100">
                                                        <div class="disparo-image-preview mt-2" id="imagePreview" src="#" alt="Preview da imagem" style="display: none;">
                                                        </div>
                                                    </label>
                                                </div>

                                                <label for="imageInput" type="button" class="btn text-white btn-secondary">Carregar imagem</label>
                                            </form>
                                        </div>
                                    </div>


                                    <!-- CONTAINER TIPO AUDIO -->

                                    <div class="col-12">
                                        <div data-container-tipo id="containerTipoAudio" class="d-none mb-3">
                                            <form id="audioUploadForm">
                                                <div class="form-group">
                                                    <label for="audioInput">Selecione um arquivo de áudio:</label>
                                                    <input type="file" class="form-control-file d-none" id="audioInput" accept="audio/*">
                                                </div>
                                                <div class="form-group">
                                                    <audio controls id="audioPreview" class="mt-2" style="display: none;">
                                                        Seu navegador não suporta a reprodução de áudio.
                                                    </audio>
                                                </div>
                                                <label for="audioInput" type="button" class="btn mt-2 text-white btn-secondary">Carregar audio</label>

                                            </form>
                                        </div>
                                    </div>

                                    <!-- CONTEÚDO DA MENSAGEM -->

                                    <div class="col-12 ">
                                        <div class="input-group">
                                            <label for="name">Conteúdo da mensagem</label>
                                            <div class="placeholder-input w-100">
                                                <div class="input-container">
                                                    <textarea placeholder="Digite aqui..." id="mensagem" name="mensagem" type="text" class="input-default text-area"></textarea>
                                                    <small class="input-message"></small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>



                            </section>

                            <div class="divider"></div>

                        </div>
                        <div class="divider"></div>
                        <footer class="d-flex justify-content-between p-3 p-md-4">
                            <a href="<?php echo $url; ?>home">
                                <button type="button" class="button-default border-blue-800 color-blue-800">Cancelar</button>
                            </a>
                            <button type="submit" class="button-default bg-blue color-white">Prosseguir</button>
                        </footer>
                    </div>
                </form>
            </section>
        </section>

        <div id="modal-disparo" class="modal fade" tabindex="-1">
            <!-- Scrollable modal -->
            <div aria-hidden="true" class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">Destino dos envios</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <p>
                                Anexe o arquivo excel <b>.XLSX</b> para efetuar os disparos. <br/>
                                O arquivo deve conter uma lista com colunas entituladas <b>nome</b> e <b>telefone</b>.
                                <br/>
                                <br/>
                                Após enviar o arquivo, visualize os contatos extraidos e confirme o envio dos disparos.
                            </p>

                            <div class="form-group my-3">
                                <div class="label-control mb-2">
                                    Enviar arquivo de contatos
                                </div>
                                <input id="inpContatos" type="file" class="d-none">
                                <label for="inpContatos" id="btn-input" class="btn btn-primary">
                                    <i class="fa-solid fa-upload"></i> Enviar excel
                                </label>
                            </div>
                            <table id="table-contatos" class="table table-striped">
                                <thead></thead>
                                <tbody></tbody>
                                <tfoot></tfoot>
                            </table>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                            <button type="button" id="btn-confirmar-envio" disabled class="btn btn-primary">Confirmar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- libs -->
    <!-- <script src="<?php echo $cdn ?>libs/swiper/swiper-bundle.min.js"></script> -->
    <!-- dependencies -->
    <script src="<?php echo $cdn ?>libs/jquery/js/jquery.min.js"></script>
    <script src="<?php echo $cdn ?>libs/bootstrap/js/bootstrap.bundle.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/datatables.min.js"></script>

    <!-- SheetJS to handle Excel files -->
    <script src="<?php echo $cdn ?>libs/xlsx/xlsx.full.min.js"></script>

    <!-- default imports -->
    <script src="<?php echo $cdn ?>libs/sweetalert2/js/sweetalert2.min.js"></script>
    <script src="<?php echo $cdn ?>js/global.js"></script>
    <script src="<?php echo $url ?>js/adm-global.js"></script>
    <!-- page script -->
    <script src="<?php echo $cdn ?>/js/cms/cms.js"></script>
    <script src="<?php echo $url; ?>/js/servicos/disparos/disparos.js"></script>

</body>

</html>