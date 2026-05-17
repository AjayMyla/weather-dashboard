const apiKey = "ef6962f0b1d0e7af44cdc03f1fcfcec7";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") getWeather();
});

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  showLoader(true);
  hideAll();

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    const data = await res.json();

    if (data.cod != 200) throw new Error();

    updateUI(data);

  } catch {
    showError();
  }

  showLoader(false);
}

function updateUI(data) {
  document.getElementById("weather").classList.remove("hidden");

  document.getElementById("cityName").innerText = data.name;
  document.getElementById("temp").innerText = Math.round(data.main.temp) + "°C";

  const condition = data.weather[0].main;
  document.getElementById("condition").innerText = getEmoji(condition) + " " + condition;

  const iconCode = data.weather[0].icon;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  updateBackground(condition);
  updateTime(data.timezone);

  animateCard();
}

function getEmoji(condition) {
  if (condition === "Clear") return "☀️";
  if (condition === "Clouds") return "☁️";
  if (condition === "Rain") return "🌧";
  if (condition === "Thunderstorm") return "⛈";
  if (condition === "Snow") return "❄️";
  return "🌡";
}

function updateBackground(condition) {
  const themes = {
    Clear: "linear-gradient(135deg,#f6d365,#fda085)",
    Clouds: "linear-gradient(135deg,#bdc3c7,#2c3e50)",
    Rain: "linear-gradient(135deg,#4e54c8,#8f94fb)",
    Thunderstorm: "linear-gradient(135deg,#141e30,#243b55)",
    Snow: "linear-gradient(135deg,#e6dada,#274046)"
  };

  document.body.style.background = themes[condition] || themes["Clear"];
}

function updateTime(offset) {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + offset * 1000);

  document.getElementById("time").innerText =
    "Local Time: " + cityTime.toLocaleTimeString();
}

function showLoader(show) {
  document.getElementById("loader").classList.toggle("hidden", !show);
}

function hideAll() {
  document.getElementById("weather").classList.add("hidden");
  document.getElementById("error").classList.add("hidden");
}

function showError() {
  document.getElementById("error").classList.remove("hidden");
}

function animateCard() {
  const card = document.querySelector(".card");
  card.style.transform = "scale(1.05)";
  setTimeout(() => {
    card.style.transform = "scale(1)";
  }, 200);
}