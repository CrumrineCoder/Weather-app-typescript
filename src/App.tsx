import "./App.css";
import React, { useState } from "react";

import { fetchWeatherApi } from "openmeteo";
const url = "https://api.open-meteo.com/v1/forecast";

const WMO_CODES = {
  0: "Clear Sky",
  1: "Mainly Clear",
  2: "Partly Cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing Rime Fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail"
}

interface TodaysWeatherData {
  currentTemperature?: number;
  currentHumidity?: number;
  apparentTemperature?: number;
  precipitation?: number;
  rain?: number;
  showers?: number;
  snowfall?: number;
  windSpeed?: number;
  summary?: Float32Array | undefined;
}

interface WeeklyForecastData {
  temperatureMax?: Float32Array | undefined;
  temperatureMin?: Float32Array | undefined;
  apparentTemperatureMax?: Float32Array | undefined;
  apparentTemperatureMin?: Float32Array | undefined;
  sunrise?: Float32Array | undefined;
  sunset?: Float32Array | undefined;
  precipitationSum?: Float32Array | undefined;
  rainSum?: Float32Array | undefined;
  showersSum?: Float32Array | undefined;
  precipitationHours?: Float32Array | undefined;
  precipitationProbabilityMax?: Float32Array | undefined;
  windspeed?: Float32Array | undefined;
  summary?: Float32Array | undefined;
}

function App() {
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [todaysWeatherData, setTodaysWeatherData] = useState<
    TodaysWeatherData | undefined
  >(undefined);
  const [weeklyForecastData, setWeeklyForecastData] = useState<
    WeeklyForecastData | undefined
  >(undefined);

  /*
  const [currentDate, setCurrentDate] = useState<number | undefined>(undefined);
  const [currentTemperature, setCurrentTemperature] = useState<number | undefined>(undefined);
  const [currentHumidity, setCurrentHumidity] = useState<number | undefined>(undefined);
  const [currentApparentTemperature, setCurrentApparentTemperature] = useState<number | undefined>(undefined);
  const [currentPrecipitation, setCurrentPrecipitation] = useState<number | undefined>(undefined);
  const [currentTermperature, setCurrentTemperature] = useState<number | undefined>(undefined);
  const [currentTermperature, setCurrentTemperature] = useState<number | undefined>(undefined);
  const [currentTermperature, setCurrentTemperature] = useState<number | undefined>(undefined);
  const [currentTermperature, setCurrentTemperature] = useState<number | undefined>(undefined);
  const [currentTermperature, setCurrentTemperature] = useState<number | undefined>(undefined);
  const [currentTermperature, setCurrentTemperature] = useState<number | undefined>(undefined);
*/

  function getLocation() {
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
      current: [
        "temperature_2m",
        "relative_humidity_2m",
        "apparent_temperature",
        "precipitation",
        "rain",
        "showers",
        "snowfall",
        "wind_speed_10m",
        "weather_code"
      ],
      daily: [
        "temperature_2m_max",
        "temperature_2m_min",
        "apparent_temperature_max",
        "apparent_temperature_min",
        "sunrise",
        "sunset",
        "precipitation_sum",
        "rain_sum",
        "showers_sum",
        "snowfall_sum",
        "precipitation_hours",
        "precipitation_probability_max",
        "wind_speed_10m_max",
        "weather_code"
      ],
      temperature_unit: "fahrenheit",
      wind_speed_unit: "ms",
      timezone: "MST",
    };

    const responses = await fetchWeatherApi(url, params);

    // Helper function to form time ranges
    const range = (start: number, stop: number, step: number) =>
      Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

    // Process first location. Add a for-loop for multiple locations or weather models
    const response = responses[0];

    // Attributes for timezone and location
    const utcOffsetSeconds = response.utcOffsetSeconds();
    //const timezone = response.timezone();
    //const timezoneAbbreviation = response.timezoneAbbreviation();
    //const latitude = response.latitude();
    //const longitude = response.longitude();

    const current = response.current()!;
    const daily = response.daily()!;
    // Note: The order of weather variables in the URL query and the indices below need to match!
    const weatherData = {
      current: {
        time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
        temperature2m: current.variables(0)!.value(),
        relativeHumidity2m: current.variables(1)!.value(),
        apparentTemperature: current.variables(2)!.value(),
        precipitation: current.variables(3)!.value(),
        rain: current.variables(4)!.value(),
        showers: current.variables(5)!.value(),
        snowfall: current.variables(6)!.value(),
        windSpeed10m: current.variables(7)!.value(),
        weather_code: daily.variables(8)!.valuesArray()!,
      },
      daily: {
        time: range(
          Number(daily.time()),
          Number(daily.timeEnd()),
          daily.interval()
        ).map((t) => new Date((t + utcOffsetSeconds) * 1000)),
        temperature2mMax: daily.variables(0)!.valuesArray()!,
        temperature2mMin: daily.variables(1)!.valuesArray()!,
        apparentTemperatureMax: daily.variables(2)!.valuesArray()!,
        apparentTemperatureMin: daily.variables(3)!.valuesArray()!,
        sunrise: daily.variables(4)!.valuesArray()!,
        sunset: daily.variables(5)!.valuesArray()!,
        precipitationSum: daily.variables(6)!.valuesArray()!,
        rainSum: daily.variables(7)!.valuesArray()!,
        showersSum: daily.variables(8)!.valuesArray()!,
        snowfallSum: daily.variables(9)!.valuesArray()!,
        precipitationHours: daily.variables(10)!.valuesArray()!,
        precipitationProbabilityMax: daily.variables(11)!.valuesArray()!,
        windSpeed10mMax: daily.variables(12)!.valuesArray()!,
        weather_code: daily.variables(13)!.valuesArray()!,
      },
    };

    setTodaysWeatherData({
      currentTemperature: weatherData.current.temperature2m,
      currentHumidity: weatherData.current.relativeHumidity2m,
      apparentTemperature: weatherData.current.apparentTemperature,
      precipitation: weatherData.current.precipitation,
      rain: weatherData.current.rain,
      showers: weatherData.current.showers,
      snowfall: weatherData.current.snowfall,
      windSpeed: weatherData.current.windSpeed10m,
      summary: weatherData.current.weather_code,
    });

    setWeeklyForecastData({
      temperatureMax: weatherData.daily.temperature2mMax,
      temperatureMin: weatherData.daily.temperature2mMin,
      apparentTemperatureMax: weatherData.daily.apparentTemperatureMax,
      apparentTemperatureMin: weatherData.daily.apparentTemperatureMin,
      sunrise: weatherData.daily.sunrise,
      sunset: weatherData.daily.sunset,
      precipitationSum: weatherData.daily.precipitationSum,
      rainSum: weatherData.daily.rainSum,
      showersSum: weatherData.daily.showersSum,
      precipitationHours: weatherData.daily.precipitationHours,
      precipitationProbabilityMax:
        weatherData.daily.precipitationProbabilityMax,
      windspeed: weatherData.daily.windSpeed10mMax,
      summary: weatherData.daily.weather_code
    });

    // `weatherData` now contains a simple structure with arrays for datetime and weather data
    for (let i = 0; i < weatherData.daily.time.length; i++) {
      console.log(
        weatherData.daily.time[i].toISOString(),
        weatherData.daily.temperature2mMax[i],
        weatherData.daily.temperature2mMin[i],
        weatherData.daily.apparentTemperatureMax[i],
        weatherData.daily.apparentTemperatureMin[i],
        /*
        weatherData.daily.sunrise[i],
        weatherData.daily.sunset[i],
        */
        weatherData.daily.precipitationSum[i],
        weatherData.daily.rainSum[i],
        weatherData.daily.showersSum[i],
        weatherData.daily.snowfallSum[i],
        weatherData.daily.precipitationHours[i],
        weatherData.daily.precipitationProbabilityMax[i],
        weatherData.daily.windSpeed10mMax[i],
        weatherData.daily.weather_code[i],
      );
    }
  }

  function getTemperatureId(temperature: number | undefined) {
    if (temperature === undefined) {
      return;
    }
    if (temperature < 0) {
      return "#D7FFF7";
    } else if (temperature < 9) {
      return "#C9FFF7";
    } else if (temperature < 19) {
      return "#BDFFF7";
    } else if (temperature < 29) {
      return "#AAFFF7";
    } else if (temperature < 39) {
      return "#86FFE6";
    } else if (temperature < 49) {
      return "#61FFBE";
    } else if (temperature < 59) {
      return "#55FF8C";
    } else if (temperature < 69) {
      return "#4AFF6A";
    } else if (temperature < 79) {
      return "#40DE40";
    } else if (temperature < 85) {
      return "#C6FF3E";
    } else if (temperature < 90) {
      return "#FFF744";
    } else if (temperature < 95) {
      return "#FFC92B";
    } else if (temperature < 100) {
      return "#FF9036";
    } else if (temperature >= 100) {
      return "#FF5337";
    }
  }

  function convertWMO(code: number | undefined){
      return WMO_CODES[code as keyof typeof WMO_CODES];
  }
  return (
    <div
      className="App"
      style={{
        backgroundColor: getTemperatureId(
          todaysWeatherData?.apparentTemperature
        ),
      }}
    >
      <button id="GetWeatherButton" onClick={getLocation}>
        Get Weather
      </button>
      <h1>Latitude: {latitude}</h1>
      <h1>Longitude: {longitude}</h1>
      <h1> Today: </h1>
      <h3>Current Temperature: {todaysWeatherData?.currentTemperature}</h3>
      <h3>Feels like: {todaysWeatherData?.apparentTemperature}</h3>
      <h3>Humidity: {todaysWeatherData?.currentHumidity}</h3>
      <h3>Precipitation: {todaysWeatherData?.precipitation}</h3>
      <h3>Rain: {todaysWeatherData?.rain}</h3>
      <h3>Showers: {todaysWeatherData?.showers}</h3>
      <h3>Snowfall: {todaysWeatherData?.snowfall}</h3>
      <h3>Wind Speed: {todaysWeatherData?.windSpeed}</h3>
      <h3>Today's Weather Code: {convertWMO(todaysWeatherData?.summary?.[0])}</h3>

      <h3>Tomorrow's Maximum: {weeklyForecastData?.temperatureMax?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Minimum: {weeklyForecastData?.temperatureMin?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Apparent Temperature Max: {weeklyForecastData?.apparentTemperatureMax?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Apparent Temperature Min: {weeklyForecastData?.apparentTemperatureMin?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Precipitation Sum: {weeklyForecastData?.precipitationSum?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Rain Sum: {weeklyForecastData?.rainSum?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Showers Sum: {weeklyForecastData?.showersSum?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Precipitation Hours: {weeklyForecastData?.precipitationHours?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Probability Max: {weeklyForecastData?.precipitationProbabilityMax?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Wind Speed: {weeklyForecastData?.windspeed?.[0] ?? "N/A"}</h3>
      <h3>Tomorrow's Weather Code: {convertWMO(weeklyForecastData?.summary?.[0])}</h3>
      <h3>Day After's Weather Code: {convertWMO(weeklyForecastData?.summary?.[1])}</h3>
      <h3>Day After After's Weather Code: {convertWMO(weeklyForecastData?.summary?.[2])}</h3>
    </div>
  );
}

export default App;
