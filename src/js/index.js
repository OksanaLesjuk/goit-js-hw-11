import { getPhotosService } from "./api";

const form = document.querySelector('#search-form')
const gallery = document.querySelector('.gallery')

form.addEventListener('submit', handlerSearch)
// const btnSearch = 



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
        return `<div class="photo-card">
        <img src="${webformatURL}" alt="${tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>${likes} Likes</b>
          </p>
          <p class="info-item">
            <b>${views} Views</b>
          </p>
          <p class="info-item">
            <b>${comments} Comments</b>
          </p>
          <p class="info-item">
            <b>${downloads} Downloads</b>
          </p>
        </div>
      </div>`
    }).join(" ");



    gallery.insertAdjacentHTML('beforeend', marcup)

}