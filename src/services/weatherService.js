// Weather & Spray Advisory Service for Sahiwal Agriculture Region
// Default Coordinates: Sahiwal, Punjab, Pakistan (30.6682° N, 73.1014° E)

const SAHIWAL_LAT = 30.6682;
const SAHIWAL_LON = 73.1014;

export const fetchLiveWeather = async (lat = SAHIWAL_LAT, lon = SAHIWAL_LON) => {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m&timezone=Asia%2FKarachi`
    );

    if (!response.ok) {
      throw new Error('Weather network response was not ok');
    }

    const data = await response.json();
    return formatWeatherData(data);
  } catch (error) {
    console.warn('Using fallback Sahiwal weather data:', error.message);
    return getFallbackWeatherData();
  }
};

export const calculateSprayAdvisory = (tempC, windKmH, humidity) => {
  // Agronomic Spray Guidelines
  if (windKmH > 22 || tempC > 38) {
    return {
      status: 'UNSAFE',
      badgeColor: 'bg-red-500 text-white',
      alertBg: 'bg-red-50 border-red-200 text-red-800',
      reason: 'High wind speed (>22 km/h) or extreme heat (>38°C). High risk of chemical drift & evaporation.',
      actionAdvice: 'Postpone chemical spraying until winds settle below 15 km/h.',
    };
  }

  if (windKmH > 14 || tempC > 32 || humidity < 40) {
    return {
      status: 'CAUTION',
      badgeColor: 'bg-amber-500 text-white',
      alertBg: 'bg-amber-50 border-amber-200 text-amber-900',
      reason: 'Moderate wind (14-22 km/h) or high temp. Risk of droplet drift and moderate droplet loss.',
      actionAdvice: 'Use low-drift nozzles, adjust boom height, and monitor humidity levels.',
    };
  }

  if (windKmH < 3) {
    return {
      status: 'CAUTION',
      badgeColor: 'bg-amber-500 text-white',
      alertBg: 'bg-amber-50 border-amber-200 text-amber-900',
      reason: 'Calm air (<3 km/h). Temperature inversion hazard may trap fine spray particles.',
      actionAdvice: 'Avoid fine fogging sprays during inversion hours (early sunrise/dusk).',
    };
  }

  return {
    status: 'OPTIMAL',
    badgeColor: 'bg-emerald-600 text-white',
    alertBg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    reason: 'Ideal weather conditions. Perfect wind speed (3-14 km/h) and moderate temperature.',
    actionAdvice: 'Excellent time for pesticide, fungicide, and liquid fertilizer application.',
  };
};

const getWeatherConditionText = (code) => {
  const weatherCodes = {
    0: 'Clear Sky ☀️',
    1: 'Mainly Clear 🌤️',
    2: 'Partly Cloudy ⛅',
    3: 'Overcast ☁️',
    45: 'Foggy 🌫️',
    48: 'Depositing Rime Fog 🌫️',
    51: 'Light Drizzle 🌧️',
    61: 'Slight Rain 🌧️',
    63: 'Moderate Rain 🌧️',
    80: 'Rain Showers 🌦️',
    95: 'Thunderstorm 🌩️',
  };
  return weatherCodes[code] || 'Clear Conditions ☀️';
};

const formatWeatherData = (data) => {
  const current = data.current || {};
  const temp = Math.round(current.temperature_2m ?? 28);
  const humidity = Math.round(current.relative_humidity_2m ?? 55);
  const windSpeed = Math.round(current.wind_speed_10m ?? 10);
  const weatherCode = current.weather_code ?? 0;

  const advisory = calculateSprayAdvisory(temp, windSpeed, humidity);

  return {
    location: 'Sahiwal, Punjab',
    temperature: temp,
    humidity: humidity,
    windSpeed: windSpeed,
    windDirection: current.wind_direction_10m ?? 180,
    condition: getWeatherConditionText(weatherCode),
    advisory: advisory,
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};

const getFallbackWeatherData = () => {
  const temp = 29;
  const windSpeed = 9;
  const humidity = 58;

  return {
    location: 'Sahiwal, Punjab',
    temperature: temp,
    humidity: humidity,
    windSpeed: windSpeed,
    windDirection: 140,
    condition: 'Clear Sky ☀️',
    advisory: calculateSprayAdvisory(temp, windSpeed, humidity),
    lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };
};
