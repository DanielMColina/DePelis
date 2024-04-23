window.addEventListener('load',navigator,false);
window.addEventListener('hashchange',navigator,false);


function navigator(){
    // console.log({location})
    // if(location.hash.startsWith('#trends')){
    //     console.log('trends');
    // }else if(location.hash.startsWith('#search=')){
    //     console.log('search')
    // }else if(location.hash.startsWith('#movie=')){
    //     console.log('movie');
    // }else if(location.hash.startsWith('#movie=')){
    //     console.log('movie');
    // } else{
    //     console.log("home")
    // }

// una manera mas limpia de hacer lo de arriba

    const hash = {       
        '#trends': ()=>trendPage(),
        '#search': ()=>searchPage(),
        '#movie': ()=>moviePage(),
        '#category': ()=>categoryPage(),
        '#home': ()=>homePage()
    }
    if(location){
        hash[location.hash](); 
    }else{
        homePage();
    }
}

function homePage() {
    console.log("estas en la seccion home");    
    getCategoriesPreview()
    getTrendingMoviesPreview()
}
function categoryPage(){
    console.log('estas en la seccion categorie');
}
function moviePage() {
    console.log('estas en la seccion movie');
}
function searchPage() {
    console.log('estas en la seccion search');
}
function trendPage() {
    console.log('estas en la seccion trends');
}