import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import slide1 from '../../assets/hero-slide-1.jpg';
import slide2 from '../../assets/hero-slide-2.jpg';
import slide3 from '../../assets/hero-slide-3.jpg';
import slide4 from '../../assets/hero-slide-4.jpg';

const slides = [
  {
    image: slide1,
    subtitle: 'Official Exclusive Dealer of Sungro Crop Care',
    heading: 'Complete Care Of All Your Crops',
    description: '100% genuine Sungro fertilizers, crop protection sprays, and high-yield hybrid seeds for Sahiwal farmers.',
  },
  {
    image: slide2,
    subtitle: 'Trusted Sungro Agriculture Advisory',
    heading: 'Ensuring Complete Farmer Satisfaction',
    description: 'Soil nutrients management, pest diagnosis, and field guidance directly from Sungro agri experts.',
  },
  {
    image: slide3,
    subtitle: 'High Yield Sungro Hybrid Seeds',
    heading: 'All Solutions For Ideal Farming',
    description: 'Maximized crop output with certified Sungro wheat, potato, corn, and vegetable seeds.',
  },
  {
    image: slide4,
    subtitle: 'Modern Sungro Crop Protection',
    heading: 'Best Agricultural & Spray Practices',
    description: 'Advanced Sungro spray formulas, application support, and weather-based spray scheduling.',
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 5500);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer, stopTimer]);

  const goToSlide = (index) => {
    setActive((index + slides.length) % slides.length);
    startTimer();
  };

  const current = slides[active];

  return (
    <section
      id="home"
      aria-label="Store highlights"
      className="relative h-[65vh] min-h-[460px] max-h-[720px] w-full overflow-hidden bg-[#2A1B69]"
      onMouseEnter={stopTimer}
      onMouseLeave={startTimer}
    >
      {/* Slide Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.heading}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === active ? 'z-10 opacity-100' : 'z-0 opacity-0'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.heading}
            className={`h-full w-full object-cover ${index === active ? 'kenburns' : ''}`}
          />
          {/* Overlay Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#2A1B69]/90 via-[#2A1B69]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1B69]/80 via-transparent to-transparent" />
        </div>
      ))}

      {/* Content Overlay */}
      <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6">
        <div key={active} className="max-w-2xl text-white">
          <span className="animate-hero-badge inline-block px-3.5 py-1.5 rounded-full bg-[#00A651] text-white font-extrabold text-xs tracking-wider uppercase mb-4 shadow-lg shadow-emerald-950/40 border border-emerald-400/30">
            {current.subtitle}
          </span>
          <h1 className="animate-hero-heading font-display text-3xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight drop-shadow-md">
            {current.heading}
          </h1>
          <p className="animate-hero-desc mt-4 text-slate-100 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl font-medium drop-shadow-sm">
            {current.description}
          </p>

          <div className="animate-hero-btns mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 rounded-full bg-[#00A651] px-7 py-3.5 text-sm font-extrabold text-white transition-all hover:bg-[#008440] hover:scale-105 shadow-xl shadow-emerald-600/40"
            >
              <span>EXPLORE SUNGRO PRODUCTS</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 backdrop-blur-md px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-white/20 hover:scale-105 shadow-md"
            >
              STORE LOCATION
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Navigation Dots */}
      <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2.5 rounded-full transition-all duration-300 ${
              i === active ? 'w-8 bg-[#00A651]' : 'w-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <div className="absolute bottom-5 right-6 z-30 flex items-center gap-3">
        <button
          onClick={() => goToSlide(active - 1)}
          aria-label="Previous slide"
          className="grid h-11 w-11 place-items-center rounded-full border-2 border-white/60 text-white transition-all hover:border-[#00A651] hover:bg-[#00A651]"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => goToSlide(active + 1)}
          aria-label="Next slide"
          className="grid h-11 w-11 place-items-center rounded-full bg-[#00A651] text-white shadow-lg transition-all hover:bg-[#008440]"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
