//ВАРІАНТ КОДУ З КНОПКОЮ LOAD MORE та безкінечним скролом одночасно
import { getPhotosService } from "./api";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoad = document.querySelector('.load-more');
const guard = document.querySelector('.js-guard');
const enterInput = form.firstElementChild;
const btnSearch = form.lastElementChild;
const btnToTop = document.getElementById('scroll-to-top-btn');

const perPage = 40;
let currentPage = 1;
let querry = "";
let quantityPage = null;

enterInput.addEventListener('input', handlerInput)
window.addEventListener('scroll', handlerTopScroll)
btnToTop.addEventListener('click', handlerBtnToTop)

btnLoad.classList.add('is-hidden')
btnSearch.disabled = true;

function handlerInput() {
    btnSearch.disabled = false;
    form.addEventListener('submit', handlerSearch)
}

async function handlerSearch(evt) {
    handlerInput()
    evt.preventDefault();
    gallery.innerHTML = ""
    currentPage = 1;
    const { searchQuery } = evt.currentTarget.elements;
    querry = searchQuery.value.trim();

    if (evt.type === 'submit') {
        btnLoad.classList.add('is-hidden')
        try {
            const getPhotos = await getPhotosService(querry);
            const { hits, totalHits } = getPhotos;

            if (!hits.length) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            }

            Notify.info(`Hooray! We found ${totalHits} images.`);

            gallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

            createLightbox();

            quantityPage = Math.ceil(totalHits / perPage);

            if (currentPage < quantityPage) {
                btnLoad.classList.remove('is-hidden');
                btnLoad.addEventListener('click', handlerLoad);
                observer.observe(guard);
            }
        }
        catch (err) {
            Notify.failure(err.message);
        }
    }
}

async function handlerLoad() {
    currentPage += 1;

    try {
        const { hits } = await getPhotosService(querry, currentPage);

        gallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

        createLightbox();
        scrollGallery();

        if (currentPage === quantityPage) {
            Notify.info("We're sorry, but you've reached the end of search results.");
            observer.unobserve(guard);
            btnLoad.classList.add('is-hidden');
        }
    }
    catch (err) {
        Notify.failure(err.message);
    }
}



function createMarcupGallery(hits) {
    return hits.map((
        { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
        return `<a href="${largeImageURL}" class="link-lightbox"><div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes ${likes}</b>
          </p>
          <p class="info-item">
            <b>Views ${views}</b>
          </p>
          <p class="info-item">
            <b>Comments ${comments}</b>
          </p>
          <p class="info-item">
            <b>Downloads ${downloads}</b>
          </p>
        </div>
      </div>
      </a>`
    }).join(" ");

}

function createLightbox() {
    const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
    lightbox.refresh();
}
// для автоматичної прокрутки сторінки при завантаженні нової партії фото 
function scrollGallery() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}


//інфініті-скрол
const observer = new IntersectionObserver(handlerInfinitiLoad, {
    rootMargin: '300px',
    threshold: 1.0
});

//колбек для обсервера 
function handlerInfinitiLoad(entries, observer) {

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log(entry);
            currentPage += 1;
            createNewPage();
        }
    });

    if (currentPage < quantityPage) {

        btnLoad.classList.remove('is-hidden');
        btnLoad.addEventListener('click', handlerLoad);
        observer.observe(guard);
    }

    if (currentPage === quantityPage) {
        observer.unobserve(guard);
        btnLoad.classList.add('is-hidden');
        Notify.info("We're sorry, but you've reached the end of search results.");
    }
}

async function createNewPage() {
    try {
        const { hits } = await getPhotosService(querry, currentPage);

        gallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

        createLightbox();

    }
    catch (err) {
        Notify.failure(err.message);
        console.log(err);
    }
}


function handlerTopScroll() {
    if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
        btnToTop.classList.add('visible');
    } else {
        btnToTop.classList.remove('visible');
    }
}

function handlerBtnToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

