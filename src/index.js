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

//function to update HTML strings to display requested data (current location or city search)

function updateWeatherInfo(response) {
  console.log(response.data);
  // pull data, set to variables
  let currentTemp = response.data.main.temp;
  let hiTemp = response.data.main.temp_max;
  let loTemp = response.data.main.temp_min;
  let weatherMainPull = response.data.weather[0].main;
  let humidity = response.data.main.humidity;
  let wind = response.data.wind.speed;
  let city = response.data.name;
  let country = response.data.sys.country;
  //update global null variable to include data pulled
  imperialTempCurrent = currentTemp;
  imperialTempHi = hiTemp;
  imperialTempLo = loTemp;
  imperialWind = wind;
  //update HTML based on data pulled, round to integer
  numTempCurrent.innerHTML = Math.round(currentTemp);
  hiTempCurrent.innerHTML = Math.round(hiTemp);
  loTempCurrent.innerHTML = Math.round(loTemp);
  weatherDescriptor.innerHTML = `${weatherMainPull}`;
  humidPercent.innerHTML = Math.round(humidity);
  windSpeed.innerHTML = Math.round(wind);
  currentCity.innerHTML = `${city}, ${country}`;
  emojiUpdate();
}

//associating emoji with 'main' dataset

function emojiUpdate() {
  let weatherEmoji = document.querySelector("#weather-emoji");
  if (weatherDescriptor.innerHTML === `Clear`) {
    weatherEmoji.innerHTML = `🌞`;
  }
  if (weatherDescriptor.innerHTML === `Clouds`) {
    weatherEmoji.innerHTML = `☁`;
  }
  if (
    weatherDescriptor.innerHTML === `Rain` ||
    weatherDescriptor.innerHTML === `Drizzle`
  ) {
    weatherEmoji.innerHTML = `☔`;
  }
  if (
    weatherDescriptor.innerHTML === `Thunderstorm` ||
    weatherDescriptor.innerHTML === `Squall`
  ) {
    weatherEmoji.innerHTML = `⛈`;
  }
  if (weatherDescriptor.innerHTML === `Snow`) {
    weatherEmoji.innerHTML = `❄`;
  }
  if (
    weatherDescriptor.innerHTML === `Mist` ||
    weatherDescriptor.innerHTML === `Haze` ||
    weatherDescriptor.innerHTML === `Fog` ||
    weatherDescriptor.innerHTML === `Smoke` ||
    weatherDescriptor.innerHTML === `Sand` ||
    weatherDescriptor.innerHTML === `Dust` ||
    weatherDescriptor.innerHTML === `Ash`
  ) {
    weatherEmoji.innerHTML = `🌫`;
  }
  if (weatherDescriptor.innerHTML === `Tornado`) {
    weatherEmoji.innerHTML = `🌪`;
  }
}

let currentLocation = document.querySelector(`#current-geoloc-btn`);
currentLocation.addEventListener(`click`, getPosition);

// conversion

function convertToMetric(event) {
  event.preventDefault();
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

let imperialTempCurrent = null; //setting a null variable to be updated using search functions
let imperialTempHi = null;
let imperialTempLo = null;
let imperialWind = null;

let conversionCelsius = document.querySelector(`#conversion`);
conversionCelsius.addEventListener(`click`, convertToMetric);
