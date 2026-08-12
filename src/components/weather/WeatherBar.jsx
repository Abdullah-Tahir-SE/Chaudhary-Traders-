import React, { useEffect, useState } from 'react';
import { CloudSun, Droplets, Wind, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
import { fetchLiveWeather } from '../../services/weatherService';

export default function WeatherBar() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadWeather = async () => {
    setLoading(true);
    const data = await fetchLiveWeather();
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadWeather();
    // Refresh weather every 10 minutes
    const interval = setInterval(loadWeather, 600000);
    return () => clearInterval(interval);
  }, []);

  if (loading && !weather) {
    return (
      <div className="bg-[#2A1B69] text-white py-3 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs sm:text-sm animate-pulse">
          <span className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-[#00A651]" />
            Loading live Sahiwal agri-weather forecast...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#2A1B69] text-white py-3 px-4 shadow-md border-y border-white/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Location & Temp */}
        <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
          <div className="flex items-center gap-2 font-semibold">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#00A651] animate-ping" />
            <span className="text-[#00A651] font-bold">LIVE WEATHER:</span>
            <span>{weather.location}</span>
          </div>

          <div className="h-4 w-px bg-white/20 hidden sm:block" />

          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <CloudSun className="w-4 h-4" />
            <span>{weather.temperature}°C</span>
            <span className="text-white/80 font-normal">({weather.condition})</span>
          </div>
        </div>

        {/* Humidity & Wind */}
        <div className="flex items-center gap-5 text-white/90">
          <div className="flex items-center gap-1.5" title="Relative Humidity">
            <Droplets className="w-4 h-4 text-blue-300" />
            <span>Humidity: <strong className="text-white">{weather.humidity}%</strong></span>
          </div>

          <div className="flex items-center gap-1.5" title="Wind Speed">
            <Wind className="w-4 h-4 text-cyan-300" />
            <span>Wind: <strong className="text-white">{weather.windSpeed} km/h</strong></span>
          </div>

          {/* Spray Safety Badge */}
          <div className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm ${weather.advisory.badgeColor}`}>
            {weather.advisory.status === 'OPTIMAL' ? (
              <ShieldCheck className="w-3.5 h-3.5" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5" />
            )}
            <span>SPRAY: {weather.advisory.status}</span>
          </div>

          <button
            onClick={loadWeather}
            title="Refresh weather data"
            className="p-1 hover:bg-white/10 rounded-full transition-colors text-white/70 hover:text-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
