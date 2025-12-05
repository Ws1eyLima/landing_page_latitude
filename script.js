// ============================================
// SMOOTH SCROLL
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scroll para links com classe smooth-scroll
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            
            if (targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const navbarHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Fechar menu mobile se estiver aberto
                    const navMenu = document.getElementById('navMenu');
                    const menuToggle = document.getElementById('menuToggle');
                    if (navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                }
            }
        });
    });
});

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// MOBILE MENU TOGGLE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
        
        // Fechar menu ao clicar fora
        document.addEventListener('click', function(e) {
            if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    }
});

// ============================================
// INTERSECTION OBSERVER - FADE IN ANIMATIONS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: parar de observar após animação
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar todos os elementos com classe fade-in-up
    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(element => {
        observer.observe(element);
    });
});

// ============================================
// FORM VALIDATION & HANDLING
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const leadForm = document.getElementById('leadForm');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('emailInput');
    const formMessage = document.getElementById('formMessage');
    
    if (leadForm) {
        leadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = nomeInput ? nomeInput.value.trim() : '';
            const email = emailInput.value.trim();
            
            // Reset message
            formMessage.classList.remove('success', 'error');
            formMessage.textContent = '';
            formMessage.style.display = 'none';
            
            // Validação básica de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!email) {
                showFormMessage('Por favor, insira seu e-mail.', 'error');
                emailInput.focus();
                return;
            }
            
            if (!emailRegex.test(email)) {
                showFormMessage('Por favor, insira um e-mail válido.', 'error');
                emailInput.focus();
                return;
            }
            
            // Simular envio (aqui você pode integrar com sua API)
            // Por enquanto, apenas redireciona para a página de agradecimento
            submitLead(nome, email);
        });
    }
    
    async function submitLead(nome, email) {
        // Disable form inputs during submission
        if (nomeInput) nomeInput.disabled = true;
        emailInput.disabled = true;
        const submitButton = leadForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.textContent = 'Cadastrando...';
        submitButton.disabled = true;
        
        try {
            // Send data to backend API
            const response = await fetch('/api/lead', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    nome: nome || ''
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Success - redirect to thank you page
                window.location.href = 'obrigado.html';
            } else {
                // Error from API
                const errorMessage = data.error || 'Erro ao processar seu cadastro. Tente novamente.';
                showFormMessage(errorMessage, 'error');
                
                // Re-enable form
                if (nomeInput) nomeInput.disabled = false;
                emailInput.disabled = false;
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        } catch (error) {
            // Network or other error
            console.error('Error submitting form:', error);
            showFormMessage('Erro de conexão. Verifique sua internet e tente novamente.', 'error');
            
            // Re-enable form
            if (nomeInput) nomeInput.disabled = false;
            emailInput.disabled = false;
            submitButton.textContent = originalButtonText;
            submitButton.disabled = false;
        }
    }
    
    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.classList.add(type);
        formMessage.style.display = 'block';
    }
});

// ============================================
// ENHANCED SCROLL ANIMATIONS
// ============================================

// Adicionar delay escalonado para cards de benefícios
document.addEventListener('DOMContentLoaded', function() {
    const benefitCards = document.querySelectorAll('.benefit-card');
    benefitCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    const showcaseItems = document.querySelectorAll('.showcase-item');
    showcaseItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Lazy loading para imagens (fallback caso o navegador não suporte nativo)
document.addEventListener('DOMContentLoaded', function() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// ============================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================

// Melhorar navegação por teclado
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menuToggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const menuToggle = document.getElementById('menuToggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        }
    });
});

// ============================================
// COUNTDOWN TIMER
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Criar data alvo: 15 de dezembro de 2025 às 00:00 (horário local)
    const targetDate = new Date(2025, 11, 15, 0, 0, 0).getTime(); // Mês 11 = dezembro (0-indexed)
    const daysElement = document.getElementById('days');
    const hoursElement = document.getElementById('hours');
    const minutesElement = document.getElementById('minutes');
    const secondsElement = document.getElementById('seconds');
    const timerElement = document.getElementById('timer');
    const countdownContent = document.querySelector('.countdown-content');
    
    if (!timerElement) return;
    
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;
        
        if (distance < 0) {
            // Countdown terminou
            if (countdownContent) {
                countdownContent.innerHTML = '<h2 class="countdown-title" style="color: var(--indian-red);">O Drop 001 já começou!</h2>';
            }
            return;
        }
        
        // Calcular dias, horas, minutos e segundos
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Atualizar elementos com animação
        if (daysElement) {
            const oldValue = daysElement.textContent;
            daysElement.textContent = days.toString().padStart(2, '0');
            if (oldValue !== daysElement.textContent) {
                daysElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    daysElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
        if (hoursElement) {
            const oldValue = hoursElement.textContent;
            hoursElement.textContent = hours.toString().padStart(2, '0');
            if (oldValue !== hoursElement.textContent) {
                hoursElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    hoursElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
        if (minutesElement) {
            const oldValue = minutesElement.textContent;
            minutesElement.textContent = minutes.toString().padStart(2, '0');
            if (oldValue !== minutesElement.textContent) {
                minutesElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    minutesElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
        if (secondsElement) {
            const oldValue = secondsElement.textContent;
            secondsElement.textContent = seconds.toString().padStart(2, '0');
            if (oldValue !== secondsElement.textContent) {
                secondsElement.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    secondsElement.style.transform = 'scale(1)';
                }, 200);
            }
        }
    }
    
    // Atualizar imediatamente
    updateCountdown();
    
    // Atualizar a cada segundo
    setInterval(updateCountdown, 1000);
});

