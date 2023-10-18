const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const btn = document.querySelector('button');
const cardSection = document.querySelector('.card-section');

const ReadToken = config.readToken;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ReadToken}`,
  },
};

// fetch
const fetchData = async (url) => {
  return await fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      let movieData = json.results;
      makeCard(movieData);
    })
    .catch((err) => console.error('error:' + err));
};

// popular
document.addEventListener('DOMContentLoaded', () => {
  fetchData('https://api.themoviedb.org/3/movie/popular?language=ko-KO&page=1');
});

// search
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = searchInput.value;
  fetchData(
    `https://api.themoviedb.org/3/search/movie?query=${searchValue}&include_adult=false&language=en-US&page=1`
  );
});

// 카드추가
const makeCard = (movieData) => {
  cardSection.innerHTML = movieData
    .map((item) => {
      return `<div class="card">
          <div class="img-box">
            <img
              src="https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg"
              alt=""
            />
          </div>
          <div class="movie-card">
            <h2 class="title">${
              item.original_title.length > 60
                ? item.original_title.substr(0, 60) + '...'
                : item.original_title
            }</h2>
            <p class="desc">
              ${
                item.overview.length > 150
                  ? item.overview.substr(0, 150) + '...'
                  : item.overview
              }
            </p>
            <span class="rating">평점 ${item.vote_average}</span>
          </div>
        </div>`;
    })
    .join('');
};
