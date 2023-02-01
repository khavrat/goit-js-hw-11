import { PhotoApi } from './js/photoapi.js';
import { LoadBtn } from './js/loadbtn.js';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = new LoadBtn('.load-more');
loadMoreBtn.show();

const photoApi = new PhotoApi();

form.addEventListener('submit', fetchPhotoBySubmit);
loadMoreBtn.button.addEventListener('click', fetchPhotoList);

function fetchPhotoBySubmit(e) {
  e.preventDefault();

  console.log(photoApi);
  cleanPhotoList();
  photoApi.resetPage();

  const form = e.currentTarget;
  photoApi.queryValue = form.elements.searchQuery.value.trim();
  console.log(photoApi.queryValue);

  fetchPhotoList()
    .catch(onError)
    .finally(() => form.reset());
}

function createMarkup(hits) {
  const { webformatURL, tags, likes, views, comments, downloads } = hits;
  return `<div class="photo-card">
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
`;
}

function updatePhotoList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.show();
}

function cleanPhotoList() {
  gallery.innerHTML = '';
  loadMoreBtn.hide();
}

function fetchPhotoList() {
  console.log(photoApi);

  return photoApi
    .fetchPhoto()
    .then(({ hits }) => {
      console.log(hits);
      return hits.reduce((markup, photo) => createMarkup(photo) + markup, '');
    })
    .then(updatePhotoList);

}


function onError(error) {
  if (error.message === 'empty request') {
    console.log('empty request');
  } else if (error.message === 'nothing found') {
    console.log(
      'Sorry, there are no images matching your search query. Please try again'
    );
  }
}

