let cityName = '';

function getWeatherForecast() {
    cityName = document.getElementById('search-bar').value;

    // Save the city name to local storage
    saveCityToLocalStorage(cityName);

//had to add in a geocoding api to get the city name and pull lat and lon for the forecast api 

    let geocodingApiKey = "c355757fe1fba0fa738f94ed6b6ff88b";
    let geocodingUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + encodeURIComponent(cityName) + "&limit=1&appid=" + geocodingApiKey;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(geocodingData => {
           if (geocodingData.length > 0) {
                let lat = geocodingData[0].lat;
                let lon = geocodingData[0].lon;

//should have geo code data at this point 

                // use latitude and longitude to get the weather forecast
                let weatherApiKey = "c355757fe1fba0fa738f94ed6b6ff88b";
                let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey;

                fetch(weatherUrl)
                .then(function(response) {
                    return response.json();
                })
                .then(function(weatherData) {
                    // handle the data and update the forecast on the webpage
                    displayWeatherForecast(weatherData);
                    console.log(weatherData);
                    console.log(geocodingData);
                })
                .catch(function(error) {
                    console.error("Error fetching weather data:", error);
                });
            }
        })
        .catch(error => console.error("Error fetching geocoding data:", error));
}

function getForecastForLastCity() {
    // get city name from local storage 
    let lastCitySearched = getLastCityFromLocalStorage();

    if (lastCitySearched) {
        // set the next item for local storage 
        document.getElementById('search-bar').value = lastCitySearched;

        // call get weather forecast 
        getWeatherForecast();
    }
}

function displayWeatherForecast(data) {
    let currentForecastContainer = document.getElementById('current-forecast-container');
    let forecastContainer = document.getElementById('forecast-container');
    currentForecastContainer.innerHTML = ""; // Clear previous content
    forecastContainer.innerHTML = ""; // Clear previous content

    // retrieve the last city name from local storage
    let lastCitySearched = getLastCityFromLocalStorage();

    // show current forecast 
    displayCurrentForecast(data.list[0], currentForecastContainer);

    // show last city searched on front page 
    let lastCityElement = document.getElementById('last-city');
    lastCityElement.innerText = 'Last Searched: ' + lastCitySearched;

    // for loop to run through the list of data, create HTML element and append the data
   //for loop needs to run every 8th index as the array pulls in 40 values, and we need 5 days worth. each 8th index is a new day. 
    for (let i = 0; i < data.list.length; i += 8) {
        let forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card'; // make a class for the forecastCard 

        let kelvinTemp = data.list[i].main.temp;
        let kelvinTempMin = data.list[i].main.temp_min;
        let kelvinTempMax = data.list[i].main.temp_max;

        let fahrenheitTemp = convertKelvinToFahrenheit(kelvinTemp);
        let fahrenheitTempMin = convertKelvinToFahrenheit(kelvinTempMin);
        let fahrenheitTempMax = convertKelvinToFahrenheit(kelvinTempMax);

        forecastCard.innerHTML = `
            <h2>Daily Forecast: ${lastCitySearched} </h2>
            <h3>Date/Time: ${data.list[i].dt_txt}</h3>
            <p>Temperature: ${fahrenheitTemp.toFixed(2)} °F</p>
            <p>Minimum Temperature: ${fahrenheitTempMin.toFixed(2)} °F</p>
            <p>Maximum Temperature: ${fahrenheitTempMax.toFixed(2)} °F</p>
            <p>Wind Speed: ${data.list[i].wind.speed} Miles/Hour</p>
        `;
        forecastContainer.appendChild(forecastCard);
    }
}

function displayCurrentForecast(currentData, container) {
    let kelvinTemp = currentData.main.temp;
    let kelvinTempMin = currentData.main.temp_min;
    let kelvinTempMax = currentData.main.temp_max;

    let fahrenheitTemp = convertKelvinToFahrenheit(kelvinTemp);
    let fahrenheitTempMin = convertKelvinToFahrenheit(kelvinTempMin);
    let fahrenheitTempMax = convertKelvinToFahrenheit(kelvinTempMax);

    let currentForecastCard = document.createElement('div');
    currentForecastCard.className = 'forecast-card'; // assign class for CURRENT forecast card 

    currentForecastCard.innerHTML = `
        <h1>Current Forecast: ${cityName} </h1>
        <p>Temperature: ${fahrenheitTemp.toFixed(2)} °F</p>
        <p>Minimum Temperature: ${fahrenheitTempMin.toFixed(2)} °F</p>
        <p>Maximum Temperature: ${fahrenheitTempMax.toFixed(2)} °F</p>
        <p>Wind Speed: ${currentData.wind.speed} Miles/Hour</p>
    `;
    container.appendChild(currentForecastCard);

}

function convertKelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}

function saveCityToLocalStorage(city) {
//check local storage
    if (typeof (Storage) !== "undefined") {
        // save the city name to local storage
        localStorage.setItem('lastCitySearched', city);
    }
}

function getLastCityFromLocalStorage() {
    // check if local storage is supported
    if (typeof (Storage) !== "undefined") {
        // retrieve city name from local storage
        return localStorage.getItem('lastCitySearched');
    }
    return null;
}

function displayLastCity() {
    let lastCitySearched = getLastCityFromLocalStorage();
    let lastCityElement = document.getElementById('last-city');

    if (lastCitySearched) {
        // show the last city on the webpage
        lastCityElement.innerText = 'Last Searched: ' + lastCitySearched;
    } else {
        // show a message when there is no last searched city
        lastCityElement.innerText = 'No last searched city';
    }
}

// show last city searched when page loads. 
displayLastCity();
