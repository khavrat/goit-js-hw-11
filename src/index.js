import { ImgApi } from './js/photoapi.js';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

form.addEventListener('submit', fetchImgBySubmit);
loadMoreBtn.addEventListener('click', fetchImgList);

loadMoreBtn.classList.add('hidden');

const imgApi = new ImgApi();
const lightbox = new SimpleLightbox('.gallery-item');


function fetchImgBySubmit(e) {
  e.preventDefault();

  cleanImgList();
  imgApi.resetPage();

  const form = e.currentTarget;
  imgApi.queryValue = form.elements.searchQuery.value.trim();

  fetchImgList()
    .catch(onError)
    .finally(() => form.reset());
}

function fetchImgList() {
  return imgApi
    .fetchImg()
    .then(({ hits }) => {
      console.log(hits);
      return hits.reduce((markup, img) => createMarkup(img) + markup, '');
    })
    .then(updateImgList);
}

function createMarkup(hits) {
  const {
    largeImageURL,
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = hits;
  return ` <a class="gallery-item" href="${largeImageURL}"><div class="img-card">
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
    </div></a>
`;
}

function updateImgList(markup) {
  gallery.insertAdjacentHTML('beforeend', markup);
  loadMoreBtn.classList.remove('hidden');

  smoothyScroll();
  lightbox.refresh();
}

function onError(error) {
  if (error.message === 'empty request') {
    Notify.failure('Empty request. Enter a word to search for an image');
    console.log(error.message);
  } else if (error.message === 'nothing found') {
    Notify.failure(
      'Sorry, there are no images matching your search query. Please try again'
    );
    console.log(error.message);
  }
}

function cleanImgList() {
  gallery.innerHTML = '';
  loadMoreBtn.classList.add('hidden');
}

function smoothyScroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
