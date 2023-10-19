const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const btn = document.querySelector('button');
const cardSection = document.querySelector('.card-section');
const card = document.querySelector('.card');
const home = document.querySelector('h1');

const ReadToken = config.readToken;

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${ReadToken}`,
  },
};

home.addEventListener('click', () => {
  location.reload();
});

// 평점 -> ⭐
const starAverage = (average) => {
  if (average == 10) {
    average = '⭐⭐⭐⭐⭐';
  } else if (average > 8) {
    average = '⭐⭐⭐⭐';
  } else if (average > 6) {
    average = '⭐⭐⭐';
  } else if (average > 4) {
    average = '⭐⭐';
  } else if (average > 2) {
    average = '⭐';
  } else if (average > 0) {
    average = '☆';
  }
  return average;
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
  // fetchData('popular.json');
  searchInput.focus();
});

// search
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue.length === 0) {
    searchInput.focus();
    return;
  }
  fetchData(
    `https://api.themoviedb.org/3/search/movie?query=${searchValue}&page=1`
  );
  // fetchData('dummy.json');
});

// 카드추가
const makeCard = (movieData) => {
  cardSection.innerHTML = movieData
    .map((item) => {
      // fetch(`https://api.themoviedb.org/3/movie/${item.id}/keywords`, options)
      //   .then((res) => res.json())
      //   .then((json) => {
      //     let keywords = json.keywords;
      //     item = { ...item, keywords };
      //   })
      //   .catch((err) => console.error('error:' + err));
      return `<div class="card" onclick="alert(${item.id})">
          <div class="img-box">
              <img
                src=https://image.tmdb.org/t/p/w500${item.poster_path}
                alt=${item.original_title}
                onerror="this.style.display='none'"
              />
          </div>
          <div class="movie-card">
            <h2 class="title">${
              item.original_title.length > 50
                ? item.original_title.substr(0, 50) + '...'
                : item.original_title
            } ${item.genre_ids.includes(18) ? '🔞' : ''}</h2>
            <span><span>
            <p class="desc">
              ${
                item.overview.length > 100
                  ? item.overview.substr(0, 100) + '...'
                  : item.overview
              }
            </p>
            <div class="movie-card-footer">
            <span class="rating">평점 ${starAverage(item.vote_average)} (${
        item.vote_count
      })</span>
            </div>
          </div>
        </div>`;
    })
    .join('');
};
