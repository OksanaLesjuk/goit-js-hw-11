import { getPhotosService } from "./api";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const form = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')
const btnLoad = document.querySelector('.load-more')
const enterInput = form.firstElementChild;
const btnSearch = form.lastElementChild;


let currentPage = 1;
let querry = ""
let quantityPage = null

// form.addEventListener('submit', handlerSearch)
// btnLoad.addEventListener('click', handlerLoad)
enterInput.addEventListener('focus', handlerFocusInput)

btnLoad.classList.add('is-hidden')
btnSearch.disabled = true;

function handlerFocusInput() {
    btnSearch.disabled = false;
    form.addEventListener('submit', handlerSearch)
}

async function handlerSearch(evt) {
    handlerFocusInput()
    evt.preventDefault();
    gallery.innerHTML = ""
    currentPage = 1;
    const { searchQuery } = evt.currentTarget.elements;
    querry = searchQuery.value.trim();

    if (evt.type === 'submit') {
        try {
            btnLoad.classList.add('is-hidden')
            const getPhotos = await getPhotosService(querry);
            const { hits, totalHits } = getPhotos;

            if (!hits.length) {
                Notify.failure('Sorry, there are no images matching your search query. Please try again.');
                return;
            }

            Notify.info(`Hooray! We found ${totalHits} images.`);

            gallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

            createLightbox();

            quantityPage = Math.ceil(totalHits / 40);

            if (currentPage < quantityPage) {
                btnLoad.classList.remove('is-hidden');
                btnLoad.addEventListener('click', handlerLoad)
            }
        }
        catch (err) {
            Notify.failure(err.message);
        }
    }
}

async function handlerLoad() {
    currentPage += 1;
    console.log(currentPage);
    try {
        const { hits } = await getPhotosService(querry, currentPage);

        gallery.insertAdjacentHTML('beforeend', createMarcupGallery(hits));

        createLightbox();
        scrollGallery();

        if (currentPage === quantityPage) {
            Notify.info("We're sorry, but you've reached the end of search results.");
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

function scrollGallery() {
    const { height: cardHeight } = document
        .querySelector(".gallery")
        .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}