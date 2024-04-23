const api =  axios.create({
    baseURL:'https://api.themoviedb.org/3/',
    headers:{
        'Content-Type':'application/json;charset=uft-8',
        'Authorization':API_KEY,
    },
});
async function getTrendingMoviesPreview(){
    const {data,status} = await api.get('trending/movie/day?language=en-US')

    console.log(data)
    const movies = data.results;

    movies.forEach(movie => {
        const trendingPreviewMoviesContainer= document.querySelector('#trendingPreview .trendingPreview-movieList');
        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.setAttribute('alt', movie.title);
        movieImg.setAttribute('src', 'https://image.tmdb.org/t/p/w300/'+movie.poster_path);

        movieContainer.appendChild(movieImg);
        trendingPreviewMoviesContainer.appendChild(movieContainer);
})};

async function getCategoriesPreview(){
    const {data,status} = await api.get('genre/movie/list?language=es');
    const categories = data.genres;
    
    categories.forEach(category => {
        const categoryPreviewMoviesContainer= document.querySelector('#categoriesPreview .categoriesPreview-list');
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.setAttribute('id','id' + category.id);
        const categoryTitleText = document.createTextNode(category.name);

        // const titleName = category.name

        // console.log(category)
        categoryTitle.appendChild(categoryTitleText);
        categoryContainer.appendChild(categoryTitle);
        categoryPreviewMoviesContainer.appendChild(categoryContainer);
}) 
}



getCategoriesPreview()
getTrendingMoviesPreview()

