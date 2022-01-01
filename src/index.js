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

  let currentDay = days[now.getDay()];
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
let units = `imperial`; //sample

//search function

function pullSearchData(event) {
  event.preventDefault();
  let searchBox = document.querySelector("#search-box");
  let citySearch = searchBox.value;
  citySearch = citySearch.replace(/\s+/g, "%20");
  console.log(citySearch);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&units=${units}&appid=${apiKey}`;
  //  axios.get(apiUrl).then()
}

let searchLocation = document.querySelector("#city-search-btn");
searchLocation.addEventListener("click", pullSearchData);

// current location

function getPosition(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(catchCoords);
}

function catchCoords(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  console.log(lat, lon);
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
  console.log(apiUrl);
  axios.get(apiUrl).then(updateWeatherInfo);
}

function updateWeatherInfo(response) {
  console.log(response.data);
}

let currentLocation = document.querySelector("#current-geoloc-btn");
currentLocation.addEventListener("click", getPosition);
