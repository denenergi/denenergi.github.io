import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ForecastData, WeatherError, fetchForecastData } from '../utils/weatherApi';
import useDebounce from '../hooks/useDebounce';

const ForecastCard = React.memo(({ date, forecast }: { 
  date: Date, 
  forecast: ForecastData['list'][0] 
}) => (
  <motion.div
    key={date.toISOString()}
    className="weather-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    transition={{ duration: 0.2 }}
  >
    <h3 className="weather-card__title">
      {date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })}
    </h3>
    <div className="weather-card__content">
      <img
        src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
        alt={forecast.weather[0].description}
        className="w-16 h-16 mx-auto"
      />
      <p className="weather-card__temp">{Math.round(forecast.main.temp)}°C</p>
      <p className="weather-card__description">{forecast.weather[0].description}</p>
      <div className="weather-card__details">
        <div className="weather-card__details-item">
          <p className="text-gray-600">Feels like</p>
          <p className="text-xl font-semibold">
            {Math.round(forecast.main.feels_like)}°C
          </p>
        </div>
        <div className="weather-card__details-item">
          <p className="text-gray-600">Humidity</p>
          <p className="text-xl font-semibold">{forecast.main.humidity}%</p>
        </div>
      </div>
    </div>
  </motion.div>
));

const WeeklyWeather: React.FC = () => {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [city, setCity] = useState('Kyiv');
  const debouncedCity = useDebounce(city, 800);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchForecastData(debouncedCity);
        setForecast(data);
      } catch (err) {
        const error = err as WeatherError;
        setError(error.message || 'An error occurred while fetching forecast data');
        console.error('Forecast fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [debouncedCity]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  // Memoize the next 7 days calculation
  const next7Days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date;
    });
  }, []);

  // Memoize the container animations
  const containerAnimations = useMemo(() => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 }
  }), []);

  // Memoize the title animations
  const titleAnimations = useMemo(() => ({
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.2 }
  }), []);

  return (
    <motion.div
      className="container"
      {...containerAnimations}
    >
      <motion.h1
        className="text-3xl font-bold text-center mb-8"
        {...titleAnimations}
      >
        7-Day Weather Forecast
      </motion.h1>
      
      <div className="mb-6">
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
            Loading forecast data...
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

        {forecast && !loading && !error && (
          <motion.div
            key="forecast"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4"
          >
            {next7Days.map(targetDate => {
              const dayForecast = forecast.list.find(item => {
                const itemDate = new Date(item.dt * 1000);
                return itemDate.getDate() === targetDate.getDate() &&
                       itemDate.getMonth() === targetDate.getMonth();
              }) || forecast.list[0];

              return (
                <ForecastCard
                  key={targetDate.toISOString()}
                  date={targetDate}
                  forecast={dayForecast}
                />
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default React.memo(WeeklyWeather); 