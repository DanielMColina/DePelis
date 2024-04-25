const api =  axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=uft-8',
        'Authorization':API_KEY,
    },
});
async function getTrendingMoviesPreview(){
    const {data,status} = await api.get('trending/movie/day')

    // console.log(data)
    const movies = data.results;

    trendingMoviesPreviewList.innerHTML="";

    movies.forEach(movie => {
        // const trendingMoviesPreviewList= document.querySelector('#trendingPreview .trendingPreview-movieList');
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingMoviesPreviewList.appendChild(movieContainer);
})};

async function getCategoriesPreview(){
    const {data,status} = await api.get('genre/movie/list');
    const categories = data.genres;
    
    categoriesPreviewList.innerHTML ="";

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
        categoriesPreviewList.appendChild(categoryContainer);
}) 
}

async function getMoviesByCategory(id){
    const {data,} = await api.get('discover/movie',{
        params:{
            with_genres:id
        }
    })
    const movies = data.results;

    genericSection.innerHTML="";

    movies.forEach(movie => {
        // const trendingMoviesPreviewList= document.querySelector('#trendingPreview .trendingPreview-movieList');
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

        movieContainer.appendChild(movieImg);
        genericSection.appendChild(movieContainer);
})
}


