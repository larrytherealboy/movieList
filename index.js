const BASE_URL = "https://webdev.alphacamp.io"
const INDEX_URL = BASE_URL + "/api/movies/"
const POSTER_URL = BASE_URL + "/posters/"
const MOVIES_PER_PAGE = 12

const movies = []
let filterMovies = []
let viewPoint = "card"
// 防止切換顯示模式後，頁面重新刷新
let page = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
const paginator = document.querySelector('#paginator')
const viewIcon = document.querySelector('#view-icon')

// 讓函式更能活用，因此函式參數以data呈現，render data資料
// Render Movie Card
function renderMovieCard(data) {
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
              <button type="button" data-id=${item.id} class="btn btn-info btn-add-favorite">+</button>
            </div>
          </div>
        </div>
      </div>`


  })
  dataPanel.innerHTML = rawHTML;
}

// Render Movie list
function renderMovieList(data) {
  let rawHTML = `<ul class="list-group list-group-flush">`
  data.forEach(item => {
    rawHTML += `<li class="list-group-item d-flex justify-content-between">${item.title}
          <div id="movie-buttons">
            <button type="button" class="btn btn-primary btn-show-movie" data-bs-toggle="modal" data-bs-target="#movie-model"
              data-id=${item.id}>More</button>
            <button type="button" data-id=${item.id} class="btn btn-info btn-add-favorite">+</button>
          </span>
        </li>`
  })
  rawHTML += `</ul>`
  dataPanel.innerHTML = rawHTML;
}

// Ｒender Paginator
function renderPaginator(amount) {
  const totalMoviePages = Math.ceil(amount / MOVIES_PER_PAGE)
  let rawHTML = ``

  for (let page = 1; page <= totalMoviePages; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page} data-view="card">${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
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

// 
function getMoviesByPage(page) {
  // 如果filterMovies有東西(長度不等於０)，data = filterMovies，否則為movies
  const data = filterMovies.length ? filterMovies : movies
  const startIndex = (page - 1) * MOVIES_PER_PAGE
  return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

// 加入最愛電影
function addToMovie(id) {
  const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
  const movie = movies.find(movie => movie.id === id)

  if (list.some(movie => movie.id === id)) {
    // 立即結束函式，並給使用者提示。
    return alert('此電影已經在電影清單中!')
  }

  list.push(movie)
  localStorage.setItem('favoriteMovies', JSON.stringify(list))
}

// 監聽器
searchForm.addEventListener('submit', function onSearchFormSubmited(event) {
  event.preventDefault()
  let keyword = searchInput.value.trim().toLowerCase()

  // map, filter, reduce
  filterMovies = movies.filter(movie => movie.title.toLowerCase().includes(keyword))

  if (filterMovies.length === 0) {
    return alert('Cannot find movie with keyword: ' + keyword)
  }

  renderPaginator(filterMovies.length)
  renderMovieCard(getMoviesByPage(1))
})

dataPanel.addEventListener('click', function onPanelClicked(event) {
  if (event.target.matches('.btn-show-movie')) {
    showMovieModel(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToMovie(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  page = Number(event.target.dataset.page)

  if (viewPoint === "card") {
    renderMovieCard(getMoviesByPage(page))
  } else if (viewPoint === "list") {
    renderMovieList(getMoviesByPage(page))
  }
})

viewIcon.addEventListener('click', function onIconClicked(event) {
  // 參考助教給 ＠石 參香 同學的建議：防止點擊相同icon有重複渲染問題。
  if (event.target.matches('.fa-th') && viewPoint != "card") {
    renderMovieCard(getMoviesByPage(page))
    viewPoint = "card"
  } else if (event.target.matches('.fa-bars') && viewPoint != "list") {
    renderMovieList(getMoviesByPage(page))
    viewPoint = "list"
  }
})

axios.get(INDEX_URL)
  .then(function (response) {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieCard(getMoviesByPage(1))
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })