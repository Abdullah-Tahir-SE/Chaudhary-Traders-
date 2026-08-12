import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, Truck, Award } from 'lucide-react';
import service1 from '../../assets/service-1.jpg';
import service2 from '../../assets/service-2.jpg';

const services = [
  {
    image: service1,
    alt: 'Agronomist advising farmers in Sahiwal field',
    icon: Megaphone,
    title: 'Farmer Awareness Seminars',
    description:
      'Free field-day sessions and crop seminars where our agronomists teach balanced fertilizer use, pest control, and high-yield spray practices.',
  },
  {
    image: service2,
    alt: 'Direct supply delivery truck loaded with fertilizer bags',
    icon: Truck,
    title: 'Direct Franchise & Doorstep Delivery',
    description:
      'Company-direct franchise supply with same-day delivery across Sahiwal district — genuine stock, company rates, no middleman markup.',
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="bg-white py-20 sm:py-24 border-t border-slate-100">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#00A651]">
            <Award className="w-3.5 h-3.5" /> What We Offer
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold text-[#2A1B69] sm:text-4xl">
            Our Agriculture Services & Support
          </h2>
          <span className="mt-4 block h-1.5 w-20 rounded-full bg-[#00A651]" />
          <p className="mt-6 leading-relaxed text-slate-600 text-sm sm:text-base">
            Chaudhary Traders is more than a store — it is a complete crop partner. Our qualified advisors visit your fields, diagnose pest and nutrient deficiencies, and recommend the exact dose for optimal output.
          </p>
          <Link
            to="/contact"
            className="group mt-8 inline-flex items-center gap-2 rounded-full bg-[#2A1B69] px-7 py-3.5 text-sm font-extrabold text-white shadow-lg transition-all hover:bg-[#1C114C]"
          >
            <span>CONSULT OUR AGRONOMIST</span>
            <ArrowRight className="h-4 w-4 text-[#00A651] transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.alt}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <span className="absolute bottom-3 left-3 grid h-10 w-10 place-items-center rounded-xl bg-[#2A1B69] text-[#00A651] shadow-lg">
                  <service.icon className="h-5 w-5" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-display text-lg font-bold text-[#2A1B69] transition-colors group-hover:text-[#00A651]">
                  {service.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{service.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
