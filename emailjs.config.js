/*
  EmailJS client configuration.
  Fill these values from your EmailJS dashboard.
  
  SETUP INSTRUCTIONS:
  1. Go to https://www.emailjs.com/ and create an account
  2. Add an email service (Gmail, Outlook, etc.) → get SERVICE_ID
  3. Create email templates for contact and appointment → get TEMPLATE_IDs
  4. Get your public key from Account → API Keys → get PUBLIC_KEY
  5. Replace the placeholder values below with your actual credentials
*/
window.NORWOOD_EMAILJS_CONFIG = {
  publicKey: 'fWMjUb3nyc5iqIdCq',
  appointment: {
    serviceId: 'service_2wvqqwi',
    templateId: 'template_af8yxnw'
  },
  contact: {
    serviceId: 'service_0mqrnkb',
    templateId: 'template_n8y37fa'
  }
};

