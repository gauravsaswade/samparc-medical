import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import {
  Stethoscope, Pill, FlaskConical, HeartPulse, Ambulance,
  ShieldCheck, Baby, Bone, Eye, Brain, Syringe, Activity, ChevronRight
} from 'lucide-react';

function useIntersectionObserver(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

const services = [
  {
    icon: Stethoscope,
    title: 'General Medicine',
    desc: 'Comprehensive primary care for all age groups. Our experienced physicians provide thorough consultations, diagnosis, and treatment for a wide range of medical conditions.',
    features: ['Routine checkups', 'Chronic disease management', 'Preventive care', 'Health screenings'],
    color: 'from-teal-500 to-medical-primary',
    bg: 'bg-teal-50',
    text: 'text-medical-primary',
  },
  {
    icon: Ambulance,
    title: 'Emergency Care',
    desc: '24/7 emergency services with rapid response teams. Our emergency department is equipped to handle all types of medical emergencies with speed and precision.',
    features: ['24/7 availability', 'Rapid response', 'Critical care', 'Trauma management'],
    color: 'from-red-500 to-red-700',
    bg: 'bg-red-50',
    text: 'text-red-600',
  },
  {
    icon: Pill,
    title: 'Pharmacy Services',
    desc: 'Full-service pharmacy with a comprehensive range of medicines, health supplements, and medical supplies at competitive prices.',
    features: ['Prescription medicines', 'Generic drugs', 'Health supplements', 'Medical supplies'],
    color: 'from-blue-500 to-blue-700',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
  },
  {
    icon: FlaskConical,
    title: 'Diagnostics & Lab',
    desc: 'Advanced laboratory and imaging services for accurate and timely diagnosis. Our state-of-the-art equipment ensures reliable test results.',
    features: ['Blood tests', 'Urine analysis', 'X-Ray & imaging', 'ECG monitoring'],
    color: 'from-purple-500 to-purple-700',
    bg: 'bg-purple-50',
    text: 'text-purple-600',
  },
  {
    icon: HeartPulse,
    title: 'Cardiac Care',
    desc: 'Specialized cardiac services including monitoring, ECG, and preventive heart health programs to keep your heart healthy.',
    features: ['ECG & monitoring', 'Cardiac consultation', 'Heart health screening', 'Preventive care'],
    color: 'from-pink-500 to-pink-700',
    bg: 'bg-pink-50',
    text: 'text-pink-600',
  },
  {
    icon: ShieldCheck,
    title: 'Preventive Healthcare',
    desc: 'Comprehensive health checkup packages and wellness programs designed to detect and prevent health issues before they become serious.',
    features: ['Full body checkups', 'Vaccination programs', 'Wellness counseling', 'Health monitoring'],
    color: 'from-green-500 to-green-700',
    bg: 'bg-green-50',
    text: 'text-green-600',
  },
  {
    icon: Baby,
    title: 'Pediatric Care',
    desc: 'Specialized healthcare for children from newborns to adolescents, with a gentle and child-friendly approach.',
    features: ['Child health checkups', 'Vaccination', 'Growth monitoring', 'Pediatric consultation'],
    color: 'from-yellow-500 to-orange-500',
    bg: 'bg-yellow-50',
    text: 'text-yellow-600',
  },
  {
    icon: Syringe,
    title: 'Vaccination',
    desc: 'Comprehensive immunization services for all age groups including routine vaccines, travel vaccines, and COVID-19 vaccination.',
    features: ['Routine immunization', 'COVID-19 vaccines', 'Travel vaccines', 'Flu shots'],
    color: 'from-indigo-500 to-indigo-700',
    bg: 'bg-indigo-50',
    text: 'text-indigo-600',
  },
  {
    icon: Activity,
    title: 'Patient Consultation',
    desc: 'Expert specialist consultations across multiple medical disciplines to provide you with the best medical advice and treatment plans.',
    features: ['Specialist consultations', 'Second opinions', 'Treatment planning', 'Follow-up care'],
    color: 'from-cyan-500 to-cyan-700',
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
  },
];

export default function Services() {
  const servicesSection = useIntersectionObserver();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-medical-dark to-medical-primary py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Our Medical Services</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            Comprehensive healthcare services designed to meet all your medical needs under one roof.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section ref={servicesSection.ref} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div
                key={service.title}
                className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-medical transition-all duration-500 hover:-translate-y-1 border border-gray-100 ${
                  servicesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`bg-gradient-to-r ${service.color} p-6`}>
                  <service.icon size={32} className="text-white mb-2" />
                  <h3 className="text-white font-bold text-xl">{service.title}</h3>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{service.desc}</p>
                  <ul className="space-y-1.5">
                    {service.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className={`w-1.5 h-1.5 rounded-full ${service.bg} border-2 ${service.text.replace('text-', 'border-')}`}></span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Need Medical Assistance?</h2>
          <p className="text-gray-600 mb-8">Contact SAMPARC MEDICAL for appointments, consultations, or emergency care.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="tel:+919766343454"
              className="inline-flex items-center gap-2 bg-medical-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-medical-dark transition-all shadow-md"
            >
              Call: +91 9766343454 <ChevronRight size={18} />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 border-2 border-medical-primary text-medical-primary px-6 py-3 rounded-xl font-semibold hover:bg-medical-light transition-all"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
