import "./App.css";
import "./App.scss";
import React, { useState } from "react";

import ClearSky from "./Weather Icons/wi-day-sunny.svg";
import MainlyClear from "./Weather Icons/wi-day-cloudy.svg";
import PartlyCloudy from "./Weather Icons/wi-cloud.svg";
import Overcast from "./Weather Icons/wi-cloudy.svg";

import Fog from "./Weather Icons/wi-fog.svg";
import RimeFog from "./Weather Icons/wi-fog.svg";

import LightDrizzle from "./Weather Icons/wi-day-rain.svg";
import ModerateDrizzle from "./Weather Icons/wi-day-rain.svg";
import DenseDrizzle from "./Weather Icons/wi-day-rain.svg";
import LightFreezeDrizzle from "./Weather Icons/wi-day-rain.svg";
import DenseFreezeDrizzle from "./Weather Icons/wi-day-rain.svg";

import SlightRain from "./Weather Icons/wi-day-rain.svg";
import ModerateRain from "./Weather Icons/wi-day-rain.svg";
import HeavyRain from "./Weather Icons/wi-day-rain.svg";
import LightFreezingRain from "./Weather Icons/wi-day-rain.svg";
import HeavyFreezingRain from "./Weather Icons/wi-day-rain.svg";

import SlightSnow from "./Weather Icons/wi-snow.svg";
import ModerateSnow from "./Weather Icons/wi-snow.svg";
import HeavySnow from "./Weather Icons/wi-snow.svg";
import Snowgrain from "./Weather Icons/wi-snow.svg";

import SlightRainShowers from "./Weather Icons/wi-day-rain.svg";
import ModerateRainShowers from "./Weather Icons/wi-day-rain.svg";
import ViolentRainShowers from "./Weather Icons/wi-day-rain.svg";
import SlightSnowShowers from "./Weather Icons/wi-snow.svg";
import HeavySnowShowers from "./Weather Icons/wi-snow.svg";

import Thunderstorm from "./Weather Icons/wi-thunderstorm.svg";
import ThunderstormSlightHail from "./Weather Icons/wi-thunderstorm.svg";
import ThunderstormHeavyHail from "./Weather Icons/wi-thunderstorm.svg";

import Wind from "./Weather Icons/wi-strong-wind.svg";
import Raindrop from "./Weather Icons/wi-raindrops.svg";

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
  99: "Thunderstorm with heavy hail",
};

const getWeatherIcon = (wmoCode: number | undefined) => {
  switch (wmoCode) {
    case 0:
      return ClearSky;
    case 1:
      return MainlyClear;
    case 2:
      return PartlyCloudy;
    case 3:
      return Overcast;
    case 45:
      return Fog;
    case 48:
      return RimeFog;
    case 51:
      return LightDrizzle;
    case 53:
      return ModerateDrizzle;
    case 55:
      return DenseDrizzle;
    case 56:
      return LightFreezeDrizzle;
    case 57:
      return DenseFreezeDrizzle;
    case 61:
      return SlightRain;
    case 63:
      return ModerateRain;
    case 65:
      return HeavyRain;
    case 66:
      return LightFreezingRain;
    case 67:
      return HeavyFreezingRain;
    case 71:
      return SlightSnow;
    case 73:
      return ModerateSnow;
    case 75:
      return HeavySnow;
    case 77:
      return Snowgrain;
    case 80:
      return SlightRainShowers;
    case 81:
      return ModerateRainShowers;
    case 82:
      return ViolentRainShowers;
    case 85:
      return SlightSnowShowers;
    case 86:
      return HeavySnowShowers;
    case 95:
      return Thunderstorm;
    case 96:
      return ThunderstormSlightHail;
    case 99:
      return ThunderstormHeavyHail;
    default:
      return ""; // Return a default icon or handle unknown WMO codes accordingly
  }
};

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

/*
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
*/
interface WeeklyForecastDataItem {
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

type WeeklyForecastData = WeeklyForecastDataItem[];

function App() {
  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);
  const [todaysWeatherData, setTodaysWeatherData] = useState<
    TodaysWeatherData | undefined
  >(undefined);
  const [weeklyForecastData, setWeeklyForecastData] = useState<
  WeeklyForecastData | undefined
  >(undefined);

  function getLocation() {
    navigator.geolocation.getCurrentPosition(handleLocation);
  }

  function handleLocation(position: GeolocationPosition) {
    setLatitude(position.coords.latitude);
    setLongitude(position.coords.longitude);
    //getWeather(latitude, longitude);
     getWeather(position.coords.latitude, position.coords.longitude);
  }

  async function getWeather(
    latitude: number | undefined,
    longitude: number | undefined
  ) {
    if (latitude && longitude) {
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
          "weather_code",
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
          "weather_code",
        ],
        temperature_unit: "fahrenheit",
        wind_speed_unit: "ms",
        timezone: "MST",
      };

      const responses = await fetchWeatherApi(url, params);

      const range = (start: number, stop: number, step: number) =>
        Array.from(
          { length: (stop - start) / step },
          (_, i) => start + i * step
        );

      const response = responses[0];

      const utcOffsetSeconds = response.utcOffsetSeconds();
      const current = response.current()!;
      const daily = response.daily()!;

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

      const convertDailyWeatherToArray = weatherData.daily.time.map((timestamp, index) => ({
        time: new Date(timestamp),
        temperature2mMax: Number(weatherData.daily.temperature2mMax[index]),
        temperature2mMin: Number(weatherData.daily.temperature2mMin[index]),
        apparentTemperatureMax: Number(weatherData.daily.apparentTemperatureMax[index]),
        apparentTemperatureMin: Number(weatherData.daily.apparentTemperatureMin[index]),
    /*    sunrise: Number(weatherData.daily.sunrise[index]),
        sunset: Number(weatherData.daily.sunset[index]), */
        precipitationSum: Number(weatherData.daily.precipitationSum[index]),
        rainSum: Number(weatherData.daily.rainSum[index]),
        showersSum: Number(weatherData.daily.showersSum[index]),
        snowfallSum: Number(weatherData.daily.snowfallSum[index]),
        precipitationHours: Number(weatherData.daily.precipitationHours[index]),
        precipitationProbabilityMax: Number(weatherData.daily.precipitationProbabilityMax[index]),
        windSpeed10mMax: Number(weatherData.daily.windSpeed10mMax[index]),
        weatherCode: Number(weatherData.daily.weather_code[index])
      }));
      
      console.log(convertDailyWeatherToArray);

      const Test: WeeklyForecastData = convertDailyWeatherToArray;
      setWeeklyForecastData(convertDailyWeatherToArray);
      /*
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
        summary: weatherData.daily.weather_code,
      });
      */
      
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

  function convertWMO(code: number | undefined) {
    return WMO_CODES[code as keyof typeof WMO_CODES];
  }
  /*
    {weeklyForecastData?.map((item,index)=>{

        })}

           {Object.entries(weeklyForecastData).map(([key, values]) => (
            <div key={key}>
              <h3>{key}</h3>
            </div>
          ))}
        */
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

    </div>
  );
}

export default App;
