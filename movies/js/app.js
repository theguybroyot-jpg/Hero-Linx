const rows = {
    trendingMovies: "trending/movie/week",
    trendingTV: "trending/tv/week",
    popularMovies: "movie/popular",
    popularTV: "tv/popular"
};


/* Create Movie Card */

function createCard(item){

    const title = item.title || item.name;

    const type = item.title ? "movie" : "tv";


    return `

    <div class="card">

        <a href="watch.html?type=${type}&id=${item.id}">

            <img 
            loading="lazy"
            src="${
            item.poster_path
            ? POSTER + item.poster_path
            : "https://via.placeholder.com/500x750"
            }">

        </a>

        <h3>${title}</h3>

    </div>

    `;
}



/* Load Rows */

async function loadRow(endpoint, element){

    try{

        const data =
        await tmdb("/"+endpoint);


        const container =
        document.getElementById(element);


        container.innerHTML="";


        data.results
        .slice(0,20)
        .forEach(item=>{

            container.innerHTML +=
            createCard(item);

        });


    }

    catch(error){

        console.log(error);

    }

}



/* Hero Banner */

async function loadHero(){

    try{

        const data =
        await tmdb("/trending/all/week");


        const item =
        data.results[0];


        const title =
        item.title || item.name;


        document.getElementById("heroTitle")
        .textContent = title;


        document.getElementById("heroDescription")
        .textContent =
        item.overview ||
        "No description available.";



        document.getElementById("hero")
        .style.backgroundImage =
        `
        linear-gradient(
        rgba(0,0,0,.5),
        #0b0b0b
        ),
        url(
        ${BACKDROP}${item.backdrop_path}
        )
        `;



        document.getElementById("heroWatch")
        .onclick = ()=>{


            const type =
            item.title ? "movie":"tv";


            location.href =
            `watch.html?type=${type}&id=${item.id}`;


        };


    }

    catch(error){

        console.log(error);

    }

}



/* Search */

const searchInput =
document.getElementById("search");


searchInput.addEventListener(
"input",
async ()=>{


const query =
searchInput.value.trim();


const section =
document.getElementById(
"searchResultsSection"
);


const container =
document.getElementById(
"searchResults"
);



if(query.length < 2){

section.style.display="none";

return;

}



const data =
await search(query);



container.innerHTML="";


data.results
.filter(
x=>x.media_type==="movie"
||
x.media_type==="tv"
)
.slice(0,20)
.forEach(item=>{


container.innerHTML +=
createCard(item);


});


section.style.display="block";


});



/* Start Homepage */

async function start(){

    loadHero();


    for(const row in rows){

        loadRow(
            rows[row],
            row
        );

    }

}


start();
