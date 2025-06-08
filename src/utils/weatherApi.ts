export interface WeatherError {
  message: string;
  code?: string;
}

export interface WeatherData {
  main: {
    temp: number;
    humidity: number;
    feels_like: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  name: string;
}

export interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      humidity: number;
      feels_like: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    dt_txt: string;
  }>;
  city: {
    name: string;
  };
}

export const fetchWeatherData = async (city: string): Promise<WeatherData> => {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not found. Please check your .env file');
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
  );

  if (!response.ok) {
    const error: WeatherError = {
      message: response.status === 404 
        ? `City "${city}" not found. Please check the spelling and try again.`
        : 'Failed to fetch weather data',
      code: response.status.toString()
    };
    throw error;
  }

  return response.json();
};

export const fetchForecastData = async (city: string): Promise<ForecastData> => {
  const apiKey = process.env.REACT_APP_OPENWEATHER_API_KEY;
  if (!apiKey) {
    throw new Error('API key not found. Please check your .env file');
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`
  );

  if (!response.ok) {
    const error: WeatherError = {
      message: response.status === 404 
        ? `City "${city}" not found. Please check the spelling and try again.`
        : 'Failed to fetch forecast data',
      code: response.status.toString()
    };
    throw error;
  }

  return response.json();
}; 