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

const fakeData = {
  
}

  function applyWeatherEffects(weatherData) {
    const bodyElement = document.querySelector('body');
    const videoElement = document.createElement('video');
    videoElement.autoplay = true;
    videoElement.loop = true;
    videoElement.muted = true;
    videoElement.classList.add('fullscreen-video');
  
    const condition = weatherData.current.condition['text'].toLowerCase();
    const isDay = weatherData.current.is_day === 1;

    if (condition.includes('sunny')) {
      videoElement.src = isDay ? './public/sunnyday.mp4' : './public/sunnynight.mp4';
    } else if (condition.includes('cloudy') || condition.includes('overcast')) {
      videoElement.src = isDay ? './public/cloudyday.mp4' : './public/cloudynight.mp4';
    } else if (condition.includes('drizzle') || condition.includes('rain')) {
      videoElement.src = isDay ? './public/rainyday.mp4' : './public/rainynight.mp4';
    } else if (condition.includes('mist') || condition.includes('fog')) {
      videoElement.src = isDay ? './public/mistday.mp4' : './public/mistnight.mp4';
    } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('blizzard')) {
      videoElement.src = isDay ? './public/snowday.mp4' : './public/snownight.mp4';
    } else if (condition.includes('ice')) {
      videoElement.src = './public/ice.mp4';
    } else if (condition.includes('thunder')) {
      videoElement.src = isDay ? './public/thunderday.mp4' : './public/thundernight.mp4';
    }
  
    bodyElement.appendChild(videoElement);
  }

function classSelector(weatherData, divnum){
    if (weatherData.current.temp_c > 25) {
      divnum.classList.add('widget_hot');
    } else if (weatherData.current.temp_c < 25) {
      divnum.classList.add('widget_cold');
    }
    }

    function updateClock(clockElement) {
      const currentTime = new Date();
      const hours = currentTime.getHours();
      const minutes = currentTime.getMinutes();
      const formattedHours = hours.toString().padStart(2, '0');
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedTime = `${formattedHours}:${formattedMinutes}`;
    
      // Display the formatted time in the clock element
      clockElement.textContent = formattedTime;
    }

function listDetailsOnPage(weatherData, pexelData) {
rootElement.innerText = '';

const previousVideoElement = document.querySelector('video');
  if (previousVideoElement) {
    previousVideoElement.remove();
  }

// Create current div
const currentDiv = document.createElement('div');
currentDiv.id = 'id_current';
currentDiv.classList.add('container')

let DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",];
const getWeekDay = (data)=>{
  return DAYS[new Date(data).getDay()]
}

const currDiv1 = document.createElement('div')
const cityNameElem = document.createElement('h2')
const countryNameElem = document.createElement('h3')
cityNameElem.innerText = weatherData.location.name;
countryNameElem.innerText = weatherData.location.country;

currDiv1.insertAdjacentElement('beforeend', cityNameElem);
currDiv1.insertAdjacentElement('beforeend', countryNameElem);
classSelector(weatherData, currDiv1)

const dayElem = document.createElement('h1')
dayElem.innerText = getWeekDay(weatherData.forecast.forecastday[0].date)
const currDiv2 = document.createElement('div')
const localTime = `\n ${weatherData.location.localtime.split(' ')[1]}`;
const localTimeElement = document.createElement('h1');
localTimeElement.id = 'clock';
localTimeElement.innerText = localTime;
currDiv2.insertAdjacentElement('beforeend', localTimeElement);

setInterval(() => {
  const clockElement = document.getElementById('clock');
  updateClock(clockElement, localTime);
}, 60000);


currDiv2.insertAdjacentElement('beforeend', dayElem);
currDiv2.insertAdjacentElement('beforeend', localTimeElement);
classSelector(weatherData, currDiv2)

const currDiv3 = document.createElement('div')
const condText = document.createElement('h1');
condText.innerText = `${weatherData.current.condition['text']} \n\n`
const condImg = document.createElement('img');
condImg.src = weatherData.current.condition.icon;
condImg.classList.add('icon')

currDiv3.insertAdjacentElement('beforeend', condText)
currDiv3.insertAdjacentElement('beforeend', condImg)
classSelector(weatherData, currDiv3)

const currDiv4 = document.createElement('div')
const currTemperature= document.createElement('h2')
const feelsLike = document.createElement('h2')
currTemperature.innerText = `Temperature: \n ${weatherData.current.temp_c} °C`;
feelsLike.innerText = `\n Feels like: \n ${weatherData.current.feelslike_c} °C`;

currDiv4.insertAdjacentElement('beforeend', currTemperature);
currDiv4.insertAdjacentElement('beforeend', feelsLike);
classSelector(weatherData, currDiv4)

const currDiv5 = document.createElement('div')
const humidity= document.createElement('h2')
const wind = document.createElement('h2')

humidity.innerText = `Humidity: \n ${weatherData.current.humidity} %`;
wind.innerText = ` \n Wind: \n ${weatherData.current.wind_kph} km/h`;


currDiv5.insertAdjacentElement('beforeend', humidity);
currDiv5.insertAdjacentElement('beforeend', wind);

classSelector(weatherData, currDiv5)

const currDiv6 = document.createElement('div')
const dailyMin= document.createElement('h2')
const dailyMax = document.createElement('h2')
dailyMin.innerText = `Min temp: \n ${weatherData.forecast.forecastday[0].day.mintemp_c} °C`
dailyMax.innerText = `\n Max temp: \n ${weatherData.forecast.forecastday[0].day.maxtemp_c} °C`

currDiv6.insertAdjacentElement('beforeend', dailyMin);
currDiv6.insertAdjacentElement('beforeend', dailyMax);
classSelector(weatherData, currDiv6)

currentDiv.insertAdjacentElement('beforeend', currDiv1)
currentDiv.insertAdjacentElement('beforeend', currDiv2)
currentDiv.insertAdjacentElement('beforeend', currDiv3)
currentDiv.insertAdjacentElement('beforeend', currDiv4)
currentDiv.insertAdjacentElement('beforeend', currDiv5)
currentDiv.insertAdjacentElement('beforeend', currDiv6)

rootElement.insertAdjacentElement('beforeend', currentDiv)

const forecastDiv = document.createElement('div');
forecastDiv.id = 'id_forecast';
forecastDiv.classList.add('container')

weatherData.forecast.forecastday.forEach((element,i) =>{
if (i > 0){
  const forDiv = document.createElement('div')
  classSelector(weatherData, forDiv)
  const dayElem = document.createElement('h1')
  dayElem.innerText = getWeekDay(element.date)
  const minTempElem = document.createElement('h2')
  minTempElem.innerText = `\n ${element.day.mintemp_c} °C`
  const maxTempElem = document.createElement('h2')
  maxTempElem.innerText = `\n ${element.day.maxtemp_c} °C`
  const cond = document.createElement('h2')
  cond.innerText = element.day.condition.text
  const icon = document.createElement('img')
  icon.src = element.day.condition.icon

  forDiv.insertAdjacentElement('beforeend', dayElem)
  forDiv.insertAdjacentElement('beforeend', minTempElem)
  forDiv.insertAdjacentElement('beforeend', maxTempElem)
  forDiv.insertAdjacentElement('beforeend', cond)
  forDiv.insertAdjacentElement('beforeend', icon)

  forecastDiv.insertAdjacentElement('beforeend', forDiv)
}
})

rootElement.insertAdjacentElement('beforeend', forecastDiv)

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
