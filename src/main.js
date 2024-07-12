// Data
const api =  axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=uft-8',
        'Authorization':API_KEY,
    },
    params:{
        "language": navigator.language || "es-ES"
    }
});
function likedMoviesList(){
    const item = JSON.parse(localStorage.getItem('liked_movies'));
    let movies;
    if (item){
        movies = item;
    }else {
        movies = {};
    }
    return movies;
}

function likeMovie(movie){
    const likedMovies =  likedMoviesList();
    console.log(likedMoviesList())

    if(likedMovies[movie.id]){
        likedMovies[movie.id] = undefined;
    }else{
        likedMovies[movie.id] = movie;
    }
    ChangeLocalStorage('liked_movies',JSON.stringify(likedMovies))
}

// Utils
function ChangeLocalStorage(key, value){
    localStorage.setItem(key,value);
    const event = new CustomEvent('localStoregeChange',{
        detail: { key: key, value: value } 
    });
    window.dispatchEvent(event)
}

const lazyLoader = new IntersectionObserver((entries)=>{
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            const url = entry.target.getAttribute('data-image')
            entry.target.setAttribute('src',url);
        }
    });
})

const BottomScroll = new IntersectionObserver((entries, observer)=>{ 
    entries.forEach((entry)=>{
        if(entry.isIntersecting){
            currentPage++
            wrapperFunc(currentEndPoint, currentPage,categoryId, searchQuery)
        }
    })
})

function lastTargetElement(){
    let movieInScreen = document.querySelectorAll('.movie-container .movie-img');
    let lastMovie = movieInScreen[movieInScreen.length-1];
    return lastMovie
}

// const variableParameters = {
//     currentEndPoint,
//     currentPage : 0,
//     categoryId : false,
//     searchQuery : false
// }

let currentEndPoint;
let currentPage = 0;
let categoryId = false;
let searchQuery = false;

const  wrapperFunc = (endPoint,Page, category, query)=> {
    return infiniteScroll(endPoint,Page,category,query);
};

function createMovies(movies, container, {lazyLoad = false, clean = true, isInfiniteScroll = false} = {}){
    if(clean){
        container.innerHTML='';
    }

    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute(lazyLoad ? 'data-image' : 'src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

        movieImg.addEventListener('error',()=>{
            movieImg.setAttribute('src','https://i.postimg.cc/63YRkkVm/photo.png')
        });
        movieImg.addEventListener('click',()=>{
            location.hash= '#movie=' + movie.id
        })
        const movieBtnFav =  document.createElement('button');
        movieBtnFav.classList.add('movie-btn');

        likedMoviesList()[movie.id] && movieBtnFav.classList.add('movie-btn--liked');
        
        movieBtnFav.addEventListener('click',()=>{
            movieBtnFav.classList.toggle('movie-btn--liked');   
            likeMovie(movie);
            getLikedMovies();
        });

        window.addEventListener('localStoregeChange',()=>{
            likedMoviesList()[movie.id] || movieBtnFav.classList.remove('movie-btn--liked');          
        })

        if(lazyLoad){
            lazyLoader.observe(movieImg);
        };

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(movieBtnFav);
        container.appendChild(movieContainer);

    });

    if(isInfiniteScroll){
        BottomScroll.observe(lastTargetElement());
    }
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

    createMovies(movies, trendingMoviesPreviewList);
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

    createMovies(movies,genericSection, {lazyLoad:true, isInfiniteScroll:true});
    currentPage = 1;
    categoryId = id;
}

async function getMoviesBySearch(query){
    const {data,} = await api.get('search/movie',{
        params:{
            query,
        }
    });
    const movies = data.results;

    createMovies(movies,genericSection,{lazyLoad: true,isInfiniteScroll:true});
    searchQuery = query;
    currentPage = 1;
}

async function getTrendingMovies(){
    const{data} = await api('trending/movie/day');
    const movies = data.results;

    createMovies(movies, genericSection ,{lazyLoad:true, isInfiniteScroll:true});
    currentEndPoint = 'trending/movie/day';
    currentPage = 1;
}

async function infiniteScroll(endPoint, page,categoryId = false, query){
    let  currentData;
    if(query){
        const {data} = await api.get('search/movie',{
            params:{
                page,
                query
            }
        });
        currentData = data
    }
    else if(categoryId){
        const {data} = await api.get('discover/movie',{
            params:{
                page,
                with_genres:categoryId
            }
        })
        currentData = data
    }else{
        const{data} = await api(endPoint, {
            params:{page}
        });
        currentData = data
    }
    const movies = currentData.results
    const maxPage = currentData.page <= currentData.total_pages 

    BottomScroll.observe(lastTargetElement());
    BottomScroll.unobserve(lastTargetElement());
    
    if(maxPage){
        createMovies(movies, genericSection ,{lazyLoad:true, clean:false,isInfiniteScroll:true});
    }else{
        const containerText = document.createElement('div')
        const textEndScroll = document.createTextNode('No hay mas peliculas');
        containerText.classList.add('message');
        containerText.appendChild(textEndScroll)
        genericSection.appendChild(containerText);
    }
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

    createMovies(relatedMovies,relatedMoviesContainer)
}

function getLikedMovies(){
    const likedMovies = likedMoviesList();
    const arrLikedMovies = Object.values(likedMovies);
    createMovies(arrLikedMovies, likedMoviesListContainer,{lazyLoad: true, clean:true})
}

// poster
function posterResponsive(movie, img){
    const viwportWidth =    window.innerWidth;
    let src;

    if(viwportWidth >= 600){
       src = `https://image.tmdb.org/t/p/original/${movie.backdrop_path}`;
    }else if(viwportWidth >= 300 && viwportWidth < 600){
        src = `https://image.tmdb.org/t/p/w500/${movie.backdrop_path}`;
    }else{
        src = `https://image.tmdb.org/t/p/w300/${movie.backdrop_path}`;
    }
    
    img.src = src;
}
function renderPoster(movie){
    const posterTitle = document.querySelector('.poster-title');
    const posterAverage = document.querySelector('.poster-average');
    const posterImg = document.querySelector('.poster-img');
    const posterBtnDetails = document.querySelector('.poster-btn--details');
    const posterBtnTrailer = document.querySelector('.poster-btn--trailer');


    posterTitle.innerText = movie.title;
    posterAverage.innerText = `⭐ ${movie.vote_average.toFixed(2)}`;

    posterResponsive(movie, posterImg);


    window.onresize = ()=>{
        posterResponsive(movie, posterImg);
    }
 
    posterBtnDetails.addEventListener('click',()=>{
        location.hash = ''
        location.hash = '#movie=' + movie.id
    })
}
async function getPosterMovies(){
    const {data} = await api('trending/movie/day');
    const movies = data.results.slice(0,5);
    

    console.log(data)
    let indexPoster = 0;
    let currentPoster = movies[0];

    const buttonsNextPrev = document.querySelectorAll('.header-poster-btn');
    const arrayBtns = Array.from(buttonsNextPrev);
    

    arrayBtns.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            if(btn.classList.contains('poster-btn--preview') && indexPoster > 0){
                indexPoster--
                currentPoster = movies[indexPoster]
                renderPoster(currentPoster)
            }
             if(btn.classList.contains('poster-btn--next') && indexPoster <= 3){
                indexPoster++
                currentPoster = movies[indexPoster]
                renderPoster(currentPoster)
            }
        })
    })
    headerPosterLoading.classList.add('inactive')
    renderPoster(currentPoster)
}