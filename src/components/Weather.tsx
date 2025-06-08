import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WeatherData, WeatherError, fetchWeatherData } from '../utils/weatherApi';
import useDebounce from '../hooks/useDebounce';

const WeatherCard = React.memo(({ weather }: { weather: WeatherData }) => (
  <div className="space-y-4">
    <motion.div
      className="text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <motion.h2
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="weather-card__title"
      >
        {weather.name}
      </motion.h2>
      <motion.div
        className="flex-center"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <motion.img
          src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
          alt={weather.weather[0].description}
          className="w-20 h-20"
          whileHover={{ scale: 1.1 }}
        />
        <motion.span
          className="weather-card__temp"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Math.round(weather.main.temp)}°C
        </motion.span>
      </motion.div>
      <motion.p
        className="weather-card__description"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {weather.weather[0].description}
      </motion.p>
    </motion.div>

    <motion.div
      className="weather-card__details"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="weather-card__details-item">
        <p className="text-gray-600">Feels like</p>
        <p className="text-xl font-semibold">
          {Math.round(weather.main.feels_like)}°C
        </p>
      </div>
      <div className="weather-card__details-item">
        <p className="text-gray-600">Humidity</p>
        <p className="text-xl font-semibold">
          {weather.main.humidity}%
        </p>
      </div>
    </motion.div>
  </div>
));

const Weather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('Kyiv');
  const debouncedCity = useDebounce(city, 800);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchWeatherData(debouncedCity);
        setWeather(data);
      } catch (err) {
        const error = err as WeatherError;
        setError(error.message || 'An error occurred while fetching weather data');
        console.error('Weather fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedCity]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  // Memoize the animations configuration
  const animations = useMemo(() => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  }), []);

  return (
    <motion.div
      className="weather-card"
      {...animations}
    >
      <div className="space-y-4">
        <div className="flex-center">
          <input
            type="text"
            value={city}
            onChange={handleCityChange}
            placeholder="Enter city name"
            className="input w-full"
          />
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="loading-message"
            >
              Loading weather data...
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="error-message"
            >
              <p>{error}</p>
            </motion.div>
          )}

          {weather && !loading && !error && (
            <WeatherCard weather={weather} />
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default React.memo(Weather); 