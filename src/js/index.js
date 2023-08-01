import { getPhotosService } from "./api";

import SimpleLightbox from "simplelightbox";

import "simplelightbox/dist/simple-lightbox.min.css";

const form = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')

form.addEventListener('submit', handlerSearch)




async function handlerSearch(evt) {
    evt.preventDefault();

    const { searchQuery } = evt.currentTarget.elements;



    if (evt.type === 'submit') {
        try {
            const getPhotos = await getPhotosService(searchQuery.value);
            console.dir(getPhotos);

            marcupGallery(getPhotos);



        }


        catch (err) {
            console.log(err);
        }
    }
}


// webformatURL - посилання на маленьке зображення для списку карток.
// largeImageURL - посилання на велике зображення.
// tags - рядок з описом зображення. Підійде для атрибуту alt.
// likes - кількість лайків.
// views - кількість переглядів.
// comments - кількість коментарів.
// downloads - кількість завантажень.
function marcupGallery({ hits }) {


    const marcup = hits.map((
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



    gallery.insertAdjacentHTML('beforeend', marcup)


    const lightbox = new SimpleLightbox('.gallery a', {
        captions: true,
        captionsData: 'alt',
        captionDelay: 250,
    });
}
