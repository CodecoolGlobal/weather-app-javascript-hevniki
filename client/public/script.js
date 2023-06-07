import {cities} from '/data.js';

// search for cities.name
const rootElement = document.querySelector('#root');

function createInputField(){
  // we need a label with 'for = input#id
  /*const labelElement = document.createElement('label');
  labelElement.innerText = 'Choose a city from this list, or start typing';
  labelElement.id = 'id_label';
  labelElement.for = 'id_input_elem';*/
  // we need an input with list = datalist#id

  const inputElement = document.createElement('input');
  inputElement.id = 'id_input_elem';
  inputElement.placeholder = 'type the name of a city here';
  inputElement.setAttribute('list', 'id_list_elem_cities');
  // we need a datalist
  const datalistElement = document.createElement('datalist');
  datalistElement.id = 'id_list_elem_cities';


  // we need eventlistener on the input element, and remove/add the list association to the datalist
 /* inputElement.addEventListener('input', (event)=>{
    if (event.target.value.length < 3){
      inputElement.removeAttribute('list');
    }     else {
      inputElement.setAttribute('list', 'id_list_elem_cities');
    }
  });*/
  // insterting everything to DOM
  rootElement.insertAdjacentElement('afterbegin', datalistElement);
  rootElement.insertAdjacentElement('afterbegin', inputElement);
  //rootElement.insertAdjacentElement('afterbegin', labelElement);
  // we need option elements inside the datalist
  getTheOptionElements(cities);
  // we need another eventlistener to pass data to fetchCity
  inputElement.addEventListener('change', (event)=>{
    Promise.all([fetchCityFromWeatherAPI(event.target.value), fetchCityFromPexelAPI(event.target.value)]).then((values)=>{
      listDetailsOnPage(values[0], values[1]);
    });

  });

}

function getTheOptionElements(cities){
  cities.forEach((city)=>{
    const cityElement = document.createElement('option');
    cityElement.value = city;
    document.querySelector('#id_list_elem_cities').insertAdjacentElement('beforeend', cityElement);
  });
}



async function fetchCityFromWeatherAPI(city){
  const API_key = 'ccb1f1cc7e374df1a79110319230506';
  const url = `http://api.weatherapi.com/v1/current.json?key=${API_key}&q=${city}`;
  const response = await fetch(url);
  const data = await response.json();
 return data;
}

async function fetchCityFromPexelAPI(city){
  const authCode = 'TEnfzxZRGGcibcfGYUmC6kAr9gt35MZ0pq2ZqsQE3wkXy6Qajcb21RQd';
  const url = `https://api.pexels.com/v1/search?query=${city}`;
  const response = await fetch(url, {headers:{'Authorization':authCode}});
  const data = await response.json();
  return data;
}

function applyWeatherEffects(data) {
  const bodyElement = document.querySelector('body');
  const weatherDiv = document.querySelector('.weather-widget');

  if (weatherDiv.classList.contains('hotDay')) {
    const videoElement = document.createElement('video');
    videoElement.src = './public/hotday.mp4';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add('fullscreen-video');

    bodyElement.appendChild(videoElement);
  } else if (weatherDiv.classList.contains('coldDay')){
    const videoElement = document.createElement('video');
    videoElement.src = './public/coldday.mp4';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add('fullscreen-video');

    bodyElement.appendChild(videoElement);
} else if (weatherDiv.classList.contains('hotNight')){
  const videoElement = document.createElement('video');
  videoElement.src = './public/hotnight.mp4';
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.classList.add('fullscreen-video');

  bodyElement.appendChild(videoElement);
} else if (weatherDiv.classList.contains('coldNight')){
  const videoElement = document.createElement('video');
  videoElement.src = './public/coldnight.mp4';
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.classList.add('fullscreen-video');

  bodyElement.appendChild(videoElement);
}
}


function listDetailsOnPage(weatherData, pexelData) {
  if (document.querySelector('#id_weather_div')) {
    const weatherDiv = document.querySelector('#id_weather_div');
    while (weatherDiv.firstChild) {
      weatherDiv.removeChild(weatherDiv.firstChild);
    }
    weatherDiv.remove();
  }
  const contElem = document.createElement('div');
  contElem.id = 'id_weather_div';
  const conditionElem = document.createElement('p');
  conditionElem.innerText = weatherData.current.condition['text'];
  const headElem = document.createElement('h1');
  headElem.innerText = `${weatherData.location.name}`;
  const condImgElem = document.createElement('img');
  condImgElem.src = weatherData.current.condition.icon;
  const currentTemp = document.createElement('p');
  currentTemp.innerText = `${weatherData.current.temp_c} °C`;
  const dayTime = document.createElement('p');

  if(weatherData.current.is_day !== 1){
    dayTime.innerText = `Night`
  }
  else{
    dayTime.innerText = `Day`
  }

  contElem.insertAdjacentElement('beforeend', headElem);
  contElem.insertAdjacentElement('beforeend', conditionElem);
  contElem.insertAdjacentElement('beforeend', condImgElem);
  contElem.insertAdjacentElement('beforeend', currentTemp);
  contElem.insertAdjacentElement('beforeend', dayTime);
  rootElement.insertAdjacentElement('beforeend', contElem);
  contElem.classList.add('weather-widget');

  if (weatherData.current.temp_c > 20 && weatherData.current.is_day !== 0) {
    contElem.classList.add('hotDay');
  } else if (weatherData.current.temp_c > 20 && weatherData.current.is_day === 0) {
    contElem.classList.add('hotNight');
  }else if (weatherData.current.temp_c < 20 && weatherData.current.is_day !== 1) {
    contElem.classList.add('coldDay');
  }else if (weatherData.current.temp_c < 20 && weatherData.current.is_day === 1) {
      contElem.classList.add('coldNight');
  }

  applyWeatherEffects(weatherData);

  // Pexel section
  if(pexelData.photos.length > 0){
  const max = pexelData.photos.length - 1;
  const random = Math.round(Math.random() * max);
  console.log(pexelData);
  const cityPicElem = document.createElement('img');
  cityPicElem.src = pexelData.photos[random].src.medium;
  contElem.insertAdjacentElement('beforeend', cityPicElem);
  }
}



const loadEvent = function () {
  createInputField();
};

window.addEventListener('load', loadEvent);
