const weatherInfoSection = document.querySelector(".Weather-info");
const cityInput = document.querySelector(".input-city");
const searchBtn = document.querySelector(".search-btn");

const countryTxt = document.querySelector(".country-txt");
const temptxt = document.querySelector(".temp");
const cloudtxt = document.querySelector(".cloud-txt");
const humidityTxt = document.querySelector(".humidity-p");
const windSpeedTxt = document.querySelector(".wind-speed");
const weatherSummaryimg = document.querySelector(".weather-summary-img");
const currentdateTxt = document.querySelector(".current-date");

const sidebar = document.querySelector(".sidebar");
const hamburgerMenu = document.querySelector(".hamburger-menu");
const closeMenu = document.querySelector(".close");

const updateForecastItemsContainere = document.querySelector(".future-pre");

apiKey = `Enter Your Api`;

function showsidebar() {
  sidebar.style.display = "block";
  hamburgerMenu.style.display = "none";
  closeMenu.style.display = "block";
}

function closesidebar() {
  sidebar.style.display = "none";
  hamburgerMenu.style.display = "block";
  closeMenu.style.display = "none";
}

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getfetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  try {
    const response = await fetch(apiUrl);
    console.log(response);
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error.message);
    return null;
  }
}

function weatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";
  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

async function updateWeatherInfo(city) {
  const weatherData = await getfetchData("weather", city);
  if (!weatherData) return;

  console.log(weatherData);

  const {
    name: cityName,
    sys: { country, sunrise, sunset },
    main: {
      temp,
      feels_like,
      temp_min,
      temp_max,
      pressure,
      humidity,
      sea_level,
      grnd_level,
    },
    weather: [{ id, main: weatherMain, description, icon }],
    wind: { speed: windSpeed, deg: windDeg, gust: windGust },
    clouds: { all: cloudiness },
  } = weatherData;

  countryTxt.textContent = cityName + ", " + country;
  temptxt.textContent = Math.round(temp) + "°C";
  cloudtxt.textContent = weatherMain;
  humidityTxt.textContent = humidity + "%";
  windSpeedTxt.textContent = Math.round(windSpeed * 3.6) + " km/h";
  currentdateTxt.textContent = new Date().toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
  weatherSummaryimg.src = `assets/img/${weatherIcon(id)}`;

  await updateForecastsInfo(city);
}

async function updateForecastsInfo(city) {
  const forecastsData = await getfetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  updateForecastItemsContainere.innerHTML = "";
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItem(forecastWeather);
    }
  });
}

function updateForecastItem(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: `2-digit`,
    month: `short`,
  };
  const dateResult = dateTaken.toLocaleDateString("en-IN", dateOption);

  const forecastItem = `
            <div class="forcast-box">
              <div class="date-txt">
                <h6 class="forcast-txt">${dateResult}</h6>
              </div>
              <div class="predicted-img">
                <img src="assets/img/${weatherIcon(id)}" class="thunderstorms">
              </div>
              <div class="degree">
                <h6 class="degree-txt">${Math.round(temp)}°C</h6>
              </div>
            </div>
    `;

  updateForecastItemsContainere.insertAdjacentHTML("beforeend", forecastItem);
}

