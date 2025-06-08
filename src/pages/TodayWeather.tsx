import React from 'react';
import Weather from '../components/Weather';

const TodayWeather: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Today's Weather</h1>
      <Weather />
    </div>
  );
};

export default TodayWeather; 