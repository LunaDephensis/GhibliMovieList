import {nameShortering} from './util.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const filmId = urlParams.get('id');

let title = document.querySelector('.title');
let mainContent = document.querySelector('.mainContent');
let loaderBox = document.querySelector('.loaderBox');

loaderBox.classList.add('active');

fetch(`https://ghibliapi.herokuapp.com/films/${filmId}`).then((valasz) => {
    return valasz.json();
}).then((film) => {
    let director = nameShortering(film.director);
    title.innerHTML = film.title;
    let content = `<div class="posterBx">
    <img class="poster" src="${film.image}" alt="movie poster">
</div>
<div class="filmInfo">
    <h4 class="romaji">Romanised title: <span>${film.original_title_romanised}</span></h4>
    <div class="descriptionBox">
        <p class="description">${film.description}</p>
    </div>
    <ul class="filmDatas">
        <li class="director">Directed by <span>${director}</span></li>
        <li class="date">Date: <span>${film.release_date}</span></li>
        <li class="score">RT score: <span><span>${film.rt_score}</span>%</span></li>
        <li class="runningTime">Runtime: <span><span>${film.running_time}</span> min</span></li>
    </ul>
</div>`;
    mainContent.insertAdjacentHTML('beforeend', content);
    loaderBox.classList.remove('active');
}).catch((error) => {
    let errorMessage = document.querySelector('.errorMessage');
    errorMessage.classList.add('active');
    loaderBox.classList.remove('active');
});