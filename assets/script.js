let searchedCities = JSON.parse(localStorage.getItem('search-history')) || []
// My API key
var API = '3b0f225e6883f4cc5b230f3bee519daf'
var searchBtn = document.getElementById('searchBtn')
var fiveDayWeatherEl = document.querySelector(".five-day-weather")
function getGeolocation(city) {
  var geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${API}`
  fetch(geoUrl).then(response => response.json()).then(data => {

    var lat = data[0].lat
    var lon = data[0].lon
    var cityName = data[0].name
    if (searchedCities.indexOf(cityName) === -1) {
      searchedCities.push(cityName)
      localStorage.setItem('search-history', JSON.stringify(searchedCities))
    }

    getWeather(lat, lon)
  })
}
// API call for latitude and longitude
function getWeather(lat, lon) {
  document.getElementById('current-weather').innerHTML = ''
  // AAPI call for current weather
  var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API}`
  fetch(weatherUrl).then(response => response.json()).then(data => {
    console.log(data)
    // Current weather display
    var temp = data.main.temp
    var tempText = document.createElement('p')
    tempText.textContent = 'Temperature: ' + temp;
    var humidity = data.main.humidity
    var humText = document.createElement('p')
    humText.textContent = 'Humidity: ' + humidity;
    var windspeed = data.wind.speed
    var windText = document.createElement('p')
    windText.textContent = 'Wind speed: ' + windspeed

    document.getElementById('current-weather').append(tempText, humText, windText)
    document.getElementById('current-city').textContent = data.name
    // Displays the search history
    displaySearchHistory()
  })
  getforecast(lat, lon)
}
// API for the 5 day forecast
function createForecastCard(date, temp, humidity, windspeed) {
  // Create card div
  var cardDiv = document.createElement('div');
  cardDiv.classList.add('card', 'xm-5');
  cardDiv.style.width = '20rem'; // Set width using style property

  // Create card body
  var cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  // Create card title
  var cardTitle = document.createElement('h5');
  cardTitle.classList.add('card-title');
  cardTitle.textContent = date.toDateString(); // Display the date

  // Create temperature, humidity, and wind speed elements
  var tempText = document.createElement('p');
  tempText.textContent = 'Temperature: ' + temp;

  var humText = document.createElement('p');
  humText.textContent = 'Humidity: ' + humidity;

  var windText = document.createElement('p');
  windText.textContent = 'Wind Speed: ' + windspeed;

  // Append elements to card body
  cardBody.appendChild(cardTitle);
  cardBody.appendChild(tempText);
  cardBody.appendChild(humText);
  cardBody.appendChild(windText);

  // Append card body to card div
  cardDiv.appendChild(cardBody);

  return cardDiv;
}

// API for the 5 day forecast
function getforecast(lat, lon) {
  document.querySelector('.five-day-weather').innerHTML = '';
  var forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API}&units=imperial`;

  fetch(forecastUrl)
    .then(response => response.json())
    .then(data => {
      console.log(data);
      var forecastarray = [];
      for (var i = 0; i < data.list.length; i++) {
        var time = data.list[i].dt_txt.split(' ')[1];
        if (time === '12:00:00') {
          forecastarray.push(data.list[i]);
        }
      }
      console.log(forecastarray);

      // Loop through forecast array to create forecast cards
      for (var i = 0; i < forecastarray.length; i++) {
        var forecastData = forecastarray[i];
        var temp = forecastData.main.temp;
        var humidity = forecastData.main.humidity;
        var windspeed = forecastData.wind.speed;

        // Calculate date for forecast
        var currentDate = new Date();
        currentDate.setDate(currentDate.getDate() + i); // Increment the date for each forecast

        // Create forecast card using createForecastCard function
        var card = createForecastCard(currentDate, temp, humidity, windspeed);

        // Append card to forecast container
        document.querySelector('.five-day-weather').appendChild(card);
      }
    });
}

// Button added that also logs previous city and displays
searchBtn.addEventListener('click', function (event) {
  var cityName = document.getElementById('cityInput').value
  getGeolocation(cityName)
})

function displaySearchHistory() {
  var searchHistoryContainer = document.getElementById("search-history");
  searchHistoryContainer.innerHTML = "";
  
  // Determine the starting index for displaying the last 10 searches
  var startIndex = Math.max(0, searchedCities.length - 10);
  
  for (var i = startIndex; i < searchedCities.length; i++) {
    var button = document.createElement("button");
    button.classList.add('searchHistoryBtn');
    button.textContent = searchedCities[i];
    button.setAttribute('value', searchedCities[i]);
    button.addEventListener('click', function () {
      getGeolocation(this.value);
      console.log(this);
    });
    searchHistoryContainer.appendChild(button);
  }
}

displaySearchHistory();