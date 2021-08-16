var buyBtns = document.querySelectorAll('.js-buy-ticket')
var closeBtn = document.querySelector('.js-close-btn')
var modal = document.querySelector('.js-modal')
var modalContainer = document.querySelector('.js-modal-container')
var header = document.querySelector('#header')
var menuBtn = document.querySelector('.js-menu-btn')
var menuLiElements = document.querySelectorAll('.js-nav-mobile')
var subNav = document.getElementById('js-sub-nav')

function showModal() {
    modal.classList.add('open-modal')
}

function hideModal() {
    modal.classList.remove('open-modal')
}

for(var buyBtn of buyBtns) {
    buyBtn.addEventListener('click', showModal)
}

for(var menuLiElement of menuLiElements) {
    menuLiElement.onclick = function() {
        header.classList.remove('open-menu-btn')
    }
}

closeBtn.addEventListener('click', hideModal)
modal.addEventListener('click', hideModal)
modalContainer.addEventListener('click', function(event){
    event.stopPropagation();
})
menuBtn.onclick = function() {
    header.classList.toggle('open-menu-btn');
}
