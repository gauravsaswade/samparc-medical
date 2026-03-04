export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const HOSPITAL_INFO = {
  name: 'SAMPARC MEDICAL',
  address: 'Nearby Malavali Railway Station, Samparc Malavali Campus, Near Malavli, Malavli, Maharashtra 410405',
  email: 'samparc6@gmail.com',
  customerCare: '+91 9766343454',
  crossWhatsApp: '+91 9270556455',
  ceoContact: '+91 9766343456',
  founder: 'AMITKUMAR BANERJEE',
  ceo: 'ANUJ SINGH',
};

const responses: Array<{ keywords: string[]; response: string }> = [
  {
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'namaste'],
    response: `Hello! Welcome to **SAMPARC MEDICAL** 🏥\n\nI'm your virtual health assistant. I'm here to help you with information about our hospital, services, medicines, and more.\n\nHow can I assist you today?`,
  },
  {
    keywords: ['address', 'location', 'where', 'directions', 'how to reach', 'find', 'place'],
    response: `📍 **SAMPARC MEDICAL Location:**\n\n${HOSPITAL_INFO.address}\n\nWe are conveniently located near Malavali Railway Station, making us easily accessible by train and road.\n\nFor directions, you can call us at **${HOSPITAL_INFO.customerCare}**.`,
  },
  {
    keywords: ['contact', 'phone', 'call', 'number', 'reach', 'helpline'],
    response: `📞 **Contact SAMPARC MEDICAL:**\n\n• **Customer Care:** ${HOSPITAL_INFO.customerCare}\n• **WhatsApp:** ${HOSPITAL_INFO.customerCare}\n• **CEO Direct:** ${HOSPITAL_INFO.ceoContact}\n• **Email:** ${HOSPITAL_INFO.email}\n\nOur team is available to assist you. Feel free to call or WhatsApp us!`,
  },
  {
    keywords: ['whatsapp', 'chat', 'message', 'text'],
    response: `💬 **WhatsApp SAMPARC MEDICAL:**\n\n• **Customer Care WhatsApp:** ${HOSPITAL_INFO.customerCare}\n• **Cross WhatsApp:** ${HOSPITAL_INFO.crossWhatsApp}\n• **CEO WhatsApp:** ${HOSPITAL_INFO.ceoContact}\n\nClick the WhatsApp button on our Contact page to start a chat instantly!`,
  },
  {
    keywords: ['email', 'mail', 'write'],
    response: `📧 **Email Us:**\n\n**${HOSPITAL_INFO.email}**\n\nYou can email us for appointments, queries, or feedback. We typically respond within 24 hours.`,
  },
  {
    keywords: ['service', 'services', 'treatment', 'facility', 'facilities', 'offer', 'provide'],
    response: `🏥 **SAMPARC MEDICAL Services:**\n\n• 🩺 **General Medicine** - Comprehensive primary care\n• 🚨 **Emergency Care** - 24/7 emergency services\n• 💊 **Pharmacy** - Full-service medicine dispensary\n• 🔬 **Diagnostics** - Advanced lab & imaging\n• 👨‍⚕️ **Patient Consultation** - Expert specialist consultations\n• 🏥 **Preventive Healthcare** - Health checkups & wellness\n• 🧪 **Pathology Lab** - Accurate diagnostic testing\n• 💉 **Vaccination** - Immunization services\n\nFor more details, visit our **Services** page or call **${HOSPITAL_INFO.customerCare}**.`,
  },
  {
    keywords: ['medicine', 'medicines', 'drug', 'drugs', 'pharmacy', 'tablet', 'capsule', 'syrup'],
    response: `💊 **SAMPARC MEDICAL Pharmacy:**\n\nWe maintain a comprehensive pharmacy with a wide range of medicines including:\n\n• Prescription medicines\n• Over-the-counter drugs\n• Generic medicines\n• Ayurvedic products\n• Health supplements\n\nVisit our **Medicines** page to browse our catalog, or call **${HOSPITAL_INFO.customerCare}** for availability.`,
  },
  {
    keywords: ['timing', 'time', 'hours', 'open', 'close', 'schedule', 'when'],
    response: `⏰ **SAMPARC MEDICAL Timings:**\n\n• **OPD Hours:** 8:00 AM – 8:00 PM (Mon–Sat)\n• **Emergency:** 24/7 Available\n• **Pharmacy:** 8:00 AM – 10:00 PM (Daily)\n• **Sunday:** Emergency services only\n\nFor appointments, call **${HOSPITAL_INFO.customerCare}**.`,
  },
  {
    keywords: ['appointment', 'book', 'schedule', 'consult', 'doctor', 'visit'],
    response: `📅 **Book an Appointment:**\n\nTo schedule a consultation at SAMPARC MEDICAL:\n\n1. 📞 Call us: **${HOSPITAL_INFO.customerCare}**\n2. 💬 WhatsApp: **${HOSPITAL_INFO.customerCare}**\n3. 📧 Email: **${HOSPITAL_INFO.email}**\n\nOur team will confirm your appointment and guide you through the process.`,
  },
  {
    keywords: ['founder', 'amitkumar', 'banerjee', 'director', 'secretary'],
    response: `👨‍💼 **About Our Founder:**\n\n**AMITKUMAR BANERJEE** - Founder Director & Secretary\n\nMr. Amitkumar Banerjee is a visionary healthcare leader who founded SAMPARC MEDICAL with a mission to provide accessible, quality healthcare to the community. With decades of experience in healthcare management, he has built SAMPARC MEDICAL into a trusted institution.\n\nHis dedication to patient welfare and community health has been the cornerstone of our hospital's success.`,
  },
  {
    keywords: ['ceo', 'anuj', 'singh', 'chief executive'],
    response: `👨‍💼 **About Our CEO:**\n\n**ANUJ SINGH** - Chief Executive Officer\n\nMr. Anuj Singh leads SAMPARC MEDICAL with strategic vision and operational excellence. Under his leadership, the hospital has expanded its services and embraced modern medical technologies.\n\nHis commitment to quality healthcare and patient satisfaction drives the hospital's continuous growth and improvement.\n\n📞 CEO Contact: **${HOSPITAL_INFO.ceoContact}**`,
  },
  {
    keywords: ['emergency', 'urgent', 'ambulance', 'critical', 'accident'],
    response: `🚨 **EMERGENCY SERVICES:**\n\n**SAMPARC MEDICAL provides 24/7 Emergency Care!**\n\n📞 **Emergency Helpline: ${HOSPITAL_INFO.customerCare}**\n\nOur emergency team is always ready to assist you. Please call immediately for:\n• Accidents & trauma\n• Cardiac emergencies\n• Breathing difficulties\n• Severe injuries\n\n⚠️ For life-threatening emergencies, also call **108** (National Ambulance).`,
  },
  {
    keywords: ['price', 'cost', 'fee', 'charge', 'rate', 'affordable', 'cheap'],
    response: `💰 **SAMPARC MEDICAL Pricing:**\n\nWe believe quality healthcare should be affordable. Our services are competitively priced:\n\n• Consultation fees vary by specialist\n• Medicines at competitive market rates\n• Diagnostic tests at affordable prices\n• Insurance accepted (most major providers)\n\nFor specific pricing, please call **${HOSPITAL_INFO.customerCare}** or visit our pharmacy.`,
  },
  {
    keywords: ['insurance', 'cashless', 'mediclaim', 'tpa'],
    response: `🏥 **Insurance & Cashless Facility:**\n\nSAMPARC MEDICAL accepts most major health insurance plans. We offer:\n\n• Cashless treatment facility\n• Mediclaim assistance\n• TPA coordination\n• Insurance claim support\n\nFor insurance queries, contact us at **${HOSPITAL_INFO.customerCare}**.`,
  },
  {
    keywords: ['covid', 'corona', 'vaccination', 'vaccine', 'immunization'],
    response: `💉 **Vaccination Services at SAMPARC MEDICAL:**\n\nWe provide comprehensive vaccination services including:\n\n• COVID-19 vaccination\n• Routine immunizations\n• Travel vaccines\n• Flu shots\n• Pediatric vaccines\n\nContact us at **${HOSPITAL_INFO.customerCare}** to schedule your vaccination.`,
  },
  {
    keywords: ['blood', 'test', 'lab', 'pathology', 'report', 'diagnostic'],
    response: `🔬 **Diagnostic & Lab Services:**\n\nSAMPARC MEDICAL offers comprehensive diagnostic services:\n\n• Blood tests & CBC\n• Urine analysis\n• X-Ray & Imaging\n• ECG & Cardiac tests\n• Thyroid & Hormone tests\n• Diabetes screening\n• Full body checkup packages\n\nFor test bookings, call **${HOSPITAL_INFO.customerCare}**.`,
  },
  {
    keywords: ['thank', 'thanks', 'thank you', 'great', 'helpful', 'good'],
    response: `😊 **You're welcome!**\n\nThank you for choosing SAMPARC MEDICAL. We're committed to your health and well-being.\n\nIf you have any more questions, feel free to ask! You can also reach us at:\n📞 **${HOSPITAL_INFO.customerCare}**\n\n*Your Health, Our Mission* 🏥`,
  },
  {
    keywords: ['bye', 'goodbye', 'see you', 'take care'],
    response: `👋 **Goodbye!**\n\nThank you for visiting SAMPARC MEDICAL. Take care of your health!\n\nRemember, we're always here for you:\n📞 **${HOSPITAL_INFO.customerCare}**\n\n*Stay healthy, stay happy!* 🌟`,
  },
];

export function getAIResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase().trim();

  for (const item of responses) {
    if (item.keywords.some(keyword => lowerMessage.includes(keyword))) {
      return item.response;
    }
  }

  // General health questions
  if (lowerMessage.includes('fever') || lowerMessage.includes('cold') || lowerMessage.includes('cough')) {
    return `🤒 **Health Advisory:**\n\nFor fever, cold, or cough symptoms:\n\n• Stay hydrated and rest\n• Monitor your temperature\n• Take prescribed medications\n• Consult a doctor if symptoms persist for more than 3 days\n\n⚠️ **Please consult our doctors for proper diagnosis and treatment.**\n\n📞 Call us: **${HOSPITAL_INFO.customerCare}**`;
  }

  if (lowerMessage.includes('diabetes') || lowerMessage.includes('sugar') || lowerMessage.includes('blood sugar')) {
    return `🩺 **Diabetes Information:**\n\nDiabetes management tips:\n\n• Monitor blood sugar regularly\n• Follow a balanced diet\n• Exercise regularly\n• Take medications as prescribed\n• Regular HbA1c tests\n\n**SAMPARC MEDICAL offers comprehensive diabetes care.**\n📞 Book consultation: **${HOSPITAL_INFO.customerCare}**`;
  }

  if (lowerMessage.includes('heart') || lowerMessage.includes('cardiac') || lowerMessage.includes('chest pain')) {
    return `❤️ **Cardiac Health:**\n\n⚠️ **If you're experiencing chest pain, call emergency services immediately!**\n\nFor cardiac care at SAMPARC MEDICAL:\n• ECG & cardiac monitoring\n• Cardiologist consultations\n• Preventive cardiac checkups\n\n🚨 **Emergency: ${HOSPITAL_INFO.customerCare}**`;
  }

  // Default response
  return `🤔 I'm not sure about that specific query, but I'm here to help!\n\n**SAMPARC MEDICAL** is your trusted healthcare partner. For detailed information:\n\n📞 **Call us:** ${HOSPITAL_INFO.customerCare}\n💬 **WhatsApp:** ${HOSPITAL_INFO.customerCare}\n📧 **Email:** ${HOSPITAL_INFO.email}\n\nYou can ask me about:\n• Hospital location & timings\n• Our services & facilities\n• Medicines & pharmacy\n• Appointments & consultations\n• Contact information\n\n*Your Health, Our Mission* 🏥`;
}

export function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
