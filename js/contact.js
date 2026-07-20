/**
 * Portfolio Odoo Expert - Contact Module
 * Version Web3Forms avec AJAX - Ne recharge pas la page
 */

// Debounce utilitaire
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Notification
function showNotification(message, type = 'success', duration = 4000) {
    const existing = document.getElementById('contact-notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.id = 'contact-notification';
    notif.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 9999;
        padding: 14px 20px; border-radius: 8px; max-width: 360px;
        font-size: 15px; font-weight: 500; box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        display: flex; align-items: center; gap: 10px;
        animation: slideInNotif 0.3s ease;
        background: ${type === 'success' ? '#4caf50' : '#f44336'};
        color: #fff;
        border-left: ${type === 'success' ? '4px solid #2e7d32' : '4px solid #b71c1c'};
    `;
    const iconEl = document.createElement('i');
    iconEl.className = `fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}`;
    iconEl.style.fontSize = '20px';
    notif.appendChild(iconEl);
    notif.appendChild(document.createTextNode(' ' + message));

    if (!document.getElementById('notif-anim-style')) {
        const s = document.createElement('style');
        s.id = 'notif-anim-style';
        s.textContent = `@keyframes slideInNotif {
            from { opacity:0; transform: translateX(40px); }
            to   { opacity:1; transform: translateX(0); }
        }`;
        document.head.appendChild(s);
    }

    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), duration);
}

const contactForm = {
    // Configuration Web3Forms
    web3forms: {
        accessKey: '84d40f6d-2b4d-42a9-953c-82431c3fdbb4'
    },

    // Configuration validation
    config: {
        validation: {
            name: {
                required: true,
                minLength: 2,
                maxLength: 100,
                pattern: /^[a-zA-ZÀ-ÿ\s\-\']+$/
            },
            email: {
                required: true,
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            },
            subject: {
                required: true
            },
            message: {
                required: true,
                minLength: 20,
                maxLength: 2000
            }
        }
    },

    // État du formulaire
    state: {
        isSubmitting: false,
        errors: {}
    },

    // Initialisation
    init: () => {
        contactForm.setupForm();
        contactForm.setupRealTimeValidation();
        contactForm.setupAutoSave();
        contactForm.setupEnhancedInteractions();
    },

    // Configuration du formulaire
    setupForm: () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // MODIFICATION: On empêche la soumission normale et on utilise AJAX
        form.addEventListener('submit', contactForm.handleSubmit);
        
        contactForm.enhanceFormFields();
    },

    // Amélioration des champs
    enhanceFormFields: () => {
        // Icônes
        const fields = [
            { selector: '#name', icon: 'fas fa-user' },
            { selector: '#email', icon: 'fas fa-envelope' },
            { selector: '#company', icon: 'fas fa-building' },
            { selector: '#phone', icon: 'fas fa-phone' }
        ];

        fields.forEach(field => {
            const input = document.querySelector(field.selector);
            if (input && !input.parentElement.querySelector('.input-icon')) {
                const wrapper = document.createElement('div');
                wrapper.className = 'input-wrapper';
                input.parentNode.insertBefore(wrapper, input);
                wrapper.appendChild(input);
                
                const icon = document.createElement('i');
                icon.className = field.icon + ' input-icon';
                wrapper.appendChild(icon);
            }
        });

        // Auto-hauteur textarea
        const messageTextarea = document.getElementById('message');
        if (messageTextarea) {
            messageTextarea.addEventListener('input', (e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            });
        }
    },

    // Validation en temps réel
    setupRealTimeValidation: () => {
        const inputs = document.querySelectorAll('#contact-form input, #contact-form select, #contact-form textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                contactForm.validateField(input.name, input.value);
            });
            
            input.addEventListener('focus', () => {
                contactForm.clearFieldError(input.name);
            });
            
            if (input.type === 'email') {
                input.addEventListener('input', debounce(() => {
                    contactForm.validateField(input.name, input.value);
                }, 500));
            }
        });
    },

    // Validation d'un champ
    validateField: (fieldName, value) => {
        const rules = contactForm.config.validation[fieldName];
        if (!rules) return true;

        let isValid = true;
        let errorMessage = '';

        if (rules.required && (!value || value.trim() === '')) {
            isValid = false;
            errorMessage = 'Ce champ est obligatoire';
        }

        if (isValid && rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = contactForm.getFieldErrorMessage(fieldName, 'pattern');
        }

        if (isValid && rules.minLength && value.length < rules.minLength) {
            isValid = false;
            errorMessage = `Minimum ${rules.minLength} caractères requis`;
        }

        if (isValid && rules.maxLength && value.length > rules.maxLength) {
            isValid = false;
            errorMessage = `Maximum ${rules.maxLength} caractères autorisés`;
        }

        if (isValid) {
            contactForm.clearFieldError(fieldName);
        } else {
            contactForm.showFieldError(fieldName, errorMessage);
        }

        return isValid;
    },

    // Messages d'erreur
    getFieldErrorMessage: (fieldName, errorType) => {
        const messages = {
            email: { pattern: 'Veuillez entrer une adresse email valide' },
            phone: { pattern: 'Numéro de téléphone invalide' },
            name: { pattern: 'Le nom ne doit contenir que des lettres' }
        };
        return messages[fieldName]?.[errorType] || 'Format invalide';
    },

    // Afficher erreur
    showFieldError: (fieldName, message) => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        contactForm.clearFieldError(fieldName);

        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
        field.classList.add('error');
        
        contactForm.state.errors[fieldName] = message;
    },

    // Effacer erreur
    clearFieldError: (fieldName) => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (!field) return;

        const errorElement = field.parentNode.querySelector('.field-error');
        if (errorElement) errorElement.remove();
        
        field.classList.remove('error');
        delete contactForm.state.errors[fieldName];
    },

    // Gestion de la soumission - VERSION AMÉLIORÉE
    handleSubmit: async (e) => {
        e.preventDefault(); // Empêcher le rechargement de la page
        
        if (contactForm.state.isSubmitting) return;

        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validation complète
        let isValid = true;
        Object.keys(contactForm.config.validation).forEach(fieldName => {
            if (!contactForm.validateField(fieldName, data[fieldName] || '')) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Veuillez corriger les erreurs du formulaire.', 'error');
            return;
        }

        // Afficher le chargement
        contactForm.state.isSubmitting = true;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitButton.disabled = true;

        try {
            // NOUVEAU: Envoi via Fetch API (AJAX)
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    access_key: contactForm.web3forms.accessKey,
                    ...data
                })
            });

            const result = await response.json();

            if (result.success) {
                // SUCCÈS: Vider le formulaire et afficher le message
                form.reset();
                contactForm.clearAllErrors();
                
                // Supprimer les données sauvegardées
                localStorage.removeItem('contactFormData');
                localStorage.removeItem('contactFormTimestamp');
                
                // Afficher la notification de succès
                showNotification('✅ Message envoyé avec succès ! Je vous répondrai rapidement.', 'success', 6000);
                
                // Animation de succès sur le formulaire
                form.classList.add('success');
                setTimeout(() => form.classList.remove('success'), 1000);
                
                // Optionnel: Jouer un son de succès (si vous voulez)
                // new Audio('path/to/success-sound.mp3').play().catch(() => {});
                
                // Réinitialiser la hauteur du textarea
                const messageTextarea = document.getElementById('message');
                if (messageTextarea) {
                    messageTextarea.style.height = 'auto';
                }
                
                // Scroller vers le haut pour voir la notification
                window.scrollTo({ top: 0, behavior: 'smooth' });
                
            } else {
                // Erreur retournée par Web3Forms
                throw new Error(result.message || "Erreur lors de l'envoi");
            }

        } catch (error) {
            console.error('Erreur:', error);
            
            // Message d'erreur personnalisé
            let errorMessage = '❌ Erreur lors de l\'envoi. Veuillez réessayer.';
            
            if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage = '🌐 Problème de connexion. Vérifiez votre réseau.';
            } else if (error.message.includes('spam')) {
                errorMessage = '🛡️ Message détecté comme spam. Veuillez réessayer.';
            }
            
            showNotification(errorMessage, 'error', 5000);
            
        } finally {
            // Réactiver le bouton
            contactForm.state.isSubmitting = false;
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
        }
    },

    // Sauvegarde automatique (30 min max)
    setupAutoSave: () => {
        const form = document.getElementById('contact-form');
        if (!form) return;

        const saveToLocalStorage = debounce(() => {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            const hasContent = Object.values(data).some(val => val && val.trim() !== '');
            
            if (hasContent) {
                localStorage.setItem('contactFormTimestamp', new Date().toISOString());
            }
        }, 2000);

        form.addEventListener('input', saveToLocalStorage);
        form.addEventListener('change', saveToLocalStorage);

        contactForm.restoreFormData();
    },

    // Restaurer les données (30 min max)
    restoreFormData: () => {
        const timestamp = localStorage.getItem('contactFormTimestamp');
        const savedData = localStorage.getItem('contactFormData');
        
        if (savedData && timestamp) {
            const data = JSON.parse(savedData);
            const timeDiff = new Date() - new Date(timestamp);
            
            if (timeDiff < 30 * 60 * 1000) {
                Object.keys(data).forEach(key => {
                    const field = document.querySelector(`[name="${key}"]`);
                    if (field && data[key]) {
                        field.value = data[key];
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
                
                // Afficher une notification discrète
                setTimeout(() => {
                    showNotification('💾 Brouillon restauré', 'info', 2000);
                }, 500);
            }
        }
    },

    // Interactions améliorées
    setupEnhancedInteractions: () => {
        const submitButton = document.querySelector('#contact-form button[type="submit"]');
        if (submitButton) {
            submitButton.addEventListener('mouseenter', () => {
                if (!submitButton.disabled) {
                    submitButton.style.transform = 'translateY(-2px)';
                }
            });
            
            submitButton.addEventListener('mouseleave', () => {
                submitButton.style.transform = 'translateY(0)';
            });
        }
    },

    // Effacer toutes les erreurs
    clearAllErrors: () => {
        document.querySelectorAll('.field-error').forEach(error => error.remove());
        document.querySelectorAll('.error').forEach(field => field.classList.remove('error'));
        contactForm.state.errors = {};
    }
};

// Styles CSS (améliorés)
const contactFormStyles = `
    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }
    
    .input-icon {
        position: absolute;
        right: 15px;
        color: var(--light-gray, #888);
        pointer-events: none;
        transition: color 0.3s ease;
    }
    
    .form-group input:focus ~ .input-icon,
    .form-group select:focus ~ .input-icon {
        color: var(--primary-orange, #f39c12);
    }
    
    .field-error {
        position: absolute;
        bottom: -18px;
        left: 0;
        color: #ef4444;
        font-size: 0.78rem;
        font-weight: 500;
        white-space: nowrap;
        animation: fieldErrorIn 0.2s ease;
    }
    
    @keyframes fieldErrorIn {
        from {
            opacity: 0;
            transform: translateY(-3px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group input.error,
    .form-group select.error,
    .form-group textarea.error {
        border-color: #ef4444 !important;
    }
    
    .form-group input.success,
    .form-group select.success,
    .form-group textarea.success {
        border-color: #22c55e !important;
    }
    
    #contact-form button[type="submit"] {
        position: relative;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    #contact-form button[type="submit"]:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
    
    #contact-form button[type="submit"] .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .form-group select {
        appearance: none;
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
        background-position: right 0.5rem center;
        background-repeat: no-repeat;
        background-size: 1.5em 1.5em;
        padding-right: 2.5rem;
    }
    
    .checkbox-container {
        display: flex !important;
        align-items: flex-start !important;
        gap: 10px !important;
        cursor: pointer !important;
        font-size: 14px !important;
        color: var(--light-gray, #888) !important;
        line-height: 1.5 !important;
        padding: 10px !important;
        border-radius: 6px !important;
        transition: all 0.3s ease !important;
    }
    
    .checkbox-container:hover {
        background: rgba(255, 255, 255, 0.02) !important;
    }
    
    .checkbox-container input[type="checkbox"] {
        width: auto !important;
        margin: 0 !important;
        margin-top: 2px !important;
        accent-color: var(--primary-orange, #f39c12) !important;
    }
    
    /* Animation de succès */
    @keyframes successPulse {
        0% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
        }
        70% {
            box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
        }
    }
    
    .contact-form.success {
        animation: successPulse 0.6s ease;
    }
`;

// Ajouter les styles
const styleSheet = document.createElement('style');
styleSheet.textContent = contactFormStyles;
document.head.appendChild(styleSheet);

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    contactForm.init();
});

window.contactForm = contactForm;