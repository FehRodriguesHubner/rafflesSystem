// HEADER FUNCTIONS

function renderHeaderPath(nav){
    if(nav){
        let linkWrapper = document.createElement('div');
        let headerRoutes = document.querySelector('#header-routes');
        let svgChevron = /*html*/`
                <svg width="6" height="12" viewBox="0 0 6 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1.15632 1.04749L5.69905 5.78819C5.8094 5.90239 5.86419 6.05054 5.86419 6.19792C5.86419 6.34531 5.8094 6.49343 5.69905 6.60763L1.15632 11.3483C0.930345 11.5852 0.555331 11.593 0.319231 11.3661C0.0815765 11.1408 0.0738482 10.7642 0.301478 10.5289L4.4508 6.19792L0.301478 1.86692C0.0738478 1.63236 0.081576 1.25504 0.319231 1.02974C0.55533 0.802896 0.930344 0.810599 1.15632 1.04749Z" fill="#ACB4BA"/>
                </svg>
            `;
        for(let index in nav){

            let indexAux = parseInt(index) + 1;
            let itemNav = nav[index];
            let content = document.createElement('div');
            let path;

            if(itemNav?.link){
                path = document.createElement('a');
                path.setAttribute('href',itemNav.link);
                path.innerHTML = itemNav.label ;
            }else{
                path = document.createElement('span');
                path.innerHTML = itemNav.label;
            }
            content.append(path);
            
            if(indexAux != nav.length){
                content.append(document.createTextNode( '\u00A0' ));
                content.insertAdjacentHTML("beforeend", svgChevron);
                content.append(document.createTextNode( '\u00A0' ));
            }

            linkWrapper.append(content);
            
            if(index != 0){
                if(index % 2 === 0){
                    headerRoutes.append(linkWrapper);
                    linkWrapper = document.createElement('div');
                }else if(indexAux == nav.length){
                    headerRoutes.append(linkWrapper);
                }

            }else if(nav.length == 1){
                headerRoutes.append(linkWrapper);
                linkWrapper = document.createElement('div');
            }else if(indexAux == nav.length){
                headerRoutes.append(linkWrapper);
            }

        }
    }
}
function renderPageActive(pageId){
    let element = document.getElementById('cms-link-aside-' + pageId);

    element.classList.add('active');
}
// HEADER SETTINGS

// aside config
window.document.addEventListener('DOMContentLoaded', function(){
    document.querySelector('#toggle-container').addEventListener('click',function(){
        document.querySelector('#toggle-container').classList.toggle("active");
        document.querySelector('.sidenav').classList.toggle("active");
        document.querySelector('.sidenav-overlay').classList.toggle("active");
    });
    
    document.querySelector('.sidenav-overlay').addEventListener('click',function(){
        document.querySelector('#toggle-container').classList.toggle("active");
        document.querySelector('.sidenav').classList.toggle("active");
        document.querySelector('.sidenav-overlay').classList.toggle("active");
    }); 
});
