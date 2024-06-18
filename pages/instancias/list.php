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

    <title>Instâncias</title>
    <link rel="apple-touch-icon" sizes="180x180" href="<?php echo $url;?>apple-touch-icon.png">
    <link rel="icon" type="image/png" sizes="32x32" href="<?php echo $url;?>favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="<?php echo $url;?>favicon-16x16.png">
    <link rel="manifest" href="<?php echo $url;?>site.webmanifest">
    <link rel="mask-icon" href="<?php echo $url;?>safari-pinned-tab.svg" color="#5bbad5">
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
                <div class="d-flex justify-content-center align-items-center gap-2">
                        <a data-btn-back>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.96401 18.6983L4.53543 12.984C4.27315 12.7084 4.14258 12.3546 4.14258 12.0002C4.14258 11.6459 4.27315 11.2921 4.53543 11.0164L9.96401 5.30211C10.5075 4.73011 11.4115 4.70668 11.9841 5.25022C12.5533 5.79429 12.5779 6.69943 12.0354 7.26975L8.89901 10.5716L18.714 10.5716C19.5031 10.5716 20.1426 11.2111 20.1426 12.0002C20.1426 12.7893 19.5031 13.4288 18.714 13.4288L8.89901 13.4288L12.0354 16.7307C12.5779 17.3015 12.5544 18.2067 11.9841 18.7502C11.4115 19.2937 10.5075 19.2703 9.96401 18.6983Z" fill="#3B454F" />
                            </svg>
                        </a> 
                        <h3 class="title-header mb-0">Instâncias</h3>
                    </div>
                    <a href="<?php echo $url;?>instancias/cadastrar/<?php echo $_GET['id']?>">
                        <button class="button-default bg-blue color-white" hover="brightness">Cadastrar</button>
                    </a> 
                </header>



                <div id="datatables-models" class="card-profile p-lg-4 p-md-3 p-2">

                    <div class="datatables-container p-3 p-md-4 d-flex">
                        <div class="d-flex gap-5 flex-column">
                            <div style="width:600px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:800px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:800px;height:40px;" class="placeholder-custom-size"></div>
                            <div style="width:600px;height:40px;" class="placeholder-custom-size"></div>
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
    <?php
        foreach($_GET as $key => $value){
            echo '<input type="hidden" name="get_'.$key.'" id="get_'.$key.'" value="'.$value.'"/>';
        }
    ?>

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
    <script src="<?php echo $url; ?>/js/instancias/list.js<?php echo $jsVersion;?>"></script>

</body>

</html>