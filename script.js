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