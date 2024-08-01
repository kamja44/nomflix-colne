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
interface IDetailGenres {
  id: number;
  name: string;
}
export interface IDetailMovie {
  adult: boolean;
  genres: IDetailGenres[];
  homepage: string;
  overview: string;
  popularity: number;
  runtime: number;
  vote_average: number;
}
export function getDetailMovie(movieId: number) {
  return fetch(`${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}

// TV
interface ITv {
  backdrop_path: string;
  first_air_date: string;
  poster_path: string;
  id: number;
  name: string;
  overview: string;
  origin_country: string[];
}
export interface IGetTv {
  results: ITv[];
}
export function getTvs() {
  return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export interface IGetOnAir {
  results: ITv[];
}
export function getOnAir() {
  return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
export interface IGetPopularTv {
  results: ITv[];
}
export function getPopularTv() {
  return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) =>
    response.json()
  );
}
export interface IGetTopTv {
  results: ITv[];
}
export function getTopTv() {
  return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
interface IDetailCreated_by {
  name: string;
}
interface IDetailGetres {
  id: number;
  name: string;
}
export interface IGetTvDetail {
  adult: string;
  backdrop_path: string;
  created_by: IDetailCreated_by[];
  episode_run_time: number[];
  genres: IDetailGetres[];
  overview: string;
  vote_average: number;
  homepage: string;
}
export function getTvDetail(series_id: number) {
  return fetch(`${BASE_PATH}/tv/${series_id}?api_key=${API_KEY}`).then(
    (response) => response.json()
  );
}
interface ISearch {
  backdrop_path: string;
  name: string;
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  media_type: string;
  release_date: string;
  vote_average: number;
}
export interface IMultiSearch {
  results: ISearch[];
}
export function getMultiSearch(keyword: string) {
  return fetch(
    `${BASE_PATH}/search/multi?api_key=${API_KEY}&query=${keyword}`
  ).then((response) => response.json());
}
