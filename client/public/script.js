import {cities} from '/data.js';

const rootElement = document.querySelector('#root');

function createInputField(){

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
  const toolbarElem = document.createElement('div')
  toolbarElem.id = 'id_toolbar'
  toolbarElem.insertAdjacentElement('afterbegin', datalistElement);
  toolbarElem.insertAdjacentElement('afterbegin', inputElement);
  rootElement.insertAdjacentElement('beforebegin', toolbarElem);

  getTheOptionElements(cities);

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
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${API_key}&q=${city}&days=7`;
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

function applyWeatherEffects(weatherData) {
  const bodyElement = document.querySelector('body');
  const videoElement = document.createElement('video');

  if (weatherData.current.temp_c > 20 && weatherData.current.is_day !== 0) {
    videoElement.src = './public/hotday.mp4';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add('fullscreen-video');
  } else if (weatherData.current.temp_c > 20 && weatherData.current.is_day === 0) {
    videoElement.src = './public/hotnight.mp4';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add('fullscreen-video');
  }else if (weatherData.current.temp_c < 20 && weatherData.current.is_day !== 1) {
    videoElement.src = './public/coldday.mp4';
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add('fullscreen-video');
  }else if (weatherData.current.temp_c < 20 && weatherData.current.is_day === 1) {
  videoElement.src = './public/coldnight.mp4';
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.classList.add('fullscreen-video');
  }
  bodyElement.appendChild(videoElement);
}


function listDetailsOnPage(weatherData, pexelData) {
rootElement.innerText = '';

// Create current div
const currentDiv = document.createElement('div');
currentDiv.id = 'id_current';
currentDiv.classList.add('container')

const currDiv1 = document.createElement('div')
const cityNameElem = document.createElement('h2')
const countryNameElem = document.createElement('h3')
cityNameElem.innerText = weatherData.location.name;
countryNameElem.innerText = weatherData.location.country;

currDiv1.insertAdjacentElement('beforeend', cityNameElem);
currDiv1.insertAdjacentElement('beforeend', countryNameElem);
currDiv1.classList.add('widget')

const currDiv2 = document.createElement('div')
const localTime = document.createElement('h1')
localTime.innerText = weatherData.location.localtime.split(' ')[1]

currDiv2.insertAdjacentElement('beforeend', localTime);
currDiv2.classList.add('widget')

const currDiv3 = document.createElement('div')
const condText = document.createElement('h1');
condText.innerText = `${weatherData.current.condition['text']} \n\n`
const condImg = document.createElement('img');
condImg.src = weatherData.current.condition.icon;
condImg.classList.add('icon')

currDiv3.insertAdjacentElement('beforeend', condText)
currDiv3.insertAdjacentElement('beforeend', condImg)
currDiv3.classList.add('widget')

const currDiv4 = document.createElement('div')
const currTemperature= document.createElement('h2')
const feelsLike = document.createElement('h2')
currTemperature.innerText = `Temperature: \n ${weatherData.current.temp_c} °C`;
feelsLike.innerText = `\n Feels like: \n ${weatherData.current.feelslike_c} °C`;

currDiv4.insertAdjacentElement('beforeend', currTemperature);
currDiv4.insertAdjacentElement('beforeend', feelsLike);
currDiv4.classList.add('widget')

const currDiv5 = document.createElement('div')
const humidity= document.createElement('h2')
const wind = document.createElement('h2')

humidity.innerText = `Humidity: \n ${weatherData.current.humidity} %`;
wind.innerText = ` \n Wind: \n ${weatherData.current.wind_kph} km/h`;


currDiv5.insertAdjacentElement('beforeend', humidity);
currDiv5.insertAdjacentElement('beforeend', wind);

currDiv5.classList.add('widget')

const currDiv6 = document.createElement('div')
const dailyMin= document.createElement('h2')
const dailyMax = document.createElement('h2')
dailyMin.innerText = `Min temp: \n ${weatherData.forecast.forecastday[0].day.mintemp_c} °C`
dailyMax.innerText = `\n Max temp: \n ${weatherData.forecast.forecastday[0].day.maxtemp_c} °C`

currDiv6.insertAdjacentElement('beforeend', dailyMin);
currDiv6.insertAdjacentElement('beforeend', dailyMax);
currDiv6.classList.add('widget')

currentDiv.insertAdjacentElement('beforeend', currDiv1)
currentDiv.insertAdjacentElement('beforeend', currDiv2)
currentDiv.insertAdjacentElement('beforeend', currDiv3)
currentDiv.insertAdjacentElement('beforeend', currDiv4)
currentDiv.insertAdjacentElement('beforeend', currDiv5)
currentDiv.insertAdjacentElement('beforeend', currDiv6)

rootElement.insertAdjacentElement('beforeend', currentDiv)

if(pexelData.photos.length > 0){
  const max = pexelData.photos.length - 1;
  const random = Math.round(Math.random() * max);
  console.log(pexelData);
  const cityPicElem = document.createElement('img');
  cityPicElem.src = pexelData.photos[random].src.tiny;
  currDiv1.insertAdjacentElement('beforeend', cityPicElem);
  }

  console.log(weatherData);

  applyWeatherEffects(weatherData);

}



const loadEvent = function () {
  createInputField();
  Promise.all([fetchCityFromWeatherAPI('budapest'), fetchCityFromPexelAPI('budapest')]).then((values)=>{
    listDetailsOnPage(values[0], values[1]);
  });
};

window.addEventListener('load', loadEvent);
