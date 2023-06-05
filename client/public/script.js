import {cities} from '/data.js';

// search for cities.name
const rootElement = document.querySelector('#root');
const API = 'ccb1f1cc7e374df1a79110319230506';
const city = 'Budapest';
const url = `http://api.weatherapi.com/v1/current.json?key=${API}&q=${city}`;

function createInputField(){
  const inputElement = document.createElement('input');
  inputElement.id= 'input';
  inputElement.type='text';
  inputElement.placeholder = 'Select a City';
  rootElement.insertAdjacentElement('beforebegin', inputElement);
}

function fetchCity(){
   
    fetch(url)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        console.log(data.current.condition);
        console.log(typeof data.condition);
        listDetailsOnPage(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  
    }

function listDetailsOnPage (data){
const contElem = document.createElement('div');
const conditionElem = document.createElement('p');
conditionElem.innerText=data.current.condition['text'];
const condImgElem = document.createElement('img');
condImgElem.src= data.current.condition.icon;
contElem.insertAdjacentElement('beforeend', conditionElem);
contElem.insertAdjacentElement('beforeend', condImgElem);
rootElement.insertAdjacentElement('beforeend', contElem);



}

const loadEvent = function () {
  createInputField();
  console.log(cities);
  fetchCity();
};

window.addEventListener('load', loadEvent);
