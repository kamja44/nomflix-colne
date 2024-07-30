const API_KEY = "17cd240cd563008f446fafd5726a0ebb";
const BASE_PATH = "https://api.themoviedb.org/3";
interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}
interface IPopularAndTopRated {
  adult: string;
  backdrop_path: string;
  genre_ids: number[];
  id: number;
  original_title: string;
  overview: string;
  popularity: number;
  title: string;
  vote_average: number;
  vote_count: number;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_result: number;
}
export interface IGetPopularResult {
  results: IPopularAndTopRated[];
}
export interface IGetTopRated {
  results: IPopularAndTopRated[];
}
export interface IGetUpComing {
  dates: {
    maximum: string;
    minimum: string;
  };
  results: IPopularAndTopRated[];
}
export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getPopular() {
  return fetch(`${BASE_PATH}/movie/popular?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getTopRated() {
  return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export function getUpComing() {
  return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
