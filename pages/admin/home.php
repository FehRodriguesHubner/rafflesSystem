<?php

require_once __DIR__ . '/../../config/init-config.php';

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
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/css/buttons.bootstrap5.min.css">
    <link rel="stylesheet" type="text/css" href="<?php echo $cdn; ?>libs/jquery-datatable/css/dataTables.bootstrap5.min.css">


    <!-- styles global -->
    <link rel="stylesheet" href="<?php echo $cdn ?>css/styles.css">
    <link rel="stylesheet" href="<?php echo $cdn ?>css/cms.css">
    <link rel="stylesheet" href="<?php echo $url; ?>css/adm-styles.css">

    <title>Home</title>
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
        require_once __DIR__ . '/../../template/aside.phtml';
        ?>

        <section class="wrapper-contents">
            <?php require_once __DIR__ . '/../../template/header.phtml'; ?>
            <section class="main-wrapper-contants">

                <header class="d-flex justify-content-between align-items-center mb-2 mb-md-4">
                    <h3 class="title-header">Home</h3>
                </header>
                <div class="card-profile p-lg-4 p-md-3 p-2">

                    <div data-switch-load-view class="datatables-container p-3 p-md-4 d-flex">
                        <div class="d-flex gap-5 flex-column">
                            <div style="width:600px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:800px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:800px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:600px;height:40px;" class="placeholder-custom-size"></div>
                        </div>
                    </div>

                    <div data-switch-load-view id="hidden-content" class="d-none">

                        <div class="row">

                            <div class="col-12">
                                <h2 class="mb-2 text-title">Bem-vindo(a), <span data-replace-user="name"></span>!</h2>
                                <h5 class="mb-5 text-muted"><span data-replace-user="emp_name"></span></h5>
                            </div>

                            <div class="col-md-4">
                                <div class="mb-4">
                                    <div class="modal-content">
                                        <div class="modal-header">
                                            <h4 id="custom-modal-wpp-title" class="modal-title text-success"><i class="fa-brands fa-whatsapp"></i> Integração Whatsapp </h4>
                                        </div>
                                        <div id="custom-modal-wpp-content" class="modal-body">
                                            <div id="wppDisplayDados" style="margin-bottom: 30px">
                                                <div id="instancia-wpp-status" class="instancia-status">
                                                    <i id="wpp-status-icon" class="wpp-status-icon"></i>
                                                    <span id="wpp-status-text"></span>
                                                </div>

                                                <div id="wpp-desc" class="text-muted mt-2"></div>


                                            </div>
                                        </div>
                                        <div class="modal-footer">
                                            <div class="instancia-botoes">
                                                <button data-btn-acao-wpp type="button" id="btn-wpp-conecta" class="btn-success btn">
                                                    Conectar Whatsapp
                                                </button>
                                                <button data-dismiss="modal" type="button" id="btn-wpp-limpa" class="btn btn-danger red">
                                                    Limpar Conexão
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <a href="<?php echo $url; ?>servicos/disparos">
                                    <div class="card mb-4">
                                        <div class="card-body text-primary">
                                            <h1 class="card-title text-center mb-4"><i class="fa-solid fa-paper-plane"></i></h1>
                                            <h6 class="card-subtitle mb-2 text-muted text-center">Disparo em massa</h6>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="col-md-3">
                                <div class="card mb-4 pointer-events-none placeholder-default">
                                    <div class="card-body text-secondary">
                                        <h1 class="card-title text-center mb-4"><i class="fa-solid fa-robot"></i></h1>
                                        <h6 class="card-subtitle mb-2 text-muted text-center">Automações de conversa</h6>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <h2 class="mb-5 mt-3 text-title">Disparos</h2>
                            </div>

                            <div class="col-md-3">
                                <a href="<?php echo $url; ?>servicos/disparos">
                                    <div class="card mb-4">
                                        <div class="card-body text-primary">
                                            <h1 class="card-title text-center mb-4"><i class="fa-solid fa-paper-plane"></i></h1>
                                            <h6 class="card-subtitle mb-2 text-muted text-center">Disparo em massa</h6>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div class="col-md-3">
                                <a href="<?php echo $url; ?>servicos/disparo-unico">
                                    <div class="card mb-4">
                                        <div class="card-body text-primary">
                                            <h1 class="card-title text-center mb-4"><i class="fa-solid fa-envelope"></i></h1>
                                            <h6 class="card-subtitle mb-2 text-muted text-center">Disparo único</h6>
                                        </div>
                                    </div>
                                </a>
                            </div>

                            <div class="col-12">
                                <h2 class="mb-5 mt-3 text-title">Automações</h2>
                            </div>

                            <div class="col-md-3">
                                <div class="card mb-4 pointer-events-none placeholder-default">
                                    <div class="card-body text-info">
                                        <h1 class="card-title text-center mb-4"><i class="fa-solid fa-robot"></i></h1>
                                        <h6 class="card-subtitle mb-2 text-muted text-center">Automações de conversa</h6>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3">
                                <div class="card mb-4 pointer-events-none placeholder-default">
                                    <div class="card-body text-info">
                                        <h1 class="card-title text-center mb-4"><i class="fa-solid fa-users"></i></h1>
                                        <h6 class="card-subtitle mb-2 text-muted text-center">Captura de leads</h6>
                                    </div>
                                </div>
                            </div>

                            <div class="col-12">
                                <h2 class="mb-5 mt-3 text-title">Ferramentas & Opções</h2>
                            </div>

                            <div class="col-md-3">
                                <button id="btn-exportar-contatos" type="button" class="card w-100 mb-4">
                                    <div class="card-body text-warning w-100">
                                        <h1 class="card-title text-center mb-4">
                                            <i class="fa-solid fa-address-book"></i>
                                        </h1>
                                        <h6 class="card-subtitle mb-2 text-muted text-center">Exportar contatos</h6>
                                    </div>
                                </button>
                            </div>

                            <div class="col-md-3">
                                <button id="btn-exportar-chats" type="button" class="card w-100 mb-4">
                                    <div class="card-body text-warning w-100">
                                        <h1 class="card-title text-center mb-4">
                                            <i class="fa-solid fa-comment-dots"></i>
                                        </h1>
                                        <h6 class="card-subtitle mb-2 text-muted text-center">Exportar contatos em chat</h6>
                                    </div>
                                </button>
                            </div>

                        </div>

                    </div>

                </div>


            </section>
        </section>


        <div id="modal-contatos" class="modal fade" tabindex="-1">
            <!-- Scrollable modal -->
            <div aria-hidden="true" class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="modalContatosTitle">Exportar contatos</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                            <p>
                                Analise os dados da exportação abaixo.
                            </p>

                            <table id="table-contatos" class="table table-striped w-100"></table>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </main>

    <!-- libs -->
    <!-- <script src="<?php echo $cdn ?>libs/swiper/swiper-bundle.min.js"></script> -->
    <!-- dependencies -->
    <script src="<?php echo $cdn ?>libs/axios/axios.min.js"></script>
    <script src="<?php echo $cdn ?>libs/jquery/js/jquery.min.js"></script>
    <script src="<?php echo $cdn ?>libs/bootstrap/js/bootstrap.bundle.js"></script>

    <!-- default imports -->
    <script src="<?php echo $cdn ?>libs/sweetalert2/js/sweetalert2.min.js"></script>
    <script src="<?php echo $cdn ?>js/global.js"></script>
    <script src="<?php echo $url ?>js/adm-global.js"></script>
    <!-- datatables -->
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/datatables.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/dataTables.bootstrap5.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/qrcode/qrcode.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/dataTables.buttons.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/buttons.flash.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/jszip.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/pdfmake.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/extensions/export/vfs_fonts.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/buttons.html5.min.js"></script>
    <script src="<?php echo $cdn; ?>libs/jquery-datatable/js/buttons.print.min.js"></script>
    <!-- page script -->
    <script src="<?php echo $cdn ?>/js/cms/cms.js"></script>
    <script src="<?php echo $url; ?>/js/admin/home.js"></script>

</body>

</html>