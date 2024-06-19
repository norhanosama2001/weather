"ues strict";
let navLinks = document.querySelectorAll(
  "header .navbar .collapse ul .nav-item .nav-link"
);

for (let i = 0; i < navLinks.length; i++) {
  navLinks[i].addEventListener("click", function (e) {
    for (let i = 0; i < navLinks.length; i++) {
      if (navLinks[i].classList.contains("active")) {
        navLinks[i].classList.remove("active");
      }
    }
    e.target.classList.add("active");
  });
}

// Get Day and Month
let monthNames = [
  "Jan",
  "Feb",
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
let daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
let currentDate = new Date();
let dayOfWeek = currentDate.getDay();
let currentDay = currentDate.getDate();
let currentMonth = monthNames[currentDate.getMonth()];

// Get City
let cityName = [];
let cityData = {};
let cityLocation = {};
let cityCurrent = {};
let cityForecast = [];
let inputCitySearch = document.querySelector(
  "#home .container .input-group .form-control"
);
let row = document.querySelector("#home .container .row");
let ul = document.querySelector("#home .container .search ul");

async function searchCity(city) {
  let request = await fetch(
    `https://api.weatherapi.com/v1/search.json?key=3c384779a9514051a81145603240801&q=${city}`
  );
  request = await request.json();
  cityName = request;
}

async function getCityData(city) {
  let request = await fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=3c384779a9514051a81145603240801&q=${city}&days=3`
  );
  request = await request.json();
  cityData = request;
  cityLocation = cityData.location;
  cityCurrent = cityData.current;
  cityForecast = cityData.forecast.forecastday;
}

function clearUl() {
  let li = document.querySelectorAll("#home .container .search ul li");
  for (let i = 0; i < li.length; i++) {
    li[i].addEventListener("click", async function (e) {
      inputCitySearch.value = e.target.innerHTML;
      await getCityData(e.target.innerHTML);
      ul.innerHTML = "";
      displayData();
    });
  }
}

function getSerchResults() {
  let col = "";
  for (let i = 0; i < cityName.length; i++) {
    col += `
  <li class="p-3 border-bottom bg-dark  rounded-3 w-75 m-auto">${cityName[i].name} - ${cityName[i].country}</li>`;
  }
  ul.innerHTML = col;
}

inputCitySearch.addEventListener("keyup", async function () {
  await searchCity(inputCitySearch.value);
  await getSerchResults();
  clearUl();
});

function displayData() {
  row.innerHTML = `<div class="col-lg-4 p-0 overflow-hidden text-center">
  <div class="inner">
    <div
      class="date d-flex px-3 py-2 align-items-center justify-content-between bg-opacity-50 bg-dark"
    >
      <p class="m-0">${daysOfWeek[dayOfWeek]}</p>
      <p class="m-0">${currentDay} ${currentMonth}</p>
    </div>
    <p class="py-3 fs-1">${cityLocation.name}</p>
    <p class="temp fw-bold">${cityCurrent.temp_c} &deg;C </p>
    <img src="${
      cityCurrent.condition.icon
    }" alt="weather icon" class="w-25 m-auto">
    <p class="py-3 condition">${cityCurrent.condition.text}</p>
    <ul
      class="list-unstyled d-flex align-items-center justify-content-evenly"
    >
      <li>
        <i class="fa-solid fa-umbrella"></i
        ><span class="ms-2">${cityCurrent.humidity} %</span>
      </li>
      <li>
        <i class="fa-solid fa-wind"></i
        ><span class="ms-2">${cityCurrent.wind_kph} KM/hr</span>
      </li>
      <li>
        <i class="fa-solid fa-compass"></i
        ><span class="ms-2">${cityCurrent.wind_dir}</span>
      </li>
    </ul>
  </div>
</div>
<div class="col-lg-4 p-0 overflow-hidden text-center">
  <div class="inner">
    <div
      class="date  px-3 py-2 text-center bg-opacity-50 bg-dark"
    >
      <p class="m-0">${daysOfWeek[dayOfWeek + 1]}</p>
    </div>
    <img src="${
      cityForecast[1].day.condition.icon
    }" alt="weather icon" class="w-25 m-auto mt-5">
    <p class="py-3  fs-1">${cityForecast[1].day.maxtemp_c} &deg;C</p>
    <p class="fs-4">${cityForecast[1].day.mintemp_c} &deg;C</p>
    <p class="py-3 condition">${cityForecast[1].day.condition.text}</p>
  </div>
</div>
<div class="col-lg-4 p-0 overflow-hidden text-center">
  <div class="inner">
    <div
      class="date  px-3 py-2 text-center bg-opacity-50 bg-dark"
    >
      <p class="m-0">${daysOfWeek[dayOfWeek + 2]}</p>
    </div>
    <img src="${
      cityForecast[2].day.condition.icon
    }" alt="weather icon" class="w-25 m-auto mt-5">
    <p class="py-3  fs-1">${cityForecast[2].day.maxtemp_c} &deg;C</p>
    <p class="fs-4">${cityForecast[2].day.mintemp_c} &deg;C</p>
    <p class="py-3 condition">${cityForecast[2].day.condition.text}</p>
  </div>
</div>`;
}

// Get user location then search for city data then display it
navigator.geolocation.getCurrentPosition(function (position) {
 let cityLocation = position.coords.latitude + "," + position.coords.longitude;
  (async function () {
    await searchCity(cityLocation);
    await getCityData(cityName[0].name);
    displayData();
  })();
});
