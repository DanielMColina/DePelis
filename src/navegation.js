searchFormBtn.addEventListener('click',(event)=> {
    event.preventDefault()
     location.hash =  '#search='+ searchFormInput.value;
});

trendingBtn.addEventListener('click',()=> {
    location.hash =  '#trends='
    trendPage()
});

arrowBtn.addEventListener('click',(event)=>{
    // event.preventDefault()

    const previousPageUrl = document.referrer;
    const currentDomain = window.location.host;

    if (previousPageUrl.includes(currentDomain)) {
       history.back();
    } else {
        window.location.href = 'https://' + currentDomain;
    }
});


window.addEventListener('DOMContentLoaded',navigator,false);
window.addEventListener('hashchange',navigator,false);


function navigator(){
    // console.log({location})
    if(location.hash.startsWith('#trends=')){
        trendPage();
    }else if(location.hash.startsWith('#search=')){
        searchPage();
    }else if(location.hash.startsWith('#movie=')){
        movieDetailsPage();
    }else if(location.hash.startsWith('#category=')){
        categoryPage();
    } else{
        homePage();
    }
    window.scrollTo(0, 0);
}

function homePage() {
    headerSection.classList.remove('header-container--long');
    headerSection.style.background= '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');


    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    getCategoriesPreview()
    getTrendingMoviesPreview()
}
function categoryPage(){
    headerSection.classList.remove('header-contianer--long');
    headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_,categoryData] =  location.hash.split('=');
    const [categoryId,name] = categoryData.split('-')
    const categoryName = name.replace('%20',' ')

    
    headerCategoryTitle.innerText = categoryName
    getMoviesByCategory(categoryId);

}
function movieDetailsPage() {
    headerSection.classList.add('header-container--long');
    // headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

// ['#movie', '215515']
    const [_, movieId] = location.hash.split('=');

    getMovieById(movieId)
}
function searchPage() {
    headerSection.classList.remove('header-contianer--long');
    // headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');


    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    
    const [_,query] =  location.hash.split('=');
    getMoviesBySearch(query);
}
function trendPage() {
    headerSection.classList.remove('header-contianer--long');
    headerSection.style.background= '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');


    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.innerText = 'Trends'

    getTrendingMovies()
}
