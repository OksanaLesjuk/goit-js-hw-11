import { getPhotosService } from "./api";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')
const btnLoad = document.querySelector('.load-more')


form.addEventListener('submit', handlerSearch)
btnLoad.addEventListener('click', handlerLoad)

let currentPage = 1;
let querry = ""

async function handlerSearch(evt) {
    evt.preventDefault();

    const { searchQuery } = evt.currentTarget.elements;
    querry = searchQuery.value;


    if (evt.type === 'submit') {
        try {
            const getPhotos = await getPhotosService(querry);

            gallery.insertAdjacentHTML('beforeend', marcupGallery(getPhotos));
            createLightbox();


        }
        catch (err) {
            console.log(err);
        }
    }
}

async function handlerLoad() {
    currentPage += 1;


    try {
        const getPhotos = await getPhotosService(querry, currentPage);
        gallery.insertAdjacentHTML('beforeend', marcupGallery(getPhotos));
        createLightbox();

    }
    catch (err) {
        console.log(err);
    }
}



function marcupGallery({ hits }) {
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
}