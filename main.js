/* =====================================================
   NORWOOD GULF — MAIN JAVASCRIPT
   Premium Auto Care
   ===================================================== */

'use strict';

/* =====================================================
   EMAILJS (CONFIG-BASED STRUCTURE)
   ===================================================== */
function isPlaceholderValue(value) {
  const trimmed = String(value).trim();
  const isPlaceholder = !value || /^YOUR_/i.test(trimmed);
  console.log('Checking placeholder value:', { value, trimmed, isPlaceholder });
  return isPlaceholder;
}

function getEmailJsConfig(formType) {
  const cfg = window.NORWOOD_EMAILJS_CONFIG || {};
  const formCfg = cfg[formType] || {};
  
  console.log('Getting EmailJS config:', { 
    globalConfig: cfg, 
    formType, 
    formConfig: formCfg,
    publicKey: cfg.publicKey,
    serviceId: formCfg.serviceId,
    templateId: formCfg.templateId
  });

  return {
    publicKey: cfg.publicKey || '',
    serviceId: formCfg.serviceId || '',
    templateId: formCfg.templateId || ''
  };
}

// Test function to verify configuration is loaded
function testEmailJsConfig() {
  console.log('=== EmailJS Configuration Test ===');
  const config = window.EMAILJS_CONFIG;
  if (!config) {
    console.warn('EmailJS config not found on window object, ensuring initialization...');
    return false;
  }
  
  console.log('Window NORWOOD_EMAILJS_CONFIG:', window.NORWOOD_EMAILJS_CONFIG);
  
  // Check individual properties
  const hasPublicKey = window.NORWOOD_EMAILJS_CONFIG.publicKey && 
                      window.NORWOOD_EMAILJS_CONFIG.publicKey !== 'YOUR_ACTUAL_PUBLIC_KEY_HERE';
  
  const hasContactConfig = window.NORWOOD_EMAILJS_CONFIG.contact && 
                           window.NORWOOD_EMAILJS_CONFIG.contact.serviceId && 
                           window.NORWOOD_EMAILJS_CONFIG.contact.templateId;
  
  const hasAppointmentConfig = window.NORWOOD_EMAILJS_CONFIG.appointment && 
                               window.NORWOOD_EMAILJS_CONFIG.appointment.serviceId && 
                               window.NORWOOD_EMAILJS_CONFIG.appointment.templateId;
  
  console.log('Configuration checks:', {
    hasConfigObject: typeof window.NORWOOD_EMAILJS_CONFIG !== 'undefined',
    hasPublicKey,
    hasContactConfig,
    hasAppointmentConfig
  });
  
  if (hasContactConfig) {
    const contactConfig = getEmailJsConfig('contact');
    console.log('Contact config:', contactConfig);
  }
  
  if (hasAppointmentConfig) {
    const appointmentConfig = getEmailJsConfig('appointment');
    console.log('Appointment config:', appointmentConfig);
  }
  
  console.log('=== End Configuration Test ===');
}

async function sendWithEmailJs(formType, templateParams) {
  const { publicKey, serviceId, templateId } = getEmailJsConfig(formType);
  console.log('EmailJS Config:', { publicKey, serviceId, templateId, formType });
  
  if (isPlaceholderValue(publicKey) || isPlaceholderValue(serviceId) || isPlaceholderValue(templateId)) {
    console.error('EmailJS config incomplete:', { publicKey, serviceId, templateId });
    throw new Error(`EmailJS config is incomplete for "${formType}" form.`);
  }

  // Initialize EmailJS with public key
  try {
    emailjs.init(publicKey);
    console.log('EmailJS initialized successfully');
  } catch (error) {
    console.error('EmailJS initialization failed:', error);
    throw new Error(`EmailJS initialization failed: ${error.message}`);
  }

  try {
    console.log('Sending email with params:', templateParams);
    const response = await emailjs.send(serviceId, templateId, templateParams);
    console.log('EmailJS send success:', response);
    return response;
  } catch (error) {
    console.error('EmailJS send error:', error);
    throw new Error(`EmailJS send failed: ${error.text || error.message}`);
  }
}

function setSubmitButtonState(button, isLoading, loadingText = 'Sending...') {
  if (!button) return;

  if (isLoading) {
    if (!button.dataset.originalHtml) {
      button.dataset.originalHtml = button.innerHTML;
    }
    button.disabled = true;
    button.textContent = loadingText;
    return;
  }

  button.disabled = false;
  if (button.dataset.originalHtml) {
    button.innerHTML = button.dataset.originalHtml;
  }
}

/* =====================================================
   SCROLL PROGRESS INDICATOR
   ===================================================== */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / total) * 100;
    bar.style.width = `${Math.min(progress, 100)}%`;
  }, { passive: true });
}

/* =====================================================
   NAVBAR
   ===================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  // Scroll behavior
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // Active link highlight
  const navLinks = document.querySelectorAll('.nav-link');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // Mobile nav
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileNav = document.querySelector('.nav-mobile');
  const overlay   = document.querySelector('.nav-overlay');

  function openMenu() {
    hamburger.classList.add('open');
    mobileNav.classList.add('open');
    overlay.classList.add('open');
    document.body.classList.add('nav-open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileNav.classList.remove('open');
    overlay.classList.remove('open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
  }

  if (hamburger) hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  if (overlay) overlay.addEventListener('click', closeMenu);

  // Close on mobile link click
  document.querySelectorAll('.nav-mobile-link').forEach(link => {
    link.addEventListener('click', closeMenu);
  });
}

/* =====================================================
   SCROLL REVEAL — INTERSECTION OBSERVER
   ===================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
  });

  elements.forEach(el => observer.observe(el));
}

/* =====================================================
   TESTIMONIAL CAROUSEL
   ===================================================== */
function initCarousel() {
  const track   = document.querySelector('.testimonial-track');
  const dots    = document.querySelectorAll('.carousel-dot');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');

  if (!track) return;

  const cards  = track.querySelectorAll('.testimonial-card');
  let current  = 0;
  let autoTimer = null;

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });
  }

  function startAuto() {
    autoTimer = setInterval(() => goTo(current + 1), 5000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  // Touch support
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goTo(current + 1) : goTo(current - 1);
      resetAuto();
    }
  }, { passive: true });

  goTo(0);
  startAuto();
}

/* =====================================================
   BACK TO TOP
   ===================================================== */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =====================================================
   ACCORDION
   ===================================================== */
function initAccordion() {
  const triggers = document.querySelectorAll('.accordion-trigger');
  if (!triggers.length) return;

  triggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      const isOpen  = trigger.classList.contains('open');

      // Close all
      triggers.forEach(t => {
        t.classList.remove('open');
        t.nextElementSibling.classList.remove('open');
      });

      // Open clicked (if it was closed)
      if (!isOpen) {
        trigger.classList.add('open');
        content.classList.add('open');
      }
    });
  });

  // Open first by default
  if (triggers[0]) {
    triggers[0].classList.add('open');
    triggers[0].nextElementSibling.classList.add('open');
  }
}

/* =====================================================
   APPOINTMENT FORM — VALIDATION & SUBMIT
   ===================================================== */
function initAppointmentForm() {
  const form    = document.getElementById('appointment-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  const validators = {
    fullName:  val => val.trim().length >= 2 || 'Please enter your full name.',
    phone:     val => /^\+?[\d\s\-()]{7,}$/.test(val.trim()) || 'Enter a valid phone number.',
    email:     val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Enter a valid email address.',
    vehicle:   val => val.trim().length >= 2 || 'Please enter your vehicle model.',
    service:   val => val !== '' || 'Please select a service.',
    date:      val => {
      if (!val) return 'Please select a preferred date.';
      const selected = new Date(val);
      const today    = new Date();
      today.setHours(0,0,0,0);
      return selected >= today || 'Please select a future date.';
    }
  };

  function showError(input, message) {
    const group  = input.closest('.form-group');
    const errEl  = group.querySelector('.form-error');
    input.classList.add('error');
    if (errEl) { errEl.textContent = message; errEl.classList.add('visible'); }
  }

  function clearError(input) {
    const group = input.closest('.form-group');
    const errEl = group.querySelector('.form-error');
    input.classList.remove('error');
    if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
  }

  function validateField(input) {
    const name      = input.name;
    const validator = validators[name];
    if (!validator) return true;

    const result = validator(input.value);
    if (result !== true) {
      showError(input, result);
      return false;
    }
    clearError(input);
    return true;
  }

  // Real-time validation
  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateField(input);
    });
  });

  // Set min date to today
  const dateInput = form.querySelector('input[type="date"]');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    const inputs     = form.querySelectorAll('input, select, textarea');
    let allValid     = true;

    inputs.forEach(input => {
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      const firstError = form.querySelector('.error');
      if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    // Simulate submit
    const submitBtn = form.querySelector('[type="submit"]');
    setSubmitButtonState(submitBtn, true, 'Sending...');

    const serviceInput = form.querySelector('#service');
    const selectedService = serviceInput?.selectedOptions?.[0]?.textContent?.trim() || serviceInput?.value || '';
    const templateParams = {
      form_type: 'Appointment Request',
      submitted_at: new Date().toLocaleString(),
      full_name: form.querySelector('#fullName')?.value.trim() || '',
      phone: form.querySelector('#phone')?.value.trim() || '',
      email: form.querySelector('#email')?.value.trim() || '',
      vehicle: form.querySelector('#vehicle')?.value.trim() || '',
      service: selectedService,
      preferred_date: form.querySelector('#date')?.value || '',
      message: form.querySelector('#message')?.value.trim() || 'No additional notes provided.',
      reply_to: form.querySelector('#email')?.value.trim() || ''
    };

    sendWithEmailJs('appointment', templateParams)
      .then(() => {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      })
      .catch(error => {
        console.error('EmailJS appointment send failed:', error);
        alert('We could not send your appointment right now. Please call us at (781) 255-7368.');
        setSubmitButtonState(submitBtn, false);
      });
  });
}

/* =====================================================
   CONTACT FORM — VALIDATION
   ===================================================== */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('contact-success');
  if (!form) return;

  const validators = {
    name:    val => val.trim().length >= 2 || 'Please enter your name.',
    email:   val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()) || 'Enter a valid email.',
    message: val => val.trim().length >= 10 || 'Message must be at least 10 characters.'
  };

  form.querySelectorAll('input, textarea').forEach(input => {
    input.addEventListener('blur', () => {
      const validator = validators[input.name];
      if (!validator) return;
      const result = validator(input.value);
      const group  = input.closest('.form-group');
      const errEl  = group?.querySelector('.form-error');

      if (result !== true) {
        input.classList.add('error');
        if (errEl) { errEl.textContent = result; errEl.classList.add('visible'); }
      } else {
        input.classList.remove('error');
        if (errEl) { errEl.classList.remove('visible'); }
      }
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const inputs = form.querySelectorAll('input, textarea');
    let allValid = true;

    inputs.forEach(input => {
      const validator = validators[input.name];
      if (!validator) return;
      const result = validator(input.value);
      const group  = input.closest('.form-group');
      const errEl  = group?.querySelector('.form-error');

      if (result !== true) {
        allValid = false;
        input.classList.add('error');
        if (errEl) { errEl.textContent = result; errEl.classList.add('visible'); }
      }
    });

    if (!allValid) return;

    const btn = form.querySelector('[type="submit"]');
    setSubmitButtonState(btn, true, 'Sending...');

    const templateParams = {
      form_type: 'Contact Message',
      submitted_at: new Date().toLocaleString(),
      name: form.querySelector('#contact-name')?.value.trim() || '',
      email: form.querySelector('#contact-email')?.value.trim() || '',
      subject: form.querySelector('#contact-subject')?.value.trim() || 'General inquiry',
      message: form.querySelector('#contact-message')?.value.trim() || '',
      reply_to: form.querySelector('#contact-email')?.value.trim() || ''
    };

    sendWithEmailJs('contact', templateParams)
      .then(() => {
        form.style.display = 'none';
        if (success) success.classList.add('show');
      })
      .catch(error => {
        console.error('EmailJS contact send failed:', error);
        alert('We could not send your message right now. Please email norwoodgulfservice@gmail.com.');
        setSubmitButtonState(btn, false);
      });
  });
}

/* =====================================================
   FAQ TOGGLES
   ===================================================== */
function initFaq() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all
      faqItems.forEach(i => i.classList.remove('active'));

      // Open clicked item (if it was closed)
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // Open first FAQ by default
  faqItems[0].classList.add('active');
}

/* =====================================================
   COUNTER ANIMATION
   ===================================================== */
function initCounters() {
  const statNumbers = document.querySelectorAll('[data-count]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      let current  = 0;
      const step   = Math.ceil(target / 60);

      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current.toLocaleString() + suffix;
        if (current >= target) clearInterval(timer);
      }, 20);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

/* =====================================================
   NVIDIA CHATBOT
   ===================================================== */
function initNvidiaChatbot() {
  console.log('=== Initializing NVIDIA Chatbot ===');
  
  const chatbot = document.getElementById('nvidia-chatbot');
  const chatWindow = document.getElementById('nvidia-chat-window');
  const chatClose = document.getElementById('nvidia-chat-close');
  const chatInput = document.getElementById('nvidia-chat-input');
  const chatSend = document.getElementById('nvidia-chat-send');
  const chatMessages = document.getElementById('nvidia-chat-messages');
  
  console.log('Chatbot elements found:', {
    chatbot: !!chatbot,
    chatWindow: !!chatWindow,
    chatClose: !!chatClose,
    chatInput: !!chatInput,
    chatSend: !!chatSend,
    chatMessages: !!chatMessages
  });
  
  if (!chatbot || !chatWindow || !chatClose || !chatInput || !chatSend || !chatMessages) {
    console.error('Missing chatbot elements!');
    return;
  }

  let isOpen = false;
  const nvidiaApiKey = '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';

  console.log('NVIDIA API key loaded:', nvidiaApiKey ? 'Key present' : 'Key missing');

  // Test function to verify chatbot is working
  function testChatbot() {
    console.log('=== Testing Chatbot Functionality ===');
    
    // Test 1: Check if all elements exist
    const elementsExist = chatbot && chatWindow && chatClose && chatInput && chatSend && chatMessages;
    console.log('All chatbot elements exist:', elementsExist);
    
    // Test 2: Try to add a test message
    if (elementsExist) {
      console.log('Adding test message...');
      addMessage('Test message from chatbot - this should appear!', false);
      
      // Test 3: Check if message was added
      setTimeout(() => {
        const testMessage = chatMessages.querySelector('.nvidia-chat-message:last-child');
        if (testMessage) {
          console.log('✅ Test message successfully added!');
        } else {
          console.log('❌ Test message failed to add');
        }
      }, 1000);
    }
    
    console.log('=== Chatbot Test Complete ===');
  }

  function toggleChat() {
    isOpen = !isOpen;
    chatWindow.classList.toggle('open');
    document.body.classList.toggle('chat-open');
  }

  function closeChat() {
    isOpen = false;
    chatWindow.classList.remove('open');
    document.body.classList.remove('chat-open');
  }

  function addMessage(message, isUser = false, isTyping = false) {
    console.log('Adding message:', { message, isUser, isTyping });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `nvidia-chat-message ${isUser ? 'user' : 'bot'}`;
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    messageDiv.appendChild(messageText);
    
    if (isTyping) {
      const typingIndicator = document.createElement('div');
      typingIndicator.className = 'typing-indicator';
      typingIndicator.innerHTML = '<span>AI is typing...</span>';
      messageDiv.appendChild(typingIndicator);
    }
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showTypingIndicator() {
    console.log('Showing typing indicator');
    addMessage('', false, true);
  }

  function hideTypingIndicator() {
    console.log('Hiding typing indicator');
    const typingIndicators = chatMessages.querySelectorAll('.typing-indicator');
    typingIndicators.forEach(indicator => indicator.remove());
  }

  async function callNvidiaAPI(userMessage) {
    console.log('Calling NVIDIA API with message:', userMessage);
    
    // Check if we're in a local environment (localhost or opening file directly)
    const isLocalhost = window.location.hostname === 'localhost' || 
                        window.location.hostname === '127.0.0.1' ||
                        window.location.protocol === 'file:';
    
    if (isLocalhost) {
      console.log('Running in local environment - using Intelligent Local Fallback');
      showTypingIndicator();
      
      setTimeout(() => {
        hideTypingIndicator();
        const input = userMessage.toLowerCase();
        let response = "";

        // Intelligent Local Fallback Logic
        if (input.includes('hour') || input.includes('open') || input.includes('close')) {
          response = "Norwood Gulf Auto Care is open Monday through Friday from 7:00 AM to 6:00 PM, and Saturdays from 7:00 AM to 3:00 PM. We are closed for service on Sundays, although our fuel station and C-store remain open.";
        } else if (input.includes('service') || input.includes('repair') || input.includes('fix')) {
          response = "We offer a wide range of services including engine diagnostics, brake repair, oil changes, transmission service, tire services, AC/climate control, and general maintenance. Which service are you interested in?";
        } else if (input.includes('location') || input.includes('address') || input.includes('where')) {
          response = "We are located at 707 Neponset Street, Norwood, MA 02062. You can also find a map on our Contact page!";
        } else if (input.includes('phone') || input.includes('call') || input.includes('contact')) {
          response = "You can reach us at (781) 255-7368. We also offer local pick-up and drop-off to all our customers!";
        } else if (input.includes('appointment') || input.includes('book') || input.includes('schedule')) {
          response = "You can schedule an appointment directly on our website using the 'Book Appointment' page, or by calling us at (781) 255-7368.";
        } else if (input.includes('price') || input.includes('cost') || input.includes('estimate')) {
          response = "We provide free estimates for all recommended work. For specific pricing, it's best to bring your vehicle in for a quick diagnostic or give us a call with your vehicle details.";
        } else {
          response = "Hello! I'm currently running in 'Offline Preview Mode' because the website is being viewed as a local file. Once the site is live, I'll be fully powered by NVIDIA AI! In the meantime, I can still help you with questions about our hours, services, location, or appointments.";
        }
        
        addMessage(response, false);
      }, 1000);
      return;
    }
    
    try {
      showTypingIndicator();
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      hideTypingIndicator();
      
      if (data.choices && data.choices[0] && data.choices[0].message) {
        addMessage(data.choices[0].message.content.trim(), false);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (error) {
      hideTypingIndicator();
      console.error('NVIDIA API Error:', error);
      
      // FALLBACK TO LOCAL INTELLIGENCE ON ERROR (CORS, NETWORK, ETC)
      const input = userMessage.toLowerCase();
      let response = "";
      
      if (input.includes('hour') || input.includes('open') || input.includes('close')) {
        response = "Norwood Gulf Auto Care is open Monday through Friday from 7:00 AM to 6:00 PM, and Saturdays from 7:00 AM to 3:00 PM. Service is closed on Sundays.";
      } else if (input.includes('service') || input.includes('repair') || input.includes('fix')) {
        response = "We provide expert engine diagnostics, brake repair, oil changes, transmission service, tire services, and more. How can we help you today?";
      } else if (input.includes('location') || input.includes('address') || input.includes('where')) {
        response = "You can find us at 707 Neponset Street, Norwood, MA 02062.";
      } else if (input.includes('phone') || input.includes('call') || input.includes('contact')) {
        response = "Please reach out to us at (781) 255-7368 for any immediate needs!";
      } else {
        response = "I'm currently in 'High-Security Mode' and having trouble connecting to my central brain. For any questions about services or appointments, please call us at (781) 255-7368!";
      }
      
      addMessage(response, false);
    }
  }

  function sendMessage() {
    console.log('Send message called');
    const message = chatInput.value.trim();
    if (!message) {
      console.log('Empty message, not sending');
      return;
    }
    
    addMessage(message, true);
    chatInput.value = '';
    
    console.log('Calling NVIDIA API...');
    callNvidiaAPI(message);
  }

  // Event listeners
  console.log('Setting up event listeners');
  
  if (chatbot) {
    chatbot.addEventListener('click', () => {
      console.log('Chatbot clicked');
      toggleChat();
    });
  }
  
  if (chatClose) {
    chatClose.addEventListener('click', () => {
      console.log('Close button clicked');
      closeChat();
    });
  }
  
  if (chatSend) {
    chatSend.addEventListener('click', () => {
      console.log('Send button clicked');
      sendMessage();
    });
  }
  
  if (chatInput) {
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        console.log('Enter key pressed');
        sendMessage();
      }
    });
  }
  
  console.log('Event listeners setup complete');
  
  // Run test function
  testChatbot();
}

/**
 * Toggle Service Categories on Services Page
 */
function initServiceCategories() {
  const categories = document.querySelectorAll('.category-header');
  if (!categories.length) return;

  window.toggleServiceCategory = function(header) {
    const category = header.parentElement;
    const servicesList = category.querySelector('.services-list');
    
    if (servicesList.style.display === 'none' || servicesList.style.display === '') {
      servicesList.style.display = 'grid';
      category.classList.remove('collapsed');
    } else {
      servicesList.style.display = 'none';
      category.classList.add('collapsed');
    }
  };
}

/* =====================================================
   INIT ALL
   ===================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Test EmailJS configuration first
  testEmailJsConfig();
  
  initScrollProgress();
  initNavbar();
  initScrollReveal();
  initCarousel();
  initBackToTop();
  initAccordion();
  initAppointmentForm();
  initContactForm();
  initFaq();
  initCounters();
  initNvidiaChatbot();
  initServiceCategories();
});

