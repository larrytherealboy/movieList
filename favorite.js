const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const POSTER_URL = BASE_URL + "/posters/"

const movies = JSON.parse(localStorage.getItem('favoriteMovies'))

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

// 讓函式更能活用，因此函式參數以data呈現，render data資料
function renderMovieList(data) {
  let rawHTML = ``
  data.forEach(item => {

    //image, title, 第29行，將more button綁定id，以便撈取該點擊電影的詳細資料
    rawHTML += `<div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${POSTER_URL + item.image}"
              class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer text-muted">
              <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal"
                data-bs-target="#movie-model"
                data-id=${item.id}>More</button> 
              <button type="button" data-id=${item.id} class="btn btn-danger btn-remove-favorite">x</button>
            </div>
          </div>
        </div>
      </div>`
  })
  dataPanel.innerHTML = rawHTML;
}

// 顯示電影詳細資料
function showMovieModel(id) {
  const modelTitle = document.querySelector('#movie-model-title')
  const modelDate = document.querySelector('#movie-model-date')
  const modelImage = document.querySelector('#movie-model-image')
  const modelDiscription = document.querySelector('#movie-model-discription')

  axios.get(INDEX_URL + id)
    .then(function (response) {
      const data = response.data.results
      modelTitle.innerText = data.title
      modelDate.innerText = 'Release date: ' + data.release_date
      modelDiscription.innerText = data.description
      modelImage.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="image-fluid">`
      console.log(response.data.results)
    })
    .catch(function (error) {
      // handle error
      console.log(error);
    })
}

function removieFromFavorite(id) {
  if (!movies || !movies.length) return 

  const movieIndex = movies.findIndex(movie => movie.id === id)
  if (movieIndex === -1) return
  console.log(movieIndex)

  movies.splice(movieIndex, 1)
  localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  renderMovieList(movies)
}

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModel(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removieFromFavorite(Number(event.target.dataset.id))
  }
})

renderMovieList(movies)
