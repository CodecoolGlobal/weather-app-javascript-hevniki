import {cities} from '/data.js';

const rootElement = document.querySelector('#root');

function getWeekDay (data){
  const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return DAYS[new Date(data).getDay()];
}

function createInput(){

  const inputElement = document.createElement('input');
  inputElement.id = 'id_input_elem';
  inputElement.placeholder = 'type the name of a city here';
  inputElement.setAttribute('list', 'id_list_elem_cities');
  // we need a datalist
  const datalistElement = document.createElement('datalist');
  datalistElement.id = 'id_list_elem_cities';

  /* inputElement.addEventListener('input', (event)=>{
    if (event.target.value.length < 3){
      inputElement.removeAttribute('list');
    }     else {
      inputElement.setAttribute('list', 'id_list_elem_cities');
    }
  });*/
  const toolbarElem = document.createElement('div');
  toolbarElem.id = 'id_toolbar';
  toolbarElem.insertAdjacentElement('afterbegin', datalistElement);
  toolbarElem.insertAdjacentElement('afterbegin', inputElement);
  rootElement.insertAdjacentElement('beforebegin', toolbarElem);

  getTheOptionElements(cities);

  inputElement.addEventListener('change', (event) => {
    const city = event.target.value; // Get the city from the input element
  
    Promise.all([
      fetchCityFromWeatherAPI(city),
      fetchCityFromPexelAPI(city),
      fetchHourlyForecast(city)
    ]).then((values) => {
      displayDetailsOnPage(values[0], values[1]);
      displayHourlyForecast(values[2], values[0]);
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
  const key = 'ccb1f1cc7e374df1a79110319230506';
  const url = `http://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}&days=7`;
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

const cityInput = document.getElementById('cityInput'); // Assuming you have an input element with the id 'cityInput'

function fetchHourlyForecast(city) {
  const apiKey = 'ccb1f1cc7e374df1a79110319230506';
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=1&aqi=no&alerts=no&hourly=yes`;

  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const hourlyForecast = data.forecast.forecastday[0].hour; // Extract the hourly forecast data from the response

      return hourlyForecast;
    })
    .catch((error) => {
      console.error('Error fetching hourly forecast:', error);
      return null;
    });
}

function applyClassToHourlyForeCast(weatherData, element){ // here here
  if (weatherData.current.is_day === 1) {
    element.classList.add('hourly_widget_day');
  } else if (weatherData.current.is_day === 0) {
    element.classList.add('hourly_widget_night');
  }
}

function displayHourlyForecast(hourlyForecast, weatherData) {
  const forecastContainerElem = document.getElementById('id_forecast');

  if (!forecastContainerElem) {
    console.error('Cannot find element with ID "id_forecast"');
    return;
  }

  // Create a new container div for the hourly forecast
  const hourlyForecastContainerElem = document.createElement('div');
  
  hourlyForecastContainerElem.classList.add('container');

  hourlyForecast.forEach((forecast) => {
    const forecastContainer = document.createElement('div');
    hourlyForecastContainerElem.id = 'hourly_forecast';//unnecessary, and id is not unique
    applyClassToHourlyForeCast(weatherData, forecastContainer);

    const timeElem = document.createElement('h5');
    const hour = forecast.time.slice(11, 13);
    const formattedTime = hour + ':00';
    timeElem.textContent = formattedTime;

    const tempElem = document.createElement('h4');
    tempElem.textContent = `${forecast.temp_c}°C`;

    forecastContainer.appendChild(timeElem);
    forecastContainer.appendChild(tempElem);

    hourlyForecastContainerElem.appendChild(forecastContainer);
  });

  // Insert the hourly forecast container before the forecastContainerElem
  forecastContainerElem.insertAdjacentElement('beforebegin', hourlyForecastContainerElem);
}

function applyWeatherEffects(weatherData) {
  const bodyElement = document.querySelector('body');
  const videoElement = document.createElement('video');
  videoElement.autoplay = true;
  videoElement.loop = true;
  videoElement.muted = true;
  videoElement.classList.add('fullscreen-video');

  const audioElement = document.createElement('audio');
  audioElement.autoplay = true;
  audioElement.loop = true;
  audioElement.muted = false;
  audioElement.volume = 1.0;
  audioElement.classList.add('audio-element');

  const condition = weatherData.current.condition['text'].toLowerCase();
  const isDay = weatherData.current.is_day === 1;

  if (condition.includes('sunny') || condition.includes('clear')) {
    videoElement.src = isDay ? './public/sunnyday.mp4' : './public/sunnynight.mp4';
    audioElement.src = './public/sunny.mp4';
  } else if (condition.includes('thunder')) {
    videoElement.src = isDay ? './public/thunderday.mp4' : './public/thundernight.mp4';
    audioElement.src = './public/thunder.mp4';
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    videoElement.src = isDay ? './public/cloudyday.mp4' : './public/cloudynight.mp4';
    audioElement.src = './public/cloudy.mp4';
  } else if (condition.includes('drizzle') || condition.includes('rain')) {
    videoElement.src = isDay ? './public/rainyday.mp4' : './public/rainynight.mp4';
    audioElement.src = './public/rain.mp4';
  } else if (condition.includes('mist') || condition.includes('fog')) {
    videoElement.src = isDay ? './public/mistday.mp4' : './public/mistnight.mp4';
  } else if (condition.includes('snow') || condition.includes('sleet') || condition.includes('blizzard')) {
    videoElement.src = isDay ? './public/snowday.mp4' : './public/snownight.mp4';
  } else if (condition.includes('ice')) {
    videoElement.src = './public/ice.mp4';
  }
  bodyElement.appendChild(videoElement);
  bodyElement.appendChild(audioElement);
}

function applyClass(weatherData, element){
  if (weatherData.current.is_day === 1) {
    element.classList.add('widget_day');
  } else if (weatherData.current.is_day === 0) {
    element.classList.add('widget_night');
  }
}

function updateClock(difference){
  const currentTime = new Date();
  const formattedHours = (currentTime.getHours() - difference).toString().padStart(2, '0');
  const formattedMinutes = currentTime.getMinutes().toString().padStart(2, '0');
  const formattedSeconds = currentTime.getSeconds().toString().padStart(2, '0');
  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function displayDetailsOnPage(weatherData, pexelData) {
  rootElement.innerText = '';
  if (weatherData.current.is_day === 1){
    document.querySelector('#id_input_elem').classList.remove('input_night');
    document.querySelector('#id_input_elem').classList.add('input_day');
  }
  else if (weatherData.current.is_day === 0){
    document.querySelector('#id_input_elem').classList.remove('input_day');
    document.querySelector('#id_input_elem').classList.add('input_night');
  }
  if (document.querySelector('video')) {
    document.querySelector('video').remove();
  }
  if (document.querySelector('audio')) {
    document.querySelector('audio').remove();
  }
  const upperWidgets = [];

  const upperContElem = document.createElement('div');
  upperContElem.id = 'id_current';
  upperContElem.classList.add('container');
  rootElement.insertAdjacentElement('beforeend', upperContElem);

  const widgetLocationElem = document.createElement('div');
  const cityNameElem = document.createElement('h2');
  const countryNameElem = document.createElement('h3');
  cityNameElem.innerText = weatherData.location.name;
  countryNameElem.innerText = ` \n ${weatherData.location.country} `;

  widgetLocationElem.insertAdjacentElement('beforeend', cityNameElem);
  widgetLocationElem.insertAdjacentElement('beforeend', countryNameElem);
  upperWidgets.push(widgetLocationElem);


  const dayElem = document.createElement('h1');
  dayElem.innerText = getWeekDay(weatherData.forecast.forecastday[0].date);
  const widgetTimeElem = document.createElement('div');
  const dateElem = document.createElement('h2');
  dateElem.innerText = `\n ${weatherData.location.localtime.split(' ')[0]}`;
  const currentTime = new Date;
  const difference = currentTime.getHours() - Number(weatherData.location.localtime.split(' ')[1].split(':')[0]);
  const localTimeElement = document.createElement('h1');
  localTimeElement.id = 'clock';
  localTimeElement.innerText = `\n ${updateClock(difference)}`;
  widgetTimeElem.insertAdjacentElement('beforeend', localTimeElement);

  setInterval(() => {
    localTimeElement.innerText = `\n ${updateClock(difference)}`;
  }, 1000);

  widgetTimeElem.insertAdjacentElement('beforeend', dayElem);
  widgetTimeElem.insertAdjacentElement('beforeend', dateElem);
  widgetTimeElem.insertAdjacentElement('beforeend', localTimeElement);
  upperWidgets.push(widgetTimeElem);

  const widgetCondElem = document.createElement('div');
  const condTextElem = document.createElement('h1');
  condTextElem.innerText = `${weatherData.current.condition['text']} \n\n`;
  const condImgElem = document.createElement('img');
  condImgElem.src = weatherData.current.condition.icon;
  condImgElem.classList.add('icon');

  widgetCondElem.insertAdjacentElement('beforeend', condTextElem);
  widgetCondElem.insertAdjacentElement('beforeend', condImgElem);
  upperWidgets.push(widgetCondElem);

  const widgetTempElem = document.createElement('div');
  const temperatureElem = document.createElement('h2');
  const currTemperatureElem = document.createElement('h1');
  const feelElem = document.createElement('h2');
  const feelsLikeElem = document.createElement('h1');
  temperatureElem.innerText = 'Temperature: ';
  currTemperatureElem.innerText = `${weatherData.current.temp_c} °C`;
  feelElem.innerText = '\n Feels like: ';
  feelsLikeElem.innerText = `${weatherData.current.feelslike_c} °C`;

  widgetTempElem.insertAdjacentElement('beforeend', temperatureElem);
  widgetTempElem.insertAdjacentElement('beforeend', currTemperatureElem);
  widgetTempElem.insertAdjacentElement('beforeend', feelElem);
  widgetTempElem.insertAdjacentElement('beforeend', feelsLikeElem);
  upperWidgets.push(widgetTempElem);

  const widgetHumWindElem = document.createElement('div');
  const humElem = document.createElement('h2');
  const humidityElem = document.createElement('h1');
  const windSpeedElem = document.createElement('h2');
  const windElem = document.createElement('h1');

  humElem.innerText = 'Humidity: ';
  humidityElem.innerText = `${weatherData.current.humidity} %`;
  windSpeedElem.innerText = '\n Wind: ';
  windElem.innerText = `${weatherData.current.wind_kph} km/h`;

  widgetHumWindElem.insertAdjacentElement('beforeend', humElem);
  widgetHumWindElem.insertAdjacentElement('beforeend', humidityElem);
  widgetHumWindElem.insertAdjacentElement('beforeend', windSpeedElem);
  widgetHumWindElem.insertAdjacentElement('beforeend', windElem);

  upperWidgets.push(widgetHumWindElem);


  const widgetMinMaxElem = document.createElement('div');
  const minElem = document.createElement('h2');
  const dailyMinElem = document.createElement('h1');
  const maxElem = document.createElement('h2');
  const dailyMaxElem = document.createElement('h1');
  minElem.innerText = 'Min temp: ';
  dailyMinElem.innerText = `${weatherData.forecast.forecastday[0].day.mintemp_c} °C`;
  maxElem.innerText = ' \n Max temp';
  dailyMaxElem.innerText = `${weatherData.forecast.forecastday[0].day.maxtemp_c} °C`;

  widgetMinMaxElem.insertAdjacentElement('beforeend', minElem);
  widgetMinMaxElem.insertAdjacentElement('beforeend', dailyMinElem);
  widgetMinMaxElem.insertAdjacentElement('beforeend', maxElem);
  widgetMinMaxElem.insertAdjacentElement('beforeend', dailyMaxElem);

  upperWidgets.push(widgetMinMaxElem);

  upperWidgets.forEach((widgElem)=>{
    applyClass(weatherData, widgElem);
    upperContElem.insertAdjacentElement('beforeend', widgElem);
  });

  const forecastWidgContElem = document.createElement('div');
  forecastWidgContElem.id = 'id_forecast';
  forecastWidgContElem.classList.add('container');

  weatherData.forecast.forecastday.forEach((element, i) =>{
    if (i > 0){
      const widgetForecastDiv = document.createElement('div');
      applyClass(weatherData, widgetForecastDiv);
      const dayElem = document.createElement('h2');
      dayElem.innerText = getWeekDay(element.date);
      const minTempElem = document.createElement('h2');
      const minText = document.createElement('h5');
      minText.innerText = '\n Min temperature: ';
      minTempElem.innerText = ` ${element.day.mintemp_c} °C`;
      const maxTempElem = document.createElement('h2');
      const maxText = document.createElement('h5');
      maxText.innerText = '\n Max temperature: ';
      maxTempElem.innerText = ` ${element.day.maxtemp_c} °C`;
      const icon = document.createElement('img');
      icon.src = element.day.condition.icon;

      widgetForecastDiv.insertAdjacentElement('beforeend', dayElem);
      widgetForecastDiv.insertAdjacentElement('beforeend', minText);
      widgetForecastDiv.insertAdjacentElement('beforeend', minTempElem);
      widgetForecastDiv.insertAdjacentElement('beforeend', maxText);
      widgetForecastDiv.insertAdjacentElement('beforeend', maxTempElem);
      if (element.day.condition.text.length < 14){
        const cond = document.createElement('h3');
        cond.innerText = `\n ${element.day.condition.text}`;
        widgetForecastDiv.insertAdjacentElement('beforeend', cond);
      } else {
        const cond = document.createElement('h3');
        cond.innerText = `${element.day.condition.text}`;
        widgetForecastDiv.insertAdjacentElement('beforeend', cond);
      }
      widgetForecastDiv.insertAdjacentElement('beforeend', icon);

      forecastWidgContElem.insertAdjacentElement('beforeend', widgetForecastDiv);
    }
  });

  rootElement.insertAdjacentElement('beforeend', forecastWidgContElem);

  if (pexelData.photos.length > 0){
    const random = Math.round(Math.random() * (pexelData.photos.length - 1));
    const breakPoint = document.createElement('br');
    const cityPicElem = document.createElement('img');
    cityPicElem.src = pexelData.photos[random].src.tiny;
    widgetLocationElem.insertAdjacentElement('beforeend', breakPoint);
    widgetLocationElem.insertAdjacentElement('beforeend', cityPicElem);
  }
  applyWeatherEffects(weatherData);
}

const loadEvent = function () {
  createInput();
  Promise.all([
    fetchCityFromWeatherAPI('Budapest'),
    fetchCityFromPexelAPI('Budapest'),
    fetchHourlyForecast('Budapest')
  ]).then((values) => {
    displayDetailsOnPage(values[0], values[1]);
    displayHourlyForecast(values[2], values[0]);
  });
};

window.addEventListener('load', loadEvent);
