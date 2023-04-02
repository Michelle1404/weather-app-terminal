import express from "express";
import axios from "axios";
import * as dotenv from "dotenv";
import readline from "readline";

const app = express();

dotenv.config();
const apiKey = process.env.API_KEY;
const port = process.env.PORT || 3001;

const metricUnits = "metric";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter city name: ", (city) => {
  const currentUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${metricUnits}&appid=${apiKey}`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${metricUnits}&appid=${apiKey}`;
  axios
    .get(currentUrl)
    .then((response) => {
      const currentData = response.data;
      const celsius = currentData.main.temp;
      console.log(`It is now ${celsius}°C in ${city}`);
      console.log(
        `The current weather conditions are: ${currentData.weather[0].description}`
      );

      return axios.get(forecastUrl);
    })
    .then((response) => {
      const forecastData = response.data;

      console.log("5-day forecast:");
      for (let i = 0; i < forecastData.list.length; i += 8) {
        const date = new Date(forecastData.list[i].dt * 1000);
        const day = date.toLocaleDateString("en-US", {
          weekday: "short",
        });
        const temperature = forecastData.list[i].main.temp;
        console.log(`${day}: ${temperature}°C`);
      }
    })
    .catch((error) => {
      console.error(error);
    });

  app.listen(port, () => {
    console.log("server running on port:", port);
  });
  rl.close();
});
