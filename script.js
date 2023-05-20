const movieSearchBox = document.getElementById('movie-search-box');
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');

async function loadMovies(searchTerm) {
    const URL = `https://omdbapi.com/?s=${searchTerm}&page=1&apikey=fc1fef96`;
    const res = await fetch(URL);
    const data = await res.json();
    if (data.Response == "True") {
        displayMovieList(data.Search);
    }
}

function findMovies() {
    let searchTerm = movieSearchBox.value.trim();
    if (searchTerm.length > 0) {
        searchList.classList.remove('hide-search-list');
        loadMovies(searchTerm);
    } else {
        searchList.classList.add('hide-search-list');
    }
}

function displayMovieList(movies) {
    searchList.innerHTML = ""; 
    for (let idx = 0; idx < movies.length; idx++) {
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');

        if (movies[idx].Poster != "N/A") {
            moviePoster = movies[idx].Poster;
        } else {
            moviePoster = "image_not_found.png";
        }

        let searchItemThumbnail = document.createElement('div');
        searchItemThumbnail.classList.add('search-item-thumbnail');
        let img = document.createElement('img');
        img.src = moviePoster;
        searchItemThumbnail.appendChild(img);
        movieListItem.appendChild(searchItemThumbnail);

        let searchItemInfo = document.createElement('div');
        searchItemInfo.classList.add('search-item-info');
        let h3 = document.createElement('h3');
        h3.textContent = movies[idx].Title;
        let p = document.createElement('p');
        p.textContent = movies[idx].Year;
        searchItemInfo.appendChild(h3);
        searchItemInfo.appendChild(p);
        movieListItem.appendChild(searchItemInfo);

        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails() {
    const searchListMovies = searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie => {
        movie.addEventListener('click', async () => {
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`http://www.omdbapi.com/?i=${movie.dataset.id}&apikey=fc1fef96`);
            const movieDetails = await result.json();
            displayMovieDetails(movieDetails);
        });
    });
}

function createMoviePoster(details) {
    let moviePosterDiv = document.createElement('div');
    moviePosterDiv.classList.add('movie-poster');
    let img = document.createElement('img');
    img.src = (details.Poster != "N/A") ? details.Poster : "image_not_found.png";
    img.alt = "movie poster";
    moviePosterDiv.appendChild(img);
    return moviePosterDiv;
  }
  
  function createMovieInfo(details) {
    let movieInfoDiv = document.createElement('div');
    movieInfoDiv.classList.add('movie-info');
  
    let titleElement = createMovieTitle(details.Title);
    let miscInfoList = createMovieMiscInfo(details);
    let otherDetails = createOtherMovieDetails(details);
  
    movieInfoDiv.appendChild(titleElement);
    movieInfoDiv.appendChild(miscInfoList);
    movieInfoDiv.appendChild(otherDetails);
  
    return movieInfoDiv;
  }
  
  function createMovieTitle(title) {
    let h3 = document.createElement('h3');
    h3.classList.add('movie-title');
    h3.textContent = title;
    return h3;
  }
  
  function createMovieMiscInfo(details) {
    let ul = document.createElement('ul');
    ul.classList.add('movie-misc-info');
  
    let liYear = createMiscInfoItem(`Year: ${details.Year}`);
    let liRated = createMiscInfoItem(`Ratings: ${details.Rated}`);
    let liReleased = createMiscInfoItem(`Released: ${details.Released}`);
  
    ul.appendChild(liYear);
    ul.appendChild(liRated);
    ul.appendChild(liReleased);
  
    return ul;
  }
  
  function createMiscInfoItem(text) {
    let li = document.createElement('li');
    li.textContent = text;
    return li;
  }
  
  function createOtherMovieDetails(details) {
    let movieDetailsDiv = document.createElement('div');
  
    let detailsArray = [
      { label: 'Writer', property: 'Writer' },
      { label: 'Actors', property: 'Actors' },
      { label: 'Genre', property: 'Genre' },
      { label: 'Runtime', property: 'Runtime' },
      { label: 'Plot', property: 'Plot' },
      { label: 'Language', property: 'Language' },
      { label: 'Awards', property: 'Awards', iconClass: 'fas fa-award' },
    ];
  
    detailsArray.forEach((detail) => {
      let p = createMovieDetailParagraph(detail.label, details[detail.property], detail.iconClass);
      movieDetailsDiv.appendChild(p);
    });
  
    return movieDetailsDiv;
  }
  
  function createMovieDetailParagraph(label, value, iconClass) {
    let p = document.createElement('p');
    p.classList.add(label.toLowerCase());
    let content = `<b>${label}:</b> ${value}`;
    if (iconClass) {
      content = `<b><i class="${iconClass}"></i></b> ${value}`;
    }
    p.innerHTML = content;
    return p;
  }
  
  function displayMovieDetails(details) {
    resultGrid.innerHTML = '';
  
    let moviePosterDiv = createMoviePoster(details);
    let movieInfoDiv = createMovieInfo(details);
  
    resultGrid.appendChild(moviePosterDiv);
    resultGrid.appendChild(movieInfoDiv);
  }
  

window.addEventListener('click', (event) => {
    if (event.target.className != "form-control") {
        searchList.classList.add('hide-search-list');
    }
});
