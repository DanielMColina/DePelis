const api =  axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=uft-8',
        'Authorization':API_KEY,
    },
});
// Utils
function createMovies(movies, container){
    container.innerHTML='';
    
    movies.forEach(movie => {
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

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
    const {data,status} = await api.get('trending/movie/day')

    // console.log(data)
    const movies = data.results;

    createMovies(movies, trendingMoviesPreviewList);
};

async function getCategoriesPreview(){
    const {data,} = await api.get('genre/movie/list');
    const categories = data.genres;
    
    createCategories(categories,categoriesPreviewList );
}

async function getMoviesByCategory(id){
    const {data,} = await api.get('discover/movie',{
        params:{
            with_genres:id
        }
    })
    const movies = data.results;

    createMovies(movies,genericSection);
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