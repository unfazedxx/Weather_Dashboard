let cityName = '';

function getWeatherForecast() {
    cityName = document.getElementById('search-bar').value;

    // Save the city name to local storage
    saveCityToLocalStorage(cityName);

    // Fetching latitude and longitude using Geocoding API
    let geocodingApiKey = "c355757fe1fba0fa738f94ed6b6ff88b";
    let geocodingUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + encodeURIComponent(cityName) + "&limit=1&appid=" + geocodingApiKey;

    fetch(geocodingUrl)
        .then(response => response.json())
        .then(geocodingData => {
            if (geocodingData.length > 0) {
                let lat = geocodingData[0].lat;
                let lon = geocodingData[0].lon;

                // Fetching weather forecast using latitude and longitude
                let weatherApiKey = "c355757fe1fba0fa738f94ed6b6ff88b";
                let weatherUrl = "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + lon + "&appid=" + weatherApiKey;

                fetch(weatherUrl)
                    .then(response => response.json())
                    .then(weatherData => {
                        // Handle the data and update the forecast on the webpage
                        displayWeatherForecast(weatherData);
                    })
                    .catch(error => {
                        console.error("Error fetching weather data:", error);
                    });
            }
        })
        .catch(error => {
            console.error("Error fetching geocoding data:", error);
        });

    // Display the last searched cities
    displayLastCities();
}

function displayWeatherForecast(data) {
    let currentForecastContainer = document.getElementById('current-forecast-container');
    let forecastContainer = document.getElementById('forecast-container');
    currentForecastContainer.innerHTML = ""; // Clear previous content
    forecastContainer.innerHTML = ""; // Clear previous content

    // Display current forecast
    displayCurrentForecast(data.list[0], currentForecastContainer);

    // Display 5-day forecast
    for (let i = 0; i < data.list.length; i += 8) {
        displayDailyForecast(data.list[i], forecastContainer);
    }
}

function displayCurrentForecast(currentData, container) {
    let kelvinTemp = currentData.main.temp;
    let fahrenheitTemp = convertKelvinToFahrenheit(kelvinTemp);

    let currentForecastCard = document.createElement('div');
    currentForecastCard.className = 'forecast-card'; // Assign class for CURRENT forecast card

    currentForecastCard.innerHTML = `
        <h1>Current Forecast: ${cityName} </h1>
        <p><i class="fas fa-thermometer-half"></i> Temperature: ${fahrenheitTemp.toFixed(2)} °F</p>
        <p><i class="fas fa-tint"></i> Humidity: ${currentData.main.humidity} %</p>
        <p><i class="fas fa-wind"></i> Wind Speed: ${currentData.wind.speed} Miles/Hour</p>
        <p><i class="fas fa-cloud"></i> Weather: ${currentData.weather[0].main}</p>
        <p>Weather Description: ${currentData.weather[0].description}</p>
    `;
    container.appendChild(currentForecastCard);
}

function displayDailyForecast(data, container) {
    let kelvinTemp = data.main.temp;
    let fahrenheitTemp = convertKelvinToFahrenheit(kelvinTemp);

    let forecastCard = document.createElement('div');
    forecastCard.className = 'forecast-card'; // Make a class for the forecastCard

    let forecastDate = new Date(data.dt * 1000);
    let formattedDate = formatDate(forecastDate);

    forecastCard.innerHTML = `
        <h2>Daily Forecast: ${cityName} </h2>
        <p><u>Date: ${formattedDate}</u></p>
        <p><i class="fas fa-thermometer-half"></i> Temperature: ${fahrenheitTemp.toFixed(2)} °F</p>
        <p><i class="fas fa-tint"></i> Humidity: ${data.main.humidity} %</p>
        <p><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} Miles/Hour</p>
        <p><i class="fas fa-cloud"></i> Weather: ${data.weather[0].main}</p>
        <p>Weather Description: ${data.weather[0].description}</p>
    `;
    container.appendChild(forecastCard);
}


function convertKelvinToFahrenheit(kelvin) {
    return (kelvin - 273.15) * 9 / 5 + 32;
}

function formatDate(date) {
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    return `${month}/${day}/${year}`;
}

function saveCityToLocalStorage(city) {
    // Check local storage
    if (typeof (Storage) !== "undefined") {
        // Retrieve the existing search history or initialize it as an empty array
        let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

        // Remove duplicate city if it already exists in the search history
        searchHistory = searchHistory.filter(item => item !== city);

        // Add the new city to the beginning of the search history
        searchHistory.unshift(city);

        // Limit the search history to store only the last 5 searched cities
        if (searchHistory.length > 5) {
            searchHistory = searchHistory.slice(0, 5);
        }

        // Save the updated search history to local storage
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
    }
}

function displayLastCities() {
    // Get the search history from local storage
    let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

    // Get the container to display the search history
    let searchHistoryContainer = document.getElementById('search-history-container');

    // Clear previous content
    searchHistoryContainer.innerHTML = '';

    // Display each city in the search history as a button
    searchHistory.forEach(city => {
        let cityButton = document.createElement('button');
        cityButton.textContent = city;
        cityButton.addEventListener('click', () => fetchWeatherForecast(city));
        searchHistoryContainer.appendChild(cityButton);
    });
}

function getForecastForLastCity() {
    // Retrieve the last searched city from local storage
    let lastCity = JSON.parse(localStorage.getItem('searchHistory'))[0];
    
    if (lastCity) {
        // Fetch weather forecast for the last searched city
        fetchWeatherForecast(lastCity);
    } else {
        // If there is no last searched city in local storage, display a message
        alert("No last searched city found.");
    }
}

// Display last cities searched when page loads
displayLastCities();

// Get the search bar element
let searchBar = document.getElementById('search-bar');

// Add an event listener to listen for input changes
searchBar.addEventListener('input', function() {
    // Get the current value of the search bar
    let currentValue = searchBar.value;
    
    // Capitalize the first letter and convert the rest to lowercase
    let formattedValue = currentValue.charAt(0).toUpperCase() + currentValue.slice(1).toLowerCase();
    
    // Set the formatted value back to the search bar
    searchBar.value = formattedValue;
});
