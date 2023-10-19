const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const cardSection = document.querySelector('.card-section');
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
    .then(() => {
      searchMovie();
    })
    .catch((err) => console.error(err));
};

// Top Rated
document.addEventListener('DOMContentLoaded', () => {
  fetchData('dummy.json');
  searchInput.focus();
});

// 검색
function searchMovie() {
  const cards = cardSection.querySelectorAll('.card');

  function handleSearch(e) {
    e.preventDefault();
    let searchValue = searchInput.value;

    cards.forEach((element) => {
      element.classList.remove('hidden');
      let movieTitle = element.childNodes[3].childNodes[1].innerText;
      if (!movieTitle.toLowerCase().includes(searchValue)) {
        element.classList.add('hidden');
      }
    });
  }
  form.addEventListener('click', handleSearch);
}

// 카드추가
const makeCard = (movieData) => {
  console.log(movieData);
  cardSection.innerHTML = movieData
    .map((item) => {
      return `<div class="card" id="${item.id}" onclick="alert(${item.id})">
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
            }</h2>
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
