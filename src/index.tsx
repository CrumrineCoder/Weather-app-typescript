import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { fetchWeatherApi } from "openmeteo";
const url = "https://api.open-meteo.com/v1/forecast";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

let latitude: number | undefined;
let longitude: number | undefined;

function handleLocation(position: GeolocationPosition) {
  latitude = position.coords.latitude;
  longitude = position.coords.longitude;
  if (latitude && longitude) {
    getWeather(latitude, longitude);
  }
}

navigator.geolocation.getCurrentPosition(handleLocation);

console.log(latitude);

async function getWeather(latitude: number, longitude: number) {
  console.log("Test");
  const params = {
    latitude: latitude,
    longitude: longitude,
    hourly: "temperature_2m",
  };

  const responses = await fetchWeatherApi(url, params);

  // Helper function to form time ranges
  const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

  // Process first location. Add a for-loop for multiple locations or weather models
  const response = responses[0];

  // Attributes for timezone and location
  const utcOffsetSeconds = response.utcOffsetSeconds();
  const timezone = response.timezone();
  const timezoneAbbreviation = response.timezoneAbbreviation();
  //const latitude = response.latitude();
  //const longitude = response.longitude();

  const hourly = response.hourly()!;

  // Note: The order of weather variables in the URL query and the indices below need to match!
  const weatherData = {
    hourly: {
      time: range(
        Number(hourly.time()),
        Number(hourly.timeEnd()),
        hourly.interval()
      ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
      temperature2m: hourly.variables(0)!.valuesArray()!,
    },
  };

  // `weatherData` now contains a simple structure with arrays for datetime and weather data
  for (let i = 0; i < weatherData.hourly.time.length; i++) {
    console.log(
      "Hourly Time: " + weatherData.hourly.time[i].toISOString(),
      "Temperature: " + weatherData.hourly.temperature2m[i]
    );
  }
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
