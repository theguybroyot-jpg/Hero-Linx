const movieGrid = document.getElementById("movieGrid");
const hero = document.getElementById("hero");
const heroTitle = document.getElementById("heroTitle");
const heroOverview = document.getElementById("heroOverview");
const heroButton = document.getElementById("heroButton");
const search = document.getElementById("search");

let allItems = [];
let currentFilter = "all";

async function getTMDB(imdb, type){

    const find = await fetch(
        `https://api.themoviedb.org/3/find/${imdb}?api_key=${TMDB_API_KEY}&external_source=imdb_id`
    );

    const result = await find.json();

    if(type==="movie"){
        return result.movie_results[0];
    }else{
        return result.tv_results[0];
    }

}

async function buildLibrary(){

    movieGrid.innerHTML="<h2>Loading...</h2>";

    allItems=[];

    for(const item of library){

        const data=await getTMDB(item.imdb,item.type);

        if(!data) continue;

        allItems.push({
            imdb:item.imdb,
            type:item.type,
            data:data
        });

    }

    if(allItems.length>0){
        buildHero(allItems[0]);
    }

    draw(allItems);

}

function buildHero(item){

    const backdrop =
    "https://image.tmdb.org/t/p/original"+item.data.backdrop_path;

    hero.style.backgroundImage=
    `linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,.92)),url(${backdrop})`;

    heroTitle.textContent=
    item.data.title || item.data.name;

    heroOverview.textContent=
    item.data.overview;

    if(item.type==="movie"){

        heroButton.href=
        `movie.html?id=${item.imdb}`;

    }else{

        heroButton.href=
        `show.html?id=${item.imdb}`;

    }

}

function draw(list){

    movieGrid.innerHTML="";

    list.forEach(item=>{

        const title =
        item.data.title || item.data.name;

        const poster =
        "https://image.tmdb.org/t/p/w500"+item.data.poster_path;

        const year =
        (item.data.release_date || item.data.first_air_date || "").substring(0,4);

        const rating =
        item.data.vote_average.toFixed(1);

        const card=document.createElement("a");

        card.className="card";

        card.href=
        item.type==="movie"
        ?`movie.html?id=${item.imdb}`
        :`show.html?id=${item.imdb}`;

        card.innerHTML=`

        <div class="poster">

        <img src="${poster}">

        </div>

        <div class="info">

        <h2>${title}</h2>

        <p>${year}</p>

        <p>⭐ ${rating}</p>

        </div>

        `;

        movieGrid.appendChild(card);

    });

}

search.addEventListener("input",()=>{

    let text=search.value.toLowerCase();

    let filtered=
    allItems.filter(item=>{

        let title=
        (item.data.title || item.data.name).toLowerCase();

        let pass=true;

        if(currentFilter==="movie")
            pass=item.type==="movie";

        if(currentFilter==="tv")
            pass=item.type==="tv";

        return pass && title.includes(text);

    });

    draw(filtered);

});

document.querySelectorAll(".filter").forEach(button=>{

    button.onclick=(e)=>{

        e.preventDefault();

        document.querySelectorAll(".filter")
        .forEach(x=>x.classList.remove("active"));

        button.classList.add("active");

        currentFilter=button.dataset.filter;

        let filtered=allItems;

        if(currentFilter==="movie")
            filtered=allItems.filter(x=>x.type==="movie");

        if(currentFilter==="tv")
            filtered=allItems.filter(x=>x.type==="tv");

        if(currentFilter==="anime"){
            filtered=allItems.filter(x=>
                (x.data.original_language==="ja")
            );
        }

        draw(filtered);

    };

});

buildLibrary();
