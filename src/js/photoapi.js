import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '33239789-edeb40e5557373312058accfd';

class PhotoApi {
  constructor() {
    this.queryPage = 1;
    this.perPage = '40';
    this.queryValue = '';
    this.totalHits = 0;
    this.hits = [];
  }

  async fetchPhoto() {
    const { data } = await axios
      .get(
        `${URL}?key=${API_KEY}&q=${this.queryValue}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${this.perPage}&page=${this.queryPage}`
      )

      .then(res => {
        this.hits = res.data.hits;
        this.totalHits = res.data.totalHits;

        this.getError();
        this.getNotification();

        this.queryPage += 1;
        console.log(res);
        return res;
      });

    console.log(data);
    return data;
  }

  resetPage() {
    this.queryPage = 1;
  }

  getNotification() {
    if (this.queryPage === 1) {
      console.log(`Hooray! We found ${this.totalHits} images`);
    }
    if (this.hits.length < this.perPage) {
      console.log(`We're sorry, but you've reached the end of search results`);
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

export { PhotoApi };
