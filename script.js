const apiKey = "93624b83dfcbab91aa1c00ac6fd7e974";

const searchBtn = document.getElementById("searchBtn");
const themeToggle = document.getElementById("themeToggle");

// ==========================
// Load last searched city
// ==========================
window.addEventListener("load", () => {
  const lastCity = localStorage.getItem("lastCity");
  const savedTheme = localStorage.getItem("theme");

  if (lastCity) {
    document.getElementById("cityInput").value = lastCity; // <-- NEW LINE
    getWeather(lastCity);
    getForecast(lastCity);
  }

  if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
    themeToggle.textContent = "☀ Light Mode";
  }
});

// ==========================
// Search Weather
// ==========================
searchBtn.addEventListener("click", () => {
  const city = document.getElementById("cityInput").value.trim();
  if (city !== "") {
    getWeather(city);
    getForecast(city);

    // Save city
    localStorage.setItem("lastCity", city);
  }
});
document.getElementById("cityInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// ==========================
// Dark Mode Toggle
// ==========================
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀ Light Mode";
    localStorage.setItem("theme", "dark");
  } else {
    themeToggle.textContent = "🌙 Dark Mode";
    localStorage.setItem("theme", "light");
  }
});

// ==========================
// Current Weather
// ==========================
async function getWeather(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod != 200) {
      alert("City not found!");
      return;
    }

    displayWeather(data);
    updateBackground(data.weather[0].main);

  } catch (error) {
    alert("Error fetching weather data.");
    console.log(error);
  }
}

function displayWeather(data) {
  document.getElementById("cityName").textContent = data.name;
  document.getElementById("temperature").textContent =
    `${Math.round(data.main.temp)}°C`;
  document.getElementById("description").textContent =
    data.weather[0].description;
  document.getElementById("humidity").textContent =
    `Humidity: ${data.main.humidity}%`;
  document.getElementById("wind").textContent =
    `Wind: ${data.wind.speed} m/s`;

  const iconCode = data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// ==========================
// Forecast
// ==========================
async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod != "200") {
      return;
    }

    const daily = data.list.filter(item =>
      item.dt_txt.includes("12:00:00")
    );

    displayForecast(daily);

  } catch (error) {
    console.log(error);
  }
}

function displayForecast(days) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";

  days.forEach(day => {
    const date = new Date(day.dt_txt);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

    const card = document.createElement("div");
    card.className = "forecast-card";

    card.innerHTML = `
      <p>${dayName}</p>
      <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png">
      <p>${Math.round(day.main.temp)}°C</p>
    `;

    forecastContainer.appendChild(card);
  });
}

// ==========================
// Background Change
// ==========================
function updateBackground(weather) {
  if (document.body.classList.contains("dark-mode")) return;

  switch (weather) {
    case "Clear":
      document.body.style.background = "linear-gradient(to right, #f7971e, #ffd200)";
      break;
    case "Clouds":
      document.body.style.background = "linear-gradient(to right, #bdc3c7, #2c3e50)";
      break;
    case "Rain":
    case "Drizzle":
      document.body.style.background = "linear-gradient(to right, #4b79a1, #283e51)";
      break;
    case "Thunderstorm":
      document.body.style.background = "linear-gradient(to right, #141E30, #243B55)";
      break;
    case "Snow":
      document.body.style.background = "linear-gradient(to right, #e6dada, #274046)";
      break;
    default:
      document.body.style.background = "linear-gradient(to right, #4facfe, #00f2fe)";
  }
}