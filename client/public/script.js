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

function listDetailsOnPage (weatherData, pexelData){
  if (document.querySelector('#id_weather_div')){
    while (document.querySelector('#id_weather_div').firstChild) {
      document.querySelector('#id_weather_div')
        .removeChild(document.querySelector('#id_weather_div').firstChild);
    }
    document.querySelector('#id_weather_div').remove();
  }
  const contElem = document.createElement('div');
  contElem.id = 'id_weather_div';
  const conditionElem = document.createElement('p');
  conditionElem.innerText = weatherData.current.condition['text'];
  const headElem = document.createElement('h1');
  headElem.innerText = `The weather currently in ${weatherData.location.name}`;
  const condImgElem = document.createElement('img');
  condImgElem.src = weatherData.current.condition.icon;
  contElem.insertAdjacentElement('beforeend', headElem);
  contElem.insertAdjacentElement('beforeend', conditionElem);
  contElem.insertAdjacentElement('beforeend', condImgElem);
  rootElement.insertAdjacentElement('beforeend', contElem);
// pexel from here
const max = pexelData.length-1;
const random = Math.round(Math.random()*max);
console.log(pexelData);
const cityPicElem=document.createElement('img');
cityPicElem.src=pexelData.photos[0].src.medium;
rootElement.insertAdjacentElement('beforeend', cityPicElem);

}


const loadEvent = function () {
  createInputField();
};

window.addEventListener('load', loadEvent);
