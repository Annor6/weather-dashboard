const apiKey = "My API";

const searchBtn = document.getElementById("searchBtn");

searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city !== "") {
    getWeather(city);
    getForecast(city);
  }
});

// Current weather
async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.cod === "404") {
      alert("City not found!");
      return;
    }

    displayWeather(data);
    updateBackground(data.weather[0].main);
  } catch (error) {
    console.error("Error fetching weather:", error);
    alert("Error fetching weather. Try again later.");
  }
}

function displayWeather(data) {
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temperature").textContent =
    `Temperature: ${data.main.temp} °C`;
  document.getElementById("description").textContent =
    `Condition: ${data.weather[0].description}`;
  document.getElementById("humidity").textContent =
    `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent =
    `Wind Speed: ${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  document.getElementById("weatherIcon").src = iconUrl;
}

// 5-day forecast
async function getForecast(city) {
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Filter to 12:00pm each day
    const daily = data.list.filter(item => item.dt_txt.includes("12:00:00"));
    displayForecast(daily);
  } catch (error) {
    console.error("Error fetching forecast:", error);
  }
}

function displayForecast(daily) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  daily.forEach(day => {
    const card = document.createElement("div");
    card.className = "forecast-card";

    const date = new Date(day.dt_txt);
    const options = { weekday: "short" };
    const dayName = date.toLocaleDateString(undefined, options);

    const iconUrl = `https://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

    card.innerHTML = `
      <p>${dayName}</p>
      <img src="${iconUrl}" width="50"/>
      <p>${Math.round(day.main.temp)}°C</p>
    `;
    forecastContainer.appendChild(card);
  });
}

// Change background based on weather
function updateBackground(weather) {
  const body = document.body;
  switch (weather) {
    case "Clear":
      body.style.background = "#f7d358"; // sunny yellow
      break;
    case "Clouds":
      body.style.background = "#d3d3d3"; // gray
      break;
    case "Rain":
    case "Drizzle":
      body.style.background = "#5dade2"; // blue
      break;
    case "Thunderstorm":
      body.style.background = "#566573"; // dark gray
      break;
    case "Snow":
      body.style.background = "#ffffff"; // white
      break;
    default:
      body.style.background = "#e3f2fd"; // default
      break;
  }
}