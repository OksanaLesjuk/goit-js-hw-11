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

const perPage = 40;
let currentPage = 1;
let querry = "";
let quantityPage = null;

btnLoad.classList.add('is-hidden');
btnSearch.disabled = true;

enterInput.addEventListener('input', handlerFocusInput)

function handlerFocusInput() {
    btnSearch.disabled = false;
    form.addEventListener('submit', handlerSearch)
}

async function handlerSearch(evt) {
    handlerFocusInput();
    evt.preventDefault();
    gallery.innerHTML = "";
    currentPage = 1;
    const { searchQuery } = evt.currentTarget.elements;
    querry = searchQuery.value.trim();

    if (evt.type === 'submit') {
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
                observer.observe(guard);
            }
        }
        catch (err) {
            Notify.failure(err.message);
            console.log(err);
        }
    }
}



//розмітка для отриманих фото від бекенду
function createMarcupGallery(hits) {
    return hits.map((
        { webformatURL, largeImageURL, tags, likes, views, comments, downloads }
    ) => {
        return `<a href="${largeImageURL}" class="link-lightbox">
        <div class="photo-card">
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


//для перегляду фото
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
async function handlerLoad(entries, observer) {
    try {
        entries.forEach(entry => {

            if (entry.isIntersecting) {
                currentPage += 1;
                createNewPage();

            }
        });
        if (currentPage === quantityPage) {
            observer.unobserve(guard);
            Notify.info("We're sorry, but you've reached the end of search results.");
        }
    }
    catch (err) {
        Notify.failure(err.message);
        console.log(err);
    }

}

async function createNewPage() {
    try {
        const { hits } = await getPhotosService(querry, currentPage);

        gallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

        createLightbox();
        scrollGallery();

    }
    catch (err) {
        Notify.failure(err.message);
        console.log(err);
    }
}

const observer = new IntersectionObserver(handlerLoad, {
    rootMargin: '100px',
    threshold: 1.0
});