const API_KEY = "bb33aa47807eec85db1687412383c855";

const TMDB = "https://api.themoviedb.org/3";
const IMAGE = "https://image.tmdb.org/t/p";
const POSTER = `${IMAGE}/w500`;
const BACKDROP = `${IMAGE}/original`;

async function tmdb(endpoint) {
    const response = await fetch(
        `${TMDB}${endpoint}${endpoint.includes("?") ? "&" : "?"}api_key=${API_KEY}`
    );

    if (!response.ok) {
        throw new Error("TMDb request failed");
    }

    return await response.json();
}

async function trendingMovies() {
    return await tmdb("/trending/movie/week");
}

async function trendingTV() {
    return await tmdb("/trending/tv/week");
}

async function popularMovies() {
    return await tmdb("/movie/popular");
}

async function popularTV() {
    return await tmdb("/tv/popular");
}

async function search(query) {
    return await tmdb(
        `/search/multi?query=${encodeURIComponent(query)}`
    );
}

async function movieDetails(id) {
    return await tmdb(`/movie/${id}`);
}

async function tvDetails(id) {
    return await tmdb(`/tv/${id}`);
}

async function movieCredits(id) {
    return await tmdb(`/movie/${id}/credits`);
}

async function tvCredits(id) {
    return await tmdb(`/tv/${id}/credits`);
}

async function movieRecommendations(id) {
    return await tmdb(`/movie/${id}/recommendations`);
}

async function tvRecommendations(id) {
    return await tmdb(`/tv/${id}/recommendations`);
}

async function seasons(id) {
    return await tmdb(`/tv/${id}`);
}

async function seasonEpisodes(id, season) {
    return await tmdb(`/tv/${id}/season/${season}`);
}

/*
 * Returns official trailer information from TMDb.
 * Many trailers are hosted on YouTube.
 */
async function videos(type, id) {
    return await tmdb(`/${type}/${id}/videos`);
}

function officialTrailer(videosData) {

    if (!videosData.results) return null;

    const trailer =
        videosData.results.find(v =>
            v.site === "YouTube" &&
            v.type === "Trailer" &&
            v.official
        ) ||
        videosData.results.find(v =>
            v.site === "YouTube" &&
            v.type === "Trailer"
        );

    return trailer || null;
}
