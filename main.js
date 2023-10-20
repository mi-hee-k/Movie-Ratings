const form = document.querySelector('.within-result-form');
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const withinInput = document.querySelector('.within-input');
const cardSection = document.querySelector('.card-section');
const home = document.querySelector('h1');
const popularBtn = document.querySelector('.popular-btn');
const topBtn = document.querySelector('.top-btn');

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
  fetchData('top_rated.json');
  withinInput.focus();
});

popularBtn.addEventListener('click', () => {
  // fetchData('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1');
  fetchData('popular.json');
});

// popular
searchForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue.length === 0) {
    searchInput.focus();
    return;
  }
  // fetchData(
  //   `https://api.themoviedb.org/3/search/movie?query=${searchValue}&language=ko-KR&page=1`
  // );
  fetchData('search.json');
  searchInput.value = '';
});

// 결과 내 검색
function searchMovie() {
  const cards = cardSection.querySelectorAll('.card');

  function handleSearch(e) {
    e.preventDefault();
    let withinSearchValue = withinInput.value;

    cards.forEach((element) => {
      element.classList.remove('hidden');
      let movieTitle = element.childNodes[3].childNodes[1].innerText;
      if (!movieTitle.toLowerCase().includes(withinSearchValue)) {
        element.classList.add('hidden');
      }
    });
  }
  form.addEventListener('click', handleSearch);
}

// 카드추가
const makeCard = (movieData) => {
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

// top button
const showTopBtn = () => {
  window.scrollY > 200
    ? topBtn.classList.add('show')
    : topBtn.classList.remove('show');
};

window.addEventListener('scroll', showTopBtn);

const scrollWindow = function () {
  if (window.scrollY != 0) {
    setTimeout(function () {
      window.scrollTo(0, window.scrollY - 50);
      scrollWindow();
    }, 10);
  }
};

topBtn.addEventListener('click', scrollWindow);
