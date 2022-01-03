//clock

function displayTime() {
	// get the date once and reuse it
	const now = new Date() // const because this variable will never hold a different date object

	// hardcoded locale for now because it's actually pretty complicated to get it programmatically
	// https://stackoverflow.com/questions/1043339/javascript-for-detecting-browser-language-preference
	return now.toLocaleString('en-US', {
		dateStyle: 'full', 
		timeStyle: 'medium',
	})
}

let now = new Date();
let dateInput = document.querySelector("#current-time");
dateInput.innerHTML = displayTime(now);

//API

let apiKey = `0588a097340959e1dcf00479a90c9866`; //api key for openweathermap.org
let units = `imperial`;
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
let iconElement = document.querySelector("#icon");

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
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
  iconElement.setAttribute("width", 175);
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
        <img
          src="http://openweathermap.org/img/wn/${
            forecastDay.weather[0].icon
          }@2x.png"
          alt=""
          width="42"
        /><br />
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
