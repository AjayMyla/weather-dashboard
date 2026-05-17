const apiKey = "ef6962f0b1d0e7af44cdc03f1fcfcec7";

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("city");

searchBtn.addEventListener("click", getWeather);

cityInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") getWeather();
});

// AUTO LOCATION
window.onload = getLocationWeather;

async function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      showLoader(true);
      hideAll();

      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        const data = await res.json();

        if (data.cod != 200) throw new Error();

        updateUI(data);

      } catch {
        showError();
      }

      showLoader(false);
    });
  }
}

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
  document.getElementById("condition").innerText =
    getEmoji(condition) + " " + condition;

  const iconCode = data.weather[0].icon;
  document.getElementById("icon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  updateBackground(condition);
  updateTime(data.timezone);
}

// EMOJI
function getEmoji(condition) {
  switch (condition) {
    case "Clear": return "☀️";
    case "Clouds": return "☁️";
    case "Rain": return "🌧️";
    case "Drizzle": return "🌦️";
    case "Thunderstorm": return "⛈️";
    case "Snow": return "❄️";
    default: return "🌡️";
  }
}

// BACKGROUND + ANIMATION
function updateBackground(condition) {
  const canvas = document.getElementById("rain");
  canvas.style.display = "none";

  if (condition === "Rain" || condition === "Drizzle") {
    document.body.style.background = "linear-gradient(135deg,#4e54c8,#8f94fb)";
    canvas.style.display = "block";
    startRain();
  }
  else if (condition === "Snow") {
    document.body.style.background = "linear-gradient(135deg,#e6dada,#274046)";
    canvas.style.display = "block";
    startSnow();
  }
  else if (condition === "Clouds") {
    document.body.style.background = "linear-gradient(135deg,#bdc3c7,#2c3e50)";
  }
  else {
    document.body.style.background = "linear-gradient(135deg,#f6d365,#fda085)";
  }
}

// TIME
function updateTime(offset) {
  const utc = new Date().getTime() + new Date().getTimezoneOffset() * 60000;
  const cityTime = new Date(utc + offset * 1000);

  document.getElementById("time").innerText =
    "Local Time: " + cityTime.toLocaleTimeString();
}

// LOADER & ERROR
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

// RAIN
function startRain() {
  const canvas = document.getElementById("rain");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let drops = [];

  for (let i = 0; i < 100; i++) {
    drops.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      l: Math.random() * 20
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "rgba(255,255,255,0.5)";

    drops.forEach(d => {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y);
      ctx.lineTo(d.x, d.y + d.l);
      ctx.stroke();

      d.y += 10;
      if (d.y > canvas.height) d.y = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

// SNOW
function startSnow() {
  const canvas = document.getElementById("rain");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let snow = [];

  for (let i = 0; i < 100; i++) {
    snow.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    snow.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();

      s.y += 1;
      if (s.y > canvas.height) s.y = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}
