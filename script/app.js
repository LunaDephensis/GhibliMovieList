import {nameShortering} from './util.js';

let producerFilterBar = document.querySelector('.producerFilterBar ul');
let sortBox = document.querySelector('.sortBox ul');
let sortListElements = document.querySelectorAll('.sortBox ul li');
let filterToggle = document.querySelector('.filterToggle');
let sortToggle = document.querySelector('.sortToggle');
let boxOfFilms = document.querySelector('.films');
let filterBtn = document.querySelector('.filterBtn');
let search = document.querySelector('.searchInput');
let percentInput = document.querySelector('.percentInput');
let minInput = document.querySelector('.minInput');
let maxInput = document.querySelector('.maxInput');
let loaderBox = document.querySelector('.loaderBox');

let allFilms = [];
let filtereltFilmek = [];
let sortData = {};

loaderBox.classList.add('active');

fetch('https://ghibliapi.herokuapp.com/films').then((valasz) =>{
    return valasz.json();
}).then((filmek) => {
    allFilms = filmek;
    filtereltFilmek = [...allFilms];
    let directorList = [];
    filtereltFilmek.forEach((film) => {
        film.rt_score = parseInt(film.rt_score);
        film.release_date = parseInt(film.release_date);
        let director = nameShortering(film.director);
        createNewCard(film, director);
        if(!directorList.includes(director)) {
            directorList.push(director);
        }
    });
    directorList.forEach((director) => {
        let directorDropdownElement = `<li>${director}</li>`;
        producerFilterBar.insertAdjacentHTML('beforeend', directorDropdownElement);
    });
    let producerListElements = document.querySelectorAll('.producerFilterBar ul li');
    producerListElements.forEach((listElement) => {
        listElement.addEventListener('click', () => {
            chooseDropdownElement(filterToggle, listElement, producerFilterBar);
        });
    });
    loaderBox.classList.remove('active');
}).catch((error) => {
    let errorMessage = document.querySelector('.errorMessage');
    errorMessage.classList.add('active');
    loaderBox.classList.remove('active');
});

search.addEventListener('keyup', () => {
    if(search.value.length > 2) {
        filtereltFilmek = allFilms.filter((film) => {
            console.log(search.value);
            return film.title.toLowerCase().includes(search.value.toLowerCase()) || film.original_title_romanised.toLowerCase().includes(search.value.toLowerCase());
        });
        cardSort(sortData);
    }
    else {
        filtereltFilmek = allFilms;
        cardSort(sortData);
    }
});

percentInput.addEventListener('keydown', (e) => {
    console.log(e);
    preventMinus(e);
    if(!isNaN(e.key)) {
        let percentCalc = parseInt(percentInput.value + e.key);
        if(percentCalc > 100) {
            e.preventDefault();
        }
    }
});

minInput.addEventListener('keydown', (e) => {
    preventMinus(e);
    preventTooLongDate(minInput, e);
});

maxInput.addEventListener('keydown', (e) => {
    preventMinus(e);
    preventTooLongDate(maxInput, e);
});

filterBtn.addEventListener('click', () => {
    let percentValue = percentInput.value;
    let minDateValue = minInput.value;
    let maxDateValue = maxInput.value;
    let actualDirector = document.querySelector('.filterToggle span').innerHTML;
    console.log(percentValue, minDateValue, maxDateValue, actualDirector);
    filtereltFilmek = allFilms.filter((film) => {
        return directorFiltering(actualDirector, film) && percentFiltering(percentValue, film) && dateFiltering(minDateValue, maxDateValue, film);
    });
    cardSort(sortData);
    search.value = "";
});

sortListElements.forEach((li) => {
    li.addEventListener('click', (e) => {
       let sortDataArray =  e.target.dataset.sort.split('-');
       sortData.key = sortDataArray[0];
       sortData.direction = sortDataArray[1];
       cardSort(sortData);
    });
});

filterToggle.addEventListener('click', () => {
    dropdown(filterToggle, producerFilterBar);
});

sortToggle.addEventListener('click', () => {
    dropdown(sortToggle, sortBox);
});

sortListElements.forEach((listElement) => {
    listElement.addEventListener('click', () => {
        chooseDropdownElement(sortToggle, listElement, sortBox);
    });
});

function preventMinus(e) {
    if(e.keyCode === 189) {
        e.preventDefault();
    }
}

function preventTooLongDate(input, e) {
    if(input.value.length === 4 && e.keyCode !== 8 && e.keyCode !== 46) {
        e.preventDefault();
    }
}

function cardSort(sortData) {
    if(sortData.direction === "asc") {
        ascSort(sortData);
    }
    else {
        descSort(sortData);
    }
    refreshCards();
}

function ascSort(sortData) {
    filtereltFilmek.sort((a, b) => {
        if(a[sortData.key] < b[sortData.key]) {
            return -1;
        }
        if(a[sortData.key] > b[sortData.key]) {
            return 1;
        }
        return 0;
    });
}

function descSort(sortData) {
    filtereltFilmek.sort((a, b) => {
        if(a[sortData.key] < b[sortData.key]) {
            return 1;
        }
        if(a[sortData.key] > b[sortData.key]) {
            return -1;
        }
        return 0;
    });
}

function dropdown(toggle, menu) {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
}

function chooseDropdownElement(toggle, dropdownElement, menu) {
    toggle.querySelector('span').innerHTML = dropdownElement.innerHTML;
    toggle.classList.remove('active');
    menu.classList.remove('active');
}


function directorFiltering(actualDirector, film) {
    if(actualDirector !== "All Directors") {
        return nameShortering(film.director) == actualDirector;
    }
    return true;
}

function percentFiltering(percentValue, film) {
    if(percentValue !== "") {
        return film.rt_score >= parseInt(percentValue);
    }
    return true;
}

function dateFiltering(minDateValue, maxDateValue, film) {
    if(minDateValue !== "" && maxDateValue !== "") {
        return film.release_date >= parseInt(minDateValue) && film.release_date <= parseInt(maxDateValue);
    }
    else if(minDateValue !== "") {
        return film.release_date >= parseInt(minDateValue);
    }
    else if(maxDateValue !== "") {
        return film.release_date <= parseInt(maxDateValue);
    }
    return true;
}

function refreshCards() {
    boxOfFilms.innerHTML = '';
    filtereltFilmek.forEach((film) => {
        let director = nameShortering(film.director);
        createNewCard(film, director);
    });
}

function createNewCard(film, director) {
    let filmCard = `<div class="filmCard">
                <div class="cardHeader">
                    <h2>${film.title}</h2>
                    <h4>${film.original_title_romanised}</h4>
                </div>
                <div class="cardContent">
                    <div class="imgBx">
                        <img class="poster" src="${film.image}" alt="movie poster">
                    </div>
                    <ul class="textBx">
                        <li class="japan"><img src="images/japan.png" alt="japan"><span>${film.original_title}</span></li>
                        <li class="date">Release date: <span>${film.release_date}</span></li>
                        <li class="score">RT score: <span><span>${film.rt_score}</span>%</span></li>
                        <li class="director">Director: <span>${director}</span></li>
                        <li class="learnMore"><a href="film.html?id=${film.id}">Learn More <ion-icon name="chevron-forward-outline"></ion-icon></a></li>
                    </ul>
                </div>
            </div>`;
        boxOfFilms.insertAdjacentHTML('beforeend', filmCard);
}