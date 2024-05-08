const api =  axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=uft-8',
        'Authorization':API_KEY,
    },
});
// Utils
const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-image')
            entry.target.setAttribute('src',url);
        }
    });
})

function createMovies(movies, container, lazyLoad = false){
    container.innerHTML='';

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click',()=>{
            location.hash= '#movie=' + movie.id
        })

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(lazyLoad ? 'data-image' : 'src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute('src','https://i.postimg.cc/63YRkkVm/photo.png')
        })

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        container.appendChild(movieContainer);
})
}
function createCategories(categories, container){
    container.innerHTML ="";

    categories.forEach(category => {
        // const categoriesPreviewList= document.querySelector('#categoriesPreview .categoriesPreview-list');
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id','id' + category.id);
        categoryTitle.addEventListener('click',()=> location.hash = `#category=${category.id}-${category.name}`)
        const categoryTitleText = document.createTextNode(category.name);

        // const titleName = category.name

        // console.log(category)
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        container.appendChild(categoryContainer);
    })
}

// llamdos a la api 

async function getTrendingMoviesPreview(){
    const {data} = await api.get('trending/movie/day')

    // console.log(data)
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList, true);
};

async function getCategoriesPreview(){
    const {data,} = await api.get('genre/movie/list');
    const categories = data.genres;
    
    createCategories(categories,categoriesPreviewList);
}

async function getMoviesByCategory(id){
    const {data,} = await api.get('discover/movie',{
        params:{
            with_genres:id
        }
    })
    const movies = data.results;

    createMovies(movies,genericSection, true);
}

async function getMoviesBySearch(query){
    const {data,} = await api.get('search/movie',{
        params:{
            query,
        }
    })
    const movies = data.results;

    createMovies(movies,genericSection);
}

async function getTrendingMovies(){
    const{data} = await api('trending/movie/day',);
    const movies = data.results;

    createMovies(movies, genericSection)
}

async function getMovieById(id){
    const{data:movie} = await api('/movie/'+ id);

    const movieImgUrl = 'https://image.tmdb.org/t/p/w500'+ movie.poster_path;
    
    headerSection.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`

    movieDetailTitle.textContent = movie.title ;
    movieDetailDescription.textContent = movie.overview;
    movieDetailScore.textContent = movie.vote_average.toFixed(1);
    createCategories(movie.genres, movieDetailCategoriesList);

    getRelatedMoviesId(id)
}

async function getRelatedMoviesId(id){
    const {data} = await api(`movie/${id}/recommendations`);
    const relatedMovies = data.results;

    createMovies(relatedMovies,relatedMoviesContainer )
}

