import { useEffect, useRef, useState } from 'react';
import { Award, Target, Heart, Users, CheckCircle } from 'lucide-react';

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

const values = [
  { icon: Heart, title: 'Compassionate Care', desc: 'We treat every patient with empathy, dignity, and respect.' },
  { icon: Award, title: 'Excellence', desc: 'Committed to the highest standards of medical practice.' },
  { icon: Target, title: 'Accessibility', desc: 'Quality healthcare accessible to everyone in our community.' },
  { icon: Users, title: 'Community Focus', desc: 'Dedicated to improving the health of our local community.' },
];

const achievements = [
  'ISO Certified Medical Facility',
  'State-of-the-art diagnostic equipment',
  'Experienced team of medical professionals',
  'Comprehensive pharmacy services',
  '24/7 emergency care availability',
  'Patient-centered approach to healthcare',
];

export default function About() {
  const founderSection = useIntersectionObserver();
  const ceoSection = useIntersectionObserver();
  const valuesSection = useIntersectionObserver();

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-medical-dark to-medical-primary py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">About SAMPARC MEDICAL</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            A legacy of healthcare excellence, compassion, and community service since our founding.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-medical-primary font-semibold text-sm uppercase tracking-widest">Our Mission</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-6">
              Dedicated to Your Health & Well-being
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              SAMPARC MEDICAL was established with a singular vision: to provide world-class healthcare services to the people of Malavali and surrounding regions. We believe that quality healthcare is a fundamental right, not a privilege. Our hospital combines modern medical technology with a deeply human approach to healing.
            </p>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section ref={founderSection.ref} className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${founderSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-medical-primary/20">
                  <img
                    src="/assets/generated/founder-avatar.dim_200x200.png"
                    alt="AMITKUMAR BANERJEE - Founder"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-medical-primary to-medical-dark items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-white text-6xl font-bold">AB</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-gold text-white px-4 py-2 rounded-xl shadow-lg">
                  <p className="text-xs font-bold">Founder Director</p>
                  <p className="text-xs">& Secretary</p>
                </div>
              </div>
            </div>

            <div>
              <span className="text-medical-primary font-semibold text-sm uppercase tracking-widest">Founder & Director</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-2">AMITKUMAR BANERJEE</h2>
              <p className="text-gold font-semibold mb-4">Founder Director & Secretary, SAMPARC MEDICAL</p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mr. Amitkumar Banerjee is the visionary force behind SAMPARC MEDICAL. With an unwavering commitment to community healthcare, he founded this institution with the dream of making quality medical care accessible to every individual, regardless of their socioeconomic background.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                His deep-rooted passion for social welfare and healthcare has been the driving force behind SAMPARC MEDICAL's growth. Under his guidance, the hospital has expanded its services, modernized its facilities, and built a reputation for excellence and trust in the region.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Mr. Banerjee's philosophy is simple yet profound: <em>"Every life matters, and every patient deserves the best care possible."</em> This ethos permeates every aspect of SAMPARC MEDICAL's operations.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Healthcare Visionary', 'Community Leader', 'Social Reformer'].map(tag => (
                  <span key={tag} className="bg-medical-light text-medical-primary px-3 py-1 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section ref={ceoSection.ref} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${ceoSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="order-2 lg:order-1">
              <span className="text-gold font-semibold text-sm uppercase tracking-widest">Chief Executive Officer</span>
              <h2 className="text-3xl font-extrabold text-gray-900 mt-2 mb-2">ANUJ SINGH</h2>
              <p className="text-medical-primary font-semibold mb-4">CEO, SAMPARC MEDICAL</p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Mr. Anuj Singh is the dynamic Chief Executive Officer of SAMPARC MEDICAL, bringing strategic vision and operational excellence to the organization. With his exceptional leadership skills and deep understanding of healthcare management, he has transformed SAMPARC MEDICAL into a modern, patient-centric institution.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Under Mr. Singh's leadership, SAMPARC MEDICAL has embraced digital transformation, expanded its medical services, and significantly improved patient satisfaction scores. His focus on quality, efficiency, and innovation has set new benchmarks in regional healthcare delivery.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Mr. Singh believes in building a healthcare ecosystem that is not just about treating illness, but about promoting overall wellness and preventive care. His vision for SAMPARC MEDICAL is to become the most trusted healthcare destination in Maharashtra.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Strategic Leader', 'Healthcare Innovator', 'Patient Advocate'].map(tag => (
                  <span key={tag} className="bg-gold/10 text-gold-dark px-3 py-1 rounded-full text-sm font-medium border border-gold/20">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <a
                  href="tel:+919766343456"
                  className="inline-flex items-center gap-2 text-sm text-medical-primary hover:text-medical-dark font-medium"
                >
                  📞 Direct: +91 9766343456
                </a>
              </div>
            </div>

            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative">
                <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-2xl border-4 border-gold/20">
                  <img
                    src="/assets/generated/ceo-avatar.dim_200x200.png"
                    alt="ANUJ SINGH - CEO"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div className="hidden w-full h-full bg-gradient-to-br from-gold to-gold-dark items-center justify-center" style={{ display: 'none' }}>
                    <span className="text-white text-6xl font-bold">AS</span>
                  </div>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-medical-primary text-white px-4 py-2 rounded-xl shadow-lg">
                  <p className="text-xs font-bold">Chief Executive</p>
                  <p className="text-xs">Officer (CEO)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesSection.ref} className="py-16 bg-gradient-to-br from-medical-dark to-medical-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-12 transition-all duration-700 ${valuesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-3xl font-extrabold text-white mb-4">Our Core Values</h2>
            <p className="text-teal-100 max-w-2xl mx-auto">The principles that guide everything we do at SAMPARC MEDICAL.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {values.map((v, i) => (
              <div
                key={v.title}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transition-all duration-700 ${
                  valuesSection.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-gold" />
                </div>
                <h3 className="text-white font-bold mb-2">{v.title}</h3>
                <p className="text-teal-100 text-sm">{v.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
            <h3 className="text-white font-bold text-xl mb-6 text-center">Our Achievements</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {achievements.map((a) => (
                <div key={a} className="flex items-center gap-2 text-teal-100 text-sm">
                  <CheckCircle size={16} className="text-gold shrink-0" />
                  <span>{a}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
