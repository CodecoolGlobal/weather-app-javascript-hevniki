import {cities} from '/data.js';

// search for cities.name
const rootElement = document.querySelector('#root');
const API = 'ccb1f1cc7e374df1a79110319230506';
const city = 'Budapest';
const url = `http://api.weatherapi.com/v1/current.json?key=${API}&q=${city}`;

function createInputField(){
  // we need a label with 'for = input#id
const labelElement = document.createElement('label');
labelElement.innerText='Choose a city from this list, or start typing';
labelElement.id='id_label';
labelElement.for='id_input_elem';
  // we need an input with list = datalist#id

  const inputElement = document.createElement('input');
inputElement.id = 'id_input_elem';
inputElement.placeholder = 'type the name of a city here';
inputElement.setAttribute('list','id_list_elem_cities');
  // we need a datalist
const datalistElement = document.createElement('datalist');
datalistElement.id='id_list_elem_cities';
 
  
  // we need eventlistener on the input element, and remove/add the list association to the datalist
inputElement.addEventListener('input', (event)=>{
if (event.target.value.length<3){
  inputElement.removeAttribute('list');
}
else {inputElement.setAttribute('list','id_list_elem_cities');}
});
  // insterting everything to DOM
  rootElement.insertAdjacentElement('afterbegin', datalistElement);
  rootElement.insertAdjacentElement('afterbegin', inputElement);
  rootElement.insertAdjacentElement('afterbegin', labelElement);
   // we need option elements inside the datalist
  getTheOptionElements(cities);

}

function getTheOptionElements(cities){
  console.log(typeof cities);
 cities.forEach((city)=>{
    const cityElement = document.createElement('option');
    cityElement.value = city;
    document.querySelector('#id_list_elem_cities').insertAdjacentElement('beforeend', cityElement);
  });
}

function fetchCity(){
   
    fetch(url)
      .then((response) => {
        //console.log(response);
        return response.json();
      })
      .then((data) => {
        //console.log(data);
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
  //setTimeout(createInputField, 10000);
  fetchCity();
  console.log(typeof cities);
};

window.addEventListener('load', loadEvent);
