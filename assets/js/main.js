var buyBtns = document.querySelectorAll('.js-buy-ticket')
var closeBtn = document.querySelector('.js-close-btn')
var modal = document.querySelector('.js-modal')
var modalContainer = document.querySelector('.js-modal-container')
var header = document.querySelector('#header')
var menuBtn = document.querySelector('.js-menu-btn')
var menuLiElements = document.querySelectorAll('.js-nav-mobile')
var subNav = document.getElementById('js-sub-nav')
var slides = document.querySelectorAll('.js-slide')

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

var slideIndex = 0;

function showSlides() {
    for(var i = 0; i < slides.length; i++){
        slides[i].style.display = 'none';
    }
    slideIndex++;
    if(slideIndex > slides.length){
        slideIndex = 1;
    }
    slides[slideIndex - 1].style.display = 'block';
    setTimeout(showSlides, 3000) // thay đổi slide sau 3s
}

showSlides();




