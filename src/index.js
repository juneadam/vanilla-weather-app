//clock

function displayTime() {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wed",
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

//search

let apiKey = "0588a097340959e1dcf00479a90c9866"; //api key for openweathermap.org
console.log(apiKey);

//api.openweathermap.org/data/2.5/weather?q={city name}&appid=${apiKey}

function getPosition(event) {
  event.preventDefault();
  console.log(searchBox.value);
}

let searchLocation = document.querySelector("#city-search-btn");
searchLocation.addEventListener("click", getPosition);

let currentLocation = document.querySelector("#current-geoloc-btn");
currentLocation.addEventListener("click", getPosition);

let searchBox = document.querySelector("#search-box");
