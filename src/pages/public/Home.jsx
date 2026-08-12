import React from 'react';
import TopBar from '../../components/public/TopBar';
import Navbar from '../../components/public/Navbar';
import HeroCarousel from '../../components/public/HeroCarousel';
import WeatherBar from '../../components/weather/WeatherBar';
import SprayAdvisoryWidget from '../../components/weather/SprayAdvisoryWidget';
import WhatWeDo from '../../components/public/WhatWeDo';
import CategoryGrid from '../../components/public/CategoryGrid';
import ServicesSection from '../../components/public/ServicesSection';
import BrandsMarquee from '../../components/public/BrandsMarquee';
import SiteFooter from '../../components/public/SiteFooter';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <TopBar />
      <Navbar />
      <main className="flex-1">
        <HeroCarousel />
        <WeatherBar />
        <div className="max-w-7xl mx-auto px-4">
          <SprayAdvisoryWidget />
        </div>
        <WhatWeDo />
        <CategoryGrid />
        <ServicesSection />
        <BrandsMarquee />
      </main>
      <SiteFooter />
    </div>
  );
}
