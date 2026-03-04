import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { SiWhatsapp } from 'react-icons/si';

const contactCards = [
  {
    icon: Phone,
    title: 'Customer Care',
    lines: [
      { label: 'Phone', value: '+91 9766343454', href: 'tel:+919766343454' },
      { label: 'WhatsApp', value: '+91 9766343454', href: 'https://wa.me/919766343454', isWhatsApp: true },
    ],
    color: 'bg-medical-light',
    iconColor: 'text-medical-primary',
  },
  {
    icon: SiWhatsapp,
    title: 'Cross WhatsApp',
    lines: [
      { label: 'WhatsApp', value: '+91 9270556455', href: 'https://wa.me/919270556455', isWhatsApp: true },
    ],
    color: 'bg-green-50',
    iconColor: 'text-green-600',
  },
  {
    icon: Phone,
    title: "CEO's Contact",
    lines: [
      { label: 'Phone', value: '+91 9766343456', href: 'tel:+919766343456' },
      { label: 'WhatsApp', value: '+91 9766343456', href: 'https://wa.me/919766343456', isWhatsApp: true },
    ],
    color: 'bg-gold/10',
    iconColor: 'text-gold-dark',
  },
  {
    icon: Mail,
    title: 'Email Us',
    lines: [
      { label: 'Email', value: 'samparc6@gmail.com', href: 'mailto:samparc6@gmail.com' },
    ],
    color: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
];

export default function Contact() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-medical-dark to-medical-primary py-16 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Contact Us</h1>
          <p className="text-teal-100 text-lg max-w-2xl mx-auto">
            We're here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-medical transition-all duration-300">
                <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
                  <card.icon size={22} className={card.iconColor} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3">{card.title}</h3>
                <div className="space-y-2">
                  {card.lines.map((line) => (
                    <div key={line.value}>
                      <p className="text-xs text-gray-400 mb-0.5">{line.label}</p>
                      <a
                        href={line.href}
                        target={line.isWhatsApp ? '_blank' : undefined}
                        rel={line.isWhatsApp ? 'noopener noreferrer' : undefined}
                        className="flex items-center gap-1.5 text-sm font-semibold text-gray-800 hover:text-medical-primary transition-colors"
                      >
                        {line.isWhatsApp && <SiWhatsapp size={14} className="text-green-500" />}
                        {line.value}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Address & Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Address Card */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-medical-light rounded-xl flex items-center justify-center">
                  <MapPin size={22} className="text-medical-primary" />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Our Location</h2>
              </div>
              <address className="not-italic text-gray-700 leading-relaxed mb-6 text-base">
                <strong className="text-gray-900">SAMPARC MEDICAL</strong><br />
                Nearby Malavali Railway Station,<br />
                Samparc Malavali Campus,<br />
                Near Malavli, Malavli,<br />
                Maharashtra 410405
              </address>
              <a
                href="https://maps.google.com/?q=Malavali+Railway+Station+Maharashtra+410405"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-medical-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-medical-dark transition-all text-sm"
              >
                <MapPin size={16} /> Get Directions
              </a>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-3">
                  <Clock size={18} className="text-medical-primary" />
                  <h3 className="font-bold text-gray-900">Working Hours</h3>
                </div>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>OPD (Mon–Sat)</span>
                    <span className="font-medium text-gray-800">8:00 AM – 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pharmacy (Daily)</span>
                    <span className="font-medium text-gray-800">8:00 AM – 10:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Emergency</span>
                    <span className="font-medium text-green-600">24/7 Available</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-br from-medical-dark to-medical-primary rounded-2xl p-8 text-white">
              <h2 className="text-xl font-bold mb-6">Quick Contact</h2>
              <div className="space-y-4">
                <a
                  href="tel:+919766343454"
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all group"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-200">Customer Care</p>
                    <p className="font-bold">+91 9766343454</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/919766343454"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-green-500/20 hover:bg-green-500/30 rounded-xl p-4 transition-all"
                >
                  <div className="w-10 h-10 bg-green-500/30 rounded-lg flex items-center justify-center">
                    <SiWhatsapp size={18} className="text-green-300" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-200">WhatsApp Chat</p>
                    <p className="font-bold">+91 9766343454</p>
                  </div>
                </a>

                <a
                  href="https://wa.me/919270556455"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <SiWhatsapp size={18} className="text-green-300" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-200">Cross WhatsApp</p>
                    <p className="font-bold">+91 9270556455</p>
                  </div>
                </a>

                <a
                  href="tel:+919766343456"
                  className="flex items-center gap-4 bg-gold/20 hover:bg-gold/30 rounded-xl p-4 transition-all"
                >
                  <div className="w-10 h-10 bg-gold/30 rounded-lg flex items-center justify-center">
                    <Phone size={18} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-200">CEO Direct</p>
                    <p className="font-bold">+91 9766343456</p>
                  </div>
                </a>

                <a
                  href="mailto:samparc6@gmail.com"
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/20 rounded-xl p-4 transition-all"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Mail size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-teal-200">Email</p>
                    <p className="font-bold text-sm">samparc6@gmail.com</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
