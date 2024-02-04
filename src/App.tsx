import "./App.css";
import React, { useState } from "react";

import { fetchWeatherApi } from "openmeteo";
const url = "https://api.open-meteo.com/v1/forecast";

function App() {
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  function getLocation() {
    console.log("Test");
    navigator.geolocation.getCurrentPosition(handleLocation);
  }

  function handleLocation(position: GeolocationPosition) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);

    getWeather(position.coords.latitude, position.coords.longitude);
  }

  async function getWeather(latitude: number, longitude: number) {
    const params = {
      latitude: latitude,
      longitude: longitude,
      current: ["temperature_2m", "precipitation"],
      hourly: "temperature_2m",
      daily: ["temperature_2m_max", "temperature_2m_min"],
      temperature_unit: "fahrenheit",
      wind_speed_unit: "ms",
      timezone: "GMT"
    };

    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    console.log(response);

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    //const timezone = response.timezone();
    //const timezoneAbbreviation = response.timezoneAbbreviation();
    //const latitude = response.latitude();
    //const longitude = response.longitude();

    const daily = response.daily()!;
    console.log(daily);

    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2m: daily.variables(0)!.valuesArray()!,
      },
    };

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      /*   console.log(
        "Hourly Time: " + weatherData.daily.time[i].toISOString(),
        "Temperature: " + weatherData.daily.temperature2m[i]
      ); */
    }
  }

  return (
    <div className="App">
      <button id="GetWeatherButton" onClick={getLocation}>
        Get Weather
      </button>
      <h1>Latitude: {latitude}</h1>
      <h1>Longitude: {longitude}</h1>
    </div>
  );
}

export default App;
