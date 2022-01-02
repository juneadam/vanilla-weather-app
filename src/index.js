//clock

function displayTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let months = [
    "Jan",
    "Febr",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  let currentDay = days[now.getDay()]; //getX is a function build into javascript, pulls from array - associating the JS array with our built one to assign a string
  let currentMonth = months[now.getMonth()];
  let currentDate = now.getDate();
  let currentHour = now.getHours();
  let AMPM = `AM`;
  if (currentHour === 0) {
    currentHour = currentHour + 12;
    AMPM = `AM`;
  }
  if (currentHour === 12) {
    AMPM = `PM`;
  }
  if (currentHour > 12) {
    currentHour = currentHour - 12;
    AMPM = `PM`;
  }
  let currentMinutes = now.getMinutes();
  if (currentMinutes < 10) {
    currentMinutes = `0` + currentMinutes;
  }

  let sentence = `${currentDay}, ${currentMonth} ${currentDate}, ${currentHour}:${currentMinutes} ${AMPM}`;
  return sentence;
}

let now = new Date();
let dateInput = document.querySelector("#current-time");
dateInput.innerHTML = displayTime(now);

//API

let apiKey = `0588a097340959e1dcf00479a90c9866`; //api key for openweathermap.org
let units = `imperial`; //hold
let cnt = `5`;

// set variables to connect to HTML ids, to update on search
let numTempCurrent = document.querySelector("#current-temp-num");
let hiTempCurrent = document.querySelector("#hi-temp-current");
let hiUnit = document.querySelector(`#hi-unit`);
let loTempCurrent = document.querySelector("#lo-temp-current");
let loUnit = document.querySelector(`#lo-unit`);
let weatherDescriptor = document.querySelector("#weather-descriptor-today");
let humidPercent = document.querySelector("#humid-percent");
let windSpeed = document.querySelector("#wind-speed");
let windUnit = document.querySelector("#wind-unit");
let currentCity = document.querySelector("#current-city");

function promptOnLoad() {
  cityPrompt = cityPrompt.replace(/\s+/g, "%20");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityPrompt}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateWeatherInfo);
}

promptOnLoad();

//search function

function pullCoord(coordinates) {
  let lat = coordinates.lat;
  let lon = coordinates.lon;
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(populateForecast);
}

function pullSearchData(event) {
  event.preventDefault();
  let searchBox = document.querySelector("#search-box");
  let citySearch = searchBox.value;
  citySearch = citySearch.replace(/\s+/g, "%20"); //looks for white space " " in searches, converts to %20 for URL purposes
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateWeatherInfo); //axios requests data set from the API, then allows us to create a function that updates site info based on that data
}

let searchLocation = document.querySelector("#city-search-btn");
searchLocation.addEventListener("click", pullSearchData);

// current location - on click, find location data, send to function to pull actual coordinates based on "position" accessed by navigator

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(catchCoords);
}

function catchCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(updateWeatherInfo);
}

let currentLocation = document.querySelector(`#current-geoloc-btn`);
currentLocation.addEventListener(`click`, getPosition);

//function to update HTML strings to display requested data (current location or city search)

function updateWeatherInfo(response) {
  console.log(response.data);
  // pull data, set to variables
  let currentTemp = response.data.main.temp;
  let hiTemp = response.data.main.temp_max;
  let loTemp = response.data.main.temp_min;
  let weatherDescriptPull = response.data.weather[0].description;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let city = response.data.name;
  let country = response.data.sys.country;
  //update global null variable to include data pulled
  imperialTempCurrent = currentTemp;
  imperialTempHi = hiTemp;
  imperialTempLo = loTemp;
  imperialWind = wind;
  weatherMain = response.data.weather[0].main;
  //update HTML based on data pulled, round to integer
  numTempCurrent.innerHTML = Math.round(currentTemp);
  hiTempCurrent.innerHTML = Math.round(hiTemp);
  loTempCurrent.innerHTML = Math.round(loTemp);
  weatherDescriptor.innerHTML = `${weatherDescriptPull}`;
  humidPercent.innerHTML = Math.round(humidity);
  windSpeed.innerHTML = Math.round(wind);
  currentCity.innerHTML = `${city}, ${country}`;
  emojiUpdate();
  pullCoord(response.data.coord);
}

//forecast JS concatenation

function formatTimestamp(timestamp) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  return days[day];
}

function populateForecast(response) {
  forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast-row");
  let forecastHTML = `<div class="row">`; //setting new variable so that we can concatenate it with itself, repeating it x number of times
  forecast.forEach(function (forecastDay, index) {
    if (index < 6 && index > 0) {
      forecastHTML =
        forecastHTML +
        `<div class="col-2 day-box">
            ${formatTimestamp(forecastDay.dt)}<br />
            <span id="dayEmoji">❄</span><br />
            <span id="hiDay">
            ${Math.round(forecastDay.temp.max)}°
            </span>
             / 
            <span id="loDay">
            ${Math.round(forecastDay.temp.min)}°
            </span>
          </div>
  `;
    }
    //forEach loops the internal function however many times based on the number of objects in the array it's being pulled from (ie 5 here)
    //this has now populated the forecast with 5 boxes
    // using inerpolation ${} allows for dynamic HTML via javascript
    forecastElement.innerHTML = forecastHTML;
  });
}

//associating emoji with 'main' dataset

function emojiUpdate() {
  let weatherEmoji = document.querySelector("#weather-emoji");
  if (weatherMain === `Clear`) {
    weatherEmoji.innerHTML = `🌞`;
  }
  if (weatherMain === `Clouds`) {
    weatherEmoji.innerHTML = `☁`;
  }
  if (weatherMain === `Rain` || weatherMain === `Drizzle`) {
    weatherEmoji.innerHTML = `☔`;
  }
  if (weatherMain === `Thunderstorm` || weatherMain === `Squall`) {
    weatherEmoji.innerHTML = `⛈`;
  }
  if (weatherMain === `Snow`) {
    weatherEmoji.innerHTML = `❄`;
  }
  if (
    weatherMain === `Mist` ||
    weatherMain === `Haze` ||
    weatherMain === `Fog` ||
    weatherMain === `Smoke` ||
    weatherMain === `Sand` ||
    weatherMain === `Dust` ||
    weatherMain === `Ash`
  ) {
    weatherEmoji.innerHTML = `🌫`;
  }
  if (weatherMain === `Tornado`) {
    weatherEmoji.innerHTML = `🌪`;
  }
}

// conversion

function convertToMetric(event) {
  event.preventDefault();
  conversionCelsius.classList.add(`active`);
  conversionFahrenheit.classList.remove(`active`);
  let convertedCurrentM = Math.round(((imperialTempCurrent - 32) * 5) / 9);
  numTempCurrent.innerHTML = `${convertedCurrentM}`;
  let convertedHiM = Math.round(((imperialTempHi - 32) * 5) / 9);
  hiTempCurrent.innerHTML = `${convertedHiM}`;
  hiUnit.innerHTML = `C`;
  let convertedLoM = Math.round(((imperialTempLo - 32) * 5) / 9);
  loTempCurrent.innerHTML = `${convertedLoM}`;
  loUnit.innerHTML = `C`;
  let convertedWindM = Math.round(imperialWind * 1.60934);
  windSpeed.innerHTML = `${convertedWindM}`;
  windUnit.innerHTML = `km/h`;
}

function convertToImperial(event) {
  event.preventDefault();
  conversionFahrenheit.classList.add(`active`);
  conversionCelsius.classList.remove(`active`);
  numTempCurrent.innerHTML = Math.round(imperialTempCurrent);
  hiTempCurrent.innerHTML = Math.round(imperialTempHi);
  hiUnit.innerHTML = `F`;
  loTempCurrent.innerHTML = Math.round(imperialTempLo);
  loUnit.innerHTML = `F`;
  windSpeed.innerHTML = Math.round(imperialWind);
  windUnit.innerHTML = `mph`;
}

let imperialTempCurrent = null; //setting a null variable to be updated using search functions
let imperialTempHi = null;
let imperialTempLo = null;
let imperialWind = null;
let weatherMain = null;

let conversionCelsius = document.querySelector(`#celsiusConversion`);
conversionCelsius.addEventListener(`click`, convertToMetric);

let conversionFahrenheit = document.querySelector(`#fahrenheitConversion`);
conversionFahrenheit.addEventListener(`click`, convertToImperial);
