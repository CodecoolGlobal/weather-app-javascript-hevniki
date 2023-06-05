const rootElement = document.querySelector('#root');
const API = 'ccb1f1cc7e374df1a79110319230506';
const url = `http://api.weatherapi.com/v1/current.json?key=${API}&q=London`;


function fetchFromNASA(date){
   
    console.log(url);
    fetch(url)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch(function(error) {
        console.log(error);
      });
  
    }


const loadEvent = function () {

};

window.addEventListener('load', loadEvent);
