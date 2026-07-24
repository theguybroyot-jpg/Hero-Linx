const params = new URLSearchParams(window.location.search);

const type = params.get("type") || "movie";
const id = params.get("id");


let currentData;


/* Load page */

async function loadPage(){

if(!id){
    document.getElementById("title").textContent="Missing ID";
    return;
}


let data;

if(type==="tv"){
    data = await tvDetails(id);
}else{
    data = await movieDetails(id);
}


currentData=data;


displayInfo(data);

await loadTrailer();

await loadCast();

await loadRecommendations();


if(type==="tv"){
    setupSeasons(data);
}

}



/* Details */

function displayInfo(data){


const title =
data.title || data.name;


document.title =
`${title} - Graves Movies`;


document.getElementById("title").textContent=title;


document.getElementById("overview").textContent =
data.overview || "No description available.";


document.getElementById("poster").src =
POSTER + data.poster_path;


const date =
data.release_date ||
data.first_air_date ||
"";


const rating =
data.vote_average ?
data.vote_average.toFixed(1)
:
"N/A";


document.getElementById("meta").textContent =
`⭐ ${rating} | ${date.substring(0,4)}`;


}



/* Trailer */

async function loadTrailer(){


const videoData =
await videos(type,id);


const trailer =
officialTrailer(videoData);



const player =
document.getElementById("player");


if(trailer){


player.src =
`https://www.vidsrc.mov/embed/movie/${trailer.key}`;


}else{


player.src =
"";


player.parentElement.innerHTML =
`
<div style="
height:100%;
display:flex;
align-items:center;
justify-content:center;
color:#aaa;
font-size:20px;">
No official trailer available
</div>
`;

}


}



/* Cast */

async function loadCast(){


let data;


if(type==="tv"){
data = await tvCredits(id);
}
else{
data = await movieCredits(id);
}



const container =
document.getElementById("cast");


container.innerHTML="";


data.cast
.slice(0,12)
.forEach(person=>{


container.innerHTML += `

<div class="castCard">

<img src="${
person.profile_path ?
POSTER+person.profile_path :
"https://via.placeholder.com/200x300"
}">

<p>${person.name}</p>

</div>

`;


});


}



/* Recommendations */

async function loadRecommendations(){


let data;


if(type==="tv"){
data =
await tvRecommendations(id);
}
else{
data =
await movieRecommendations(id);
}



const container =
document.getElementById("recommendations");


container.innerHTML="";



data.results
.slice(0,12)
.forEach(item=>{


const itemType =
item.title ? "movie":"tv";


container.innerHTML +=`

<div class="recCard">

<a href="watch.html?type=${itemType}&id=${item.id}">


<img src="${
item.poster_path ?
POSTER+item.poster_path :
"https://via.placeholder.com/200x300"
}">


<p>
${item.title || item.name}
</p>


</a>

</div>

`;

});


}



/* TV Seasons */

function setupSeasons(show){


const box =
document.getElementById("selectors");


const seasonSelect =
document.getElementById("seasonSelect");


box.style.display="flex";


seasonSelect.innerHTML="";


show.seasons
.filter(s=>s.season_number!==0)
.forEach(season=>{


seasonSelect.innerHTML +=`

<option value="${season.season_number}">
Season ${season.season_number}
</option>

`;

});


seasonSelect.addEventListener(
"change",
()=>loadEpisodes(seasonSelect.value)
);


loadEpisodes(show.seasons[1]?.season_number || 1);


}




async function loadEpisodes(season){


const data =
await seasonEpisodes(id,season);



const episodeSelect =
document.getElementById("episodeSelect");


episodeSelect.innerHTML="";



data.episodes.forEach(ep=>{


episodeSelect.innerHTML +=`

<option value="${ep.episode_number}">
Episode ${ep.episode_number} - ${ep.name}
</option>

`;

});


episodeSelect.addEventListener(
"change",
()=>{

const ep =
data.episodes.find(
x=>x.episode_number ==
episodeSelect.value
);


if(ep){

document.getElementById("overview")
.textContent =
ep.overview ||
"No episode description.";

}

});


}



loadPage();
