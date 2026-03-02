// /**
//  * Portfolio Odoo Expert - Main JavaScript
//  * Fonctionnalités principales et animations
//  */

// // ===================================
// // CONFIGURATION ET VARIABLES GLOBALES
// // ===================================

// const CONFIG = {
//     API_BASE_URL: '/tables',
//     ANIMATION_DURATION: 300,
//     SCROLL_OFFSET: 100,
//     DEBOUNCE_DELAY: 250,
//     TYPING_SPEED: 50,
//     AUTO_SCROLL_SPEED: 0.8
// };

// const state = {
//     isScrolling: false,
//     lastScrollY: 0,
//     currentSection: 'accueil',
//     isMenuOpen: false,
//     isChatOpen: false
// };

// // ===================================
// // UTILITAIRES
// // ===================================

// const utils = {
//     // Débounce function
//     debounce: (func, wait) => {
//         let timeout;
//         return function executedFunction(...args) {
//             const later = () => {
//                 clearTimeout(timeout);
//                 func(...args);
//             };
//             clearTimeout(timeout);
//             timeout = setTimeout(later, wait);
//         };
//     },

//     // Throttle function
//     throttle: (func, limit) => {
//         let inThrottle;
//         return function() {
//             const args = arguments;
//             const context = this;
//             if (!inThrottle) {
//                 func.apply(context, args);
//                 inThrottle = true;
//                 setTimeout(() => inThrottle = false, limit);
//             }
//         };
//     },

//     // Animation d'écriture
//     typeWriter: (element, text, speed = CONFIG.TYPING_SPEED) => {
//         let i = 0;
//         element.innerHTML = '';
        
//         function typeWriter() {
//             if (i < text.length) {
//                 element.innerHTML += text.charAt(i);
//                 i++;
//                 setTimeout(typeWriter, speed);
//             }
//         }
//         typeWriter();
//     },

//     // Observer pour les animations au scroll
//     createIntersectionObserver: (callback, options = {}) => {
//         const defaultOptions = {
//             threshold: 0.1,
//             rootMargin: '0px 0px -50px 0px'
//         };
        
//         return new IntersectionObserver(callback, { ...defaultOptions, ...options });
//     },

//     // Générer un ID unique
//     generateId: () => {
//         return Date.now().toString(36) + Math.random().toString(36).substr(2);
//     },

//     // Formater une date
//     formatDate: (date) => {
//         return new Intl.DateTimeFormat('fr-FR', {
//             day: '2-digit',
//             month: '2-digit',
//             year: 'numeric'
//         }).format(new Date(date));
//     },

//     // Formater l'heure
//     formatTime: (date) => {
//         return new Intl.DateTimeFormat('fr-FR', {
//             hour: '2-digit',
//             minute: '2-digit'
//         }).format(new Date(date));
//     },

//     // Validation email
//     validateEmail: (email) => {
//         const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//         return re.test(email);
//     },

//     // Validation téléphone
//     validatePhone: (phone) => {
//         const re = /^[\d\s\-\+\(\)]+$/;
//         return re.test(phone);
//     },

//     // Afficher une notification
//     showNotification: (message, type = 'info', duration = 3000) => {
//         const notification = document.createElement('div');
//         notification.className = `notification notification-${type}`;
//         notification.innerHTML = `
//             <div class="notification-content">
//                 <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
//                 <span>${message}</span>
//             </div>
//             <button class="notification-close" onclick="this.parentElement.remove()">
//                 <i class="fas fa-times"></i>
//             </button>
//         `;
        
//         document.body.appendChild(notification);
        
//         // Animation d'entrée
//         setTimeout(() => notification.classList.add('show'), 100);
        
//         // Suppression automatique
//         if (duration > 0) {
//             setTimeout(() => {
//                 notification.classList.remove('show');
//                 setTimeout(() => notification.remove(), 300);
//             }, duration);
//         }
//     }
// };

// // ===================================
// // NAVIGATION ET SCROLL
// // ===================================

// const navigation = {
//     init: () => {
//         navigation.setupNavbarScroll();
//         navigation.setupSmoothScroll();
//         navigation.setupActiveNavigation();
//         navigation.setupMobileMenu();
//     },

//     // Gestion du scroll de la navbar
//     setupNavbarScroll: () => {
//         const navbar = document.getElementById('navbar');
//         let lastScrollY = window.scrollY;
        
//         window.addEventListener('scroll', utils.throttle(() => {
//             const currentScrollY = window.scrollY;
            
//             if (currentScrollY > 100) {
//                 navbar.classList.add('scrolled');
//             } else {
//                 navbar.classList.remove('scrolled');
//             }
            
//             // Cacher/montrer la navbar selon la direction du scroll
//             if (currentScrollY > lastScrollY && currentScrollY > 200) {
//                 navbar.classList.add('navbar-hidden');
//             } else {
//                 navbar.classList.remove('navbar-hidden');
//             }
            
//             lastScrollY = currentScrollY;
//         }, 100));
//     },

//     // Scroll fluide vers les ancres
//     setupSmoothScroll: () => {
//         document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//             anchor.addEventListener('click', function (e) {
//                 e.preventDefault();
//                 const target = document.querySelector(this.getAttribute('href'));
//                 if (target) {
//                     const offsetTop = target.offsetTop - CONFIG.SCROLL_OFFSET;
//                     window.scrollTo({
//                         top: offsetTop,
//                         behavior: 'smooth'
//                     });
                    
//                     // Fermer le menu mobile si ouvert
//                     if (state.isMenuOpen) {
//                         navigation.toggleMobileMenu();
//                     }
//                 }
//             });
//         });
//     },

//     // Navigation active selon la section visible
//     setupActiveNavigation: () => {
//         const sections = document.querySelectorAll('section[id]');
//         const navLinks = document.querySelectorAll('.nav-link');
        
//         const observer = utils.createIntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const currentSection = entry.target.id;
                    
//                     // Mettre à jour le lien actif
//                     navLinks.forEach(link => {
//                         link.classList.remove('active');
//                         if (link.getAttribute('href') === `#${currentSection}`) {
//                             link.classList.add('active');
//                         }
//                     });
                    
//                     state.currentSection = currentSection;
//                 }
//             });
//         });
        
//         sections.forEach(section => observer.observe(section));
//     },

//     // Menu mobile
//     setupMobileMenu: () => {
//         const navToggle = document.getElementById('nav-toggle');
//         const navMenu = document.getElementById('nav-menu');
        
//         if (navToggle && navMenu) {
//             navToggle.addEventListener('click', navigation.toggleMobileMenu);
            
//             // Fermer le menu en cliquant sur un lien
//             navMenu.querySelectorAll('.nav-link').forEach(link => {
//                 link.addEventListener('click', () => {
//                     if (state.isMenuOpen) {
//                         navigation.toggleMobileMenu();
//                     }
//                 });
//             });
//         }
//     },

//     toggleMobileMenu: () => {
//         const navMenu = document.getElementById('nav-menu');
//         const navToggle = document.getElementById('nav-toggle');
        
//         state.isMenuOpen = !state.isMenuOpen;
        
//         if (state.isMenuOpen) {
//             navMenu.classList.add('active');
//             navToggle.classList.add('active');
//             document.body.style.overflow = 'hidden';
//         } else {
//             navMenu.classList.remove('active');
//             navToggle.classList.remove('active');
//             document.body.style.overflow = '';
//         }
//     }
// };

// // ===================================
// // ANIMATIONS AU SCROLL
// // ===================================

// const animations = {
//     init: () => {
//         animations.setupScrollAnimations();
//         animations.setupCounterAnimations();
//         animations.setupSkillBars();
//     },

//     // Animations d'apparition au scroll
//     setupScrollAnimations: () => {
//         const animatedElements = document.querySelectorAll('.service-card, .expertise-category, .portfolio-item, .contact-item');
        
//         const observer = utils.createIntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('animate-in');
//                 }
//             });
//         });
        
//         animatedElements.forEach(element => observer.observe(element));
//     },

//     // Animation des compteurs
//     setupCounterAnimations: () => {
//         const counters = document.querySelectorAll('.stat-number');
        
//         const observer = utils.createIntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const counter = entry.target;
//                     const target = parseInt(counter.textContent.replace(/\D/g, ''));
//                     const suffix = counter.textContent.replace(/\d/g, '');
                    
//                     animations.animateCounter(counter, 0, target, suffix, 2000);
//                 }
//             });
//         });
        
//         counters.forEach(counter => observer.observe(counter));
//     },

//     // Fonction d'animation du compteur
//     animateCounter: (element, start, end, suffix, duration) => {
//         const startTime = performance.now();
        
//         const animate = (currentTime) => {
//             const elapsed = currentTime - startTime;
//             const progress = Math.min(elapsed / duration, 1);
            
//             const current = Math.floor(progress * (end - start) + start);
//             element.textContent = current + suffix;
            
//             if (progress < 1) {
//                 requestAnimationFrame(animate);
//             }
//         };
        
//         requestAnimationFrame(animate);
//     },

//     // Animation des barres de compétences
//     setupSkillBars: () => {
//         const skillBars = document.querySelectorAll('.skill-progress');
        
//         const observer = utils.createIntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     const bar = entry.target;
//                     const width = bar.style.width;
//                     bar.style.width = '0%';
                    
//                     setTimeout(() => {
//                         bar.style.width = width;
//                     }, 200);
//                 }
//             });
//         });
        
//         skillBars.forEach(bar => observer.observe(bar));
//     }
// };

// // ===================================
// // HERO ANIMATIONS
// // ===================================

// const heroAnimations = {
//     init: () => {
//         heroAnimations.setupCodeAnimation();
//         heroAnimations.setupHeroTextAnimation();
//     },

//     // Animation du code
//     setupCodeAnimation: () => {
//         const codeBlock = document.querySelector('.code-content pre');
//         if (!codeBlock) return;
        
//         const code = `class OdooModule:
//     def __init__(self):
//         self.name = "Custom Module"
//         self.version = "17.0"
    
//     def install(self):
//         # Installation personnalisée
//         return True
    
//     def configure(self):
//         # Configuration avancée
//         pass
    
//     def validate(self):
//         # Validation des données
//         return True`;
        
//         let index = 0;
        
//         const typeCode = () => {
//             if (index < code.length) {
//                 codeBlock.textContent = code.substring(0, index);
//                 index++;
//                 setTimeout(typeCode, CONFIG.TYPING_SPEED);
//             }
//         };
        
//         // Démarrer l'animation après un délai
//         setTimeout(typeCode, 1000);
//     },

//     // Animation du texte du hero
//     setupHeroTextAnimation: () => {
//         const heroTitle = document.querySelector('.hero-title');
//         if (!heroTitle) return;
        
//         const words = heroTitle.textContent.split(' ');
//         heroTitle.innerHTML = words.map(word => 
//             `<span class="word">${word}</span>`
//         ).join(' ');
        
//         // Animer chaque mot
//         const wordElements = heroTitle.querySelectorAll('.word');
//         wordElements.forEach((word, index) => {
//             word.style.opacity = '0';
//             word.style.transform = 'translateY(20px)';
            
//             setTimeout(() => {
//                 word.style.transition = 'all 0.6s ease';
//                 word.style.opacity = '1';
//                 word.style.transform = 'translateY(0)';
//             }, index * 100);
//         });
//     }
// };

// // ===================================
// // PORTFOLIO FILTERS
// // ===================================

// /* const portfolioFilters = {
//     init: () => {
//         portfolioFilters.setupFilters();
//         portfolioFilters.loadPortfolioItems();
//     },

//     setupFilters: () => {
//         const filterButtons = document.querySelectorAll('.filter-btn');
        
//         filterButtons.forEach(button => {
//             button.addEventListener('click', () => {
//                 // Retirer la classe active de tous les boutons
//                 filterButtons.forEach(btn => btn.classList.remove('active'));
                
//                 // Ajouter la classe active au bouton cliqué
//                 button.classList.add('active');
                
//                 // Filtrer les éléments
//                 const filter = button.getAttribute('data-filter');
//                 portfolioFilters.filterItems(filter);
//             });
//         });
//     },

//     filterItems: (filter) => {
//         const portfolioGrid = document.getElementById('portfolio-grid');
//         const items = portfolioGrid.querySelectorAll('.portfolio-item');
        
//         items.forEach(item => {
//             const category = item.getAttribute('data-category');
            
//             if (filter === 'all' || category === filter) {
//                 item.style.display = 'block';
//                 setTimeout(() => {
//                     item.classList.add('show');
//                 }, 100);
//             } else {
//                 item.classList.remove('show');
//                 setTimeout(() => {
//                     item.style.display = 'none';
//                 }, 300);
//             }
//         });
//     },

//     loadPortfolioItems: async () => {
//         try {
//             const response = await fetch(`${CONFIG.API_BASE_URL}/portfolio_projects?limit=6&sort=completion_date:desc`);
//             const data = await response.json();
            
//             portfolioFilters.renderPortfolioItems(data.data);
//         } catch (error) {
//             console.error('Erreur lors du chargement des projets:', error);
//             portfolioFilters.renderPortfolioItems(portfolioFilters.getFallbackData());
//         }
//     },

//     renderPortfolioItems: (projects) => {
//         const portfolioGrid = document.getElementById('portfolio-grid');
        
//         portfolioGrid.innerHTML = projects.map(project => `
//             <div class="portfolio-item" data-category="${project.category}">
//                 <div class="portfolio-image-wrapper">
//                     <img src="${project.image_url}" 
//                          alt="${project.id}" 
//                          class="portfolio-image"
//                          loading="lazy">
//                     <div class="portfolio-overlay">
//                         <div class="portfolio-overlay-content">
//                             <h4>${project.title}</h4>
//                             <p>${project.client_name}</p>
//                         </div>
//                     </div>
//                 </div>
//                 <div class="portfolio-content">
//                     <div class="portfolio-tags">
//                         ${project.modules_affected.map(module => 
//                             `<span class="portfolio-tag">${module}</span>`
//                         ).join('')}
//                     </div>
//                     <h3 class="portfolio-title">${project.title}</h3>
//                     <p class="portfolio-description">${project.description}</p>
//                     <div class="portfolio-meta">
//                         <span class="portfolio-client">
//                             <i class="fas fa-building"></i>
//                             ${project.client_name}
//                         </span>
//                         <span class="portfolio-duration">
//                             <i class="fas fa-calendar"></i>
//                             ${project.project_duration}
//                         </span>
//                     </div>
//                     <a href="#" class="portfolio-link" onclick="portfolioFilters.showProjectDetails('${project.id}')">
//                         Voire les détails <i class="fas fa-arrow-right"></i>
//                     </a>
//                 </div>
//             </div>
//         `).join('');
//     },

//     getFallbackData: () => {
//         return [
//             {
//                 id: '1',
//                 title: 'Système de Gestion Commerciale',
//                 category: 'development',
//                 description: 'Développement d\'un module de gestion commerciale intégré pour une PME de 50 collaborateurs.',
//                 client_name: 'TechnoLog France',
//                 project_duration: '4 mois',
//                 modules_affected: ['CRM', 'Sales', 'Accounting'],
//                 image_url: '/images/KD.jpg'
//             },
//             {
//                 id: '2',
//                 title: 'Personnalisation Module RH',
//                 category: 'customization',
//                 description: 'Personnalisation complète du module RH pour une entreprise de services avec gestion des compétences.',
//                 client_name: 'ServicePro Solutions',
//                 project_duration: '3 mois',
//                 modules_affected: ['HR', 'Calendar'],
//                 image_url: '/images/KD.jpg'
//             },
            
//         ];
//     },

//     showProjectDetails: (projectId) => {
//         // Implémentation pour afficher les détails du projet dans une modale
//         utils.showNotification('Détails du projet bientôt disponibles!', 'info');
//     }
// }; */

// // ===================================
// // INITIALISATION
// // ===================================

// const app = {
//     init: () => {
//         // Initialiser les modules dans l'ordre
//         navigation.init();
//         animations.init();
//         heroAnimations.init();
//         portfolioFilters.init();
        
//         // Initialiser les autres modules
//         if (typeof contactForm !== 'undefined') {
//             contactForm.init();
//         }
        
//         if (typeof chatWidget !== 'undefined') {
//             chatWidget.init();
//         }
        
//         // Ajouter des styles CSS pour les animations
//         app.addAnimationStyles();
        
//         // Marquer l'application comme chargée
//         document.body.classList.add('app-loaded');
        
//         console.log('✅ Portfolio Odoo Expert chargé avec succès!');
//     },

//     addAnimationStyles: () => {
//         const style = document.createElement('style');
//         style.textContent = `
//             .notification {
//                 position: fixed;
//                 top: 20px;
//                 right: 20px;
//                 background: var(--secondary-black);
//                 color: var(--white);
//                 padding: 15px 20px;
//                 border-radius: 8px;
//                 box-shadow: var(--shadow-heavy);
//                 border-left: 4px solid var(--primary-orange);
//                 z-index: var(--z-tooltip);
//                 max-width: 400px;
//                 transform: translateX(100%);
//                 transition: transform 0.3s ease;
//             }
            
//             .notification.show {
//                 transform: translateX(0);
//             }
            
//             .notification-success {
//                 border-left-color: var(--success);
//             }
            
//             .notification-error {
//                 border-left-color: var(--error);
//             }
            
//             .notification-content {
//                 display: flex;
//                 align-items: center;
//                 gap: 10px;
//             }
            
//             .notification-close {
//                 background: none;
//                 border: none;
//                 color: var(--light-gray);
//                 cursor: pointer;
//                 margin-left: 10px;
//                 padding: 5px;
//                 border-radius: 50%;
//                 transition: color 0.2s ease;
//             }
            
//             .notification-close:hover {
//                 color: var(--white);
//             }
            
//             .navbar-hidden {
//                 transform: translateY(-100%);
//             }
            
//             .animate-in {
//                 animation: slideInUp 0.6s ease forwards;
//             }
            
//             @keyframes slideInUp {
//                 from {
//                     opacity: 0;
//                     transform: translateY(30px);
//                 }
//                 to {
//                     opacity: 1;
//                     transform: translateY(0);
//                 }
//             }
            
//             .portfolio-item.show {
//                 animation: fadeIn 0.5s ease forwards;
//             }
            
//             @keyframes fadeIn {
//                 from {
//                     opacity: 0;
//                 }
//                 to {
//                     opacity: 1;
//                 }
//             }
            
//             .app-loaded {
//                 animation: fadeIn 0.8s ease;
//             }
            
//             @media (max-width: 768px) {
//                 .notification {
//                     left: 15px;
//                     right: 15px;
//                     max-width: none;
//                 }
//             }
//         `;
//         document.head.appendChild(style);
//     }
// };

// // ===================================
// // CHARGEMENT DE L'APPLICATION
// // ===================================

// // Attendre que le DOM soit chargé
// document.addEventListener('DOMContentLoaded', () => {
//     // Ajouter un petit délai pour que tout soit bien rendu
//     setTimeout(() => {
//         app.init();
//     }, 100);
// });

// // Gestionnaire d'erreur global
// window.addEventListener('error', (event) => {
//     console.error('Erreur JavaScript:', event.error);
//     utils.showNotification('Une erreur est survenue. Veuillez recharger la page.', 'error', 5000);
// });

// // Gestionnaire de rejet de promesse non capturé
// window.addEventListener('unhandledrejection', (event) => {
//     console.error('Promesse non gérée:', event.reason);
//     utils.showNotification('Une erreur de connexion est survenue.', 'error', 5000);
// });

// // Export pour utilisation dans d'autres modules
// window.utils = utils;
// window.CONFIG = CONFIG;