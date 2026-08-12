import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Wind, Thermometer, Droplets, Clock, Sparkles, RefreshCw } from 'lucide-react';
import { fetchLiveWeather } from '../../services/weatherService';

export default function SprayAdvisoryWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchLiveWeather();
    setWeather(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!weather) return null;

  const { advisory } = weather;
  const isOptimal = advisory.status === 'OPTIMAL';
  const isCaution = advisory.status === 'CAUTION';

  const tempPercent = Math.min(100, Math.max(0, (weather.temperature / 45) * 100));
  const windPercent = Math.min(100, Math.max(0, (weather.windSpeed / 30) * 100));
  const humPercent = Math.min(100, Math.max(0, weather.humidity));

  return (
    <section className="my-4 sm:my-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
        {/* Compact Header Bar */}
        <div className="bg-[#2A1B69] px-4 sm:px-6 py-2.5 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A651] animate-ping" />
            <span className="font-extrabold tracking-wide uppercase text-[11px] text-[#00A651]">
              Live Agri Weather
            </span>
            <span className="text-white/40">|</span>
            <span className="font-bold truncate">Sahiwal Field Advisory</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-300">
              Updated: {weather.lastUpdated}
            </span>
            <button
              onClick={loadData}
              title="Refresh"
              className="p-1 px-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-[11px] font-bold flex items-center gap-1 text-slate-200"
            >
              <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Compact Content Strip (4 Columns on Desktop) */}
        <div className="p-3.5 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Box 1: Field Status Banner (Col-span 5) */}
          <div className="lg:col-span-5 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="text-[10px] font-extrabold uppercase text-slate-500">
                Spray Suitability
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-sm ${
                  isOptimal
                    ? 'bg-[#00A651] text-white'
                    : isCaution
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-500 text-white'
                }`}
              >
                {isOptimal ? <ShieldCheck className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                <span>{advisory.status} TO SPRAY</span>
              </span>
            </div>

            <p className="text-xs font-bold text-slate-800 leading-snug line-clamp-2">
              {advisory.reason}
            </p>

            <div className="mt-2 pt-2 border-t border-slate-200/80 flex items-center gap-1.5 text-[10px] text-slate-600">
              <Clock className="w-3 h-3 text-[#00A651] shrink-0" />
              <span className="font-semibold text-slate-700">Best Spray Hours: </span>
              <span className="font-bold text-[#00A651]">7–11 AM & 4:30–7 PM</span>
            </div>
          </div>

          {/* Box 2: Temperature (Col-span 2 or 3) */}
          <div className="lg:col-span-2 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temp
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900">
                15–30°C
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="font-extrabold text-xl text-slate-900 font-display">
                {weather.temperature}
              </span>
              <span className="text-xs font-bold text-slate-500">°C</span>
              <span className="text-[10px] text-slate-400 ml-auto">{weather.condition}</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${tempPercent}%` }} />
            </div>
          </div>

          {/* Box 3: Wind Speed (Col-span 2 or 3) */}
          <div className="lg:col-span-2 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-cyan-500" /> Wind
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-900">
                3–14 km/h
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="font-extrabold text-xl text-slate-900 font-display">
                {weather.windSpeed}
              </span>
              <span className="text-xs font-bold text-slate-500">km/h</span>
              <span className="text-[10px] text-slate-400 ml-auto">{weather.windDirection}° SW</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${windPercent}%` }} />
            </div>
          </div>

          {/* Box 4: Humidity (Col-span 3) */}
          <div className="lg:col-span-3 p-3 rounded-xl bg-[#F8FAFC] border border-slate-200/80">
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> Humidity
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
                Target: 50–80%
              </span>
            </div>
            <div className="flex items-baseline gap-1 my-0.5">
              <span className="font-extrabold text-xl text-slate-900 font-display">
                {weather.humidity}
              </span>
              <span className="text-xs font-bold text-slate-500">%</span>
              <span className="text-[10px] text-emerald-600 font-bold ml-auto">Foliar Absorption: Good</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: `${humPercent}%` }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
