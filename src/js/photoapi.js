import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const loadMoreBtn = document.querySelector('.load-more');

const URL = 'https://pixabay.com/api/';
const API_KEY = '33239789-edeb40e5557373312058accfd';

class ImgApi {
  constructor() {
    this.queryPage = 1;
    this.perPage = '40';
    this.queryValue = '';
    this.totalHits = 0;
    this.hits = [];
  }

  async fetchImg() {
    const { data } = await axios
      .get(
        `${URL}?key=${API_KEY}&q=${this.queryValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.queryPage}`
      )

      .then(res => {
        loadMoreBtn.disabled = false;
        loadMoreBtn.textContent = `Load more`;

        this.hits = res.data.hits;
        this.totalHits = res.data.totalHits;

        this.getError();
        this.getNotification();

        this.queryPage += 1;

        return res;
      });

    return data;
  }

  resetPage() {
    this.queryPage = 1;
  }

  getNotification() {
    if (this.queryPage === 1) {
      Notify.info(`Hooray! We found ${this.totalHits} images`);
    }
    if (this.hits.length < this.perPage) {
      loadMoreBtn.disabled = true;
      loadMoreBtn.textContent = `We're sorry, but you've reached the end of search results`;
    }
  }

  getError() {
    if (this.queryValue === '') {
      throw new Error('empty request');
    }
    if (this.hits.length === 0) {
      throw new Error('nothing found');
    }
  }
}

export { ImgApi };

