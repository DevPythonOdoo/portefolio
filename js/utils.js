/**
 * Portfolio Odoo Expert - Utils
 * Fonctions utilitaires partagées entre tous les modules
 */

const utils = {

    // ─── Identifiant unique ────────────────────────────────────────────────────
    /**
     * Génère un identifiant unique (utilisé par chat-widget.js)
     * @returns {string} ex: "msg_1714000000000_k3j9x"
     */
    generateId: () => {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // ─── Formatage de l'heure ─────────────────────────────────────────────────
    /**
     * Formate une date en heure lisible HH:MM (utilisé par chat-widget.js)
     * @param {Date|string} date
     * @returns {string} ex: "14:35"
     */
    formatTime: (date) => {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    },

    // ─── Debounce ─────────────────────────────────────────────────────────────
    /**
     * Retarde l'exécution d'une fonction jusqu'à ce que l'utilisateur
     * arrête de déclencher l'événement (utilisé par contact.js)
     * @param {Function} func   - Fonction à retarder
     * @param {number}   delay  - Délai en ms (ex: 500)
     * @returns {Function}
     */
    debounce: (func, delay = 300) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(null, args);
            }, delay);
        };
    },

    // ─── Notification ─────────────────────────────────────────────────────────
    /**
     * Affiche une notification toast à l'écran (utilisé par contact.js)
     * @param {string} message  - Texte à afficher
     * @param {string} type     - 'success' | 'error' | 'warning' | 'info'
     * @param {number} duration - Durée d'affichage en ms (défaut: 4000)
     */
    showNotification: (message, type = 'info', duration = 4000) => {
        // Supprimer les notifications existantes du même type
        const existing = document.querySelector(`.toast-notification.toast-${type}`);
        if (existing) existing.remove();

        // Créer la notification
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;

        const icons = {
            success: 'fas fa-check-circle',
            error:   'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info:    'fas fa-info-circle'
        };

        const iconEl = document.createElement('i');
        iconEl.className = icons[type] || icons.info;
        toast.appendChild(iconEl);

        const spanEl = document.createElement('span');
        spanEl.textContent = message;
        toast.appendChild(spanEl);

        const closeBtn = document.createElement('button');
        closeBtn.className = 'toast-close';
        closeBtn.setAttribute('aria-label', 'Fermer');
        const closeIcon = document.createElement('i');
        closeIcon.className = 'fas fa-times';
        closeBtn.appendChild(closeIcon);
        toast.appendChild(closeBtn);

        // Bouton de fermeture
        toast.querySelector('.toast-close').addEventListener('click', () => {
            utils._removeToast(toast);
        });

        document.body.appendChild(toast);

        // Affichage avec animation
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        // Auto-suppression
        const timer = setTimeout(() => {
            utils._removeToast(toast);
        }, duration);

        // Annuler le timer si l'utilisateur ferme manuellement
        toast.dataset.timerId = timer;
    },

    /**
     * Supprime un toast avec animation de sortie
     * @private
     */
    _removeToast: (toast) => {
        clearTimeout(Number(toast.dataset.timerId));
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 400);
    },

    // ─── Extras utiles ────────────────────────────────────────────────────────
    /**
     * Formate une date complète en français
     * @param {Date|string} date
     * @returns {string} ex: "28 janvier 2025 à 14:35"
     */
    formatDate: (date) => {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleDateString('fr-FR', {
            day:    'numeric',
            month:  'long',
            year:   'numeric',
            hour:   '2-digit',
            minute: '2-digit'
        });
    },

    /**
     * Tronque un texte à une longueur donnée
     * @param {string} text
     * @param {number} maxLength
     * @returns {string}
     */
    truncate: (text, maxLength = 100) => {
        if (!text || text.length <= maxLength) return text;
        return text.slice(0, maxLength).trimEnd() + '…';
    }
};

// ─── Styles CSS des toasts ────────────────────────────────────────────────────
const utilsStyles = `
    .toast-notification {
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(20px);
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 14px 20px;
        border-radius: 10px;
        font-size: 15px;
        font-weight: 500;
        color: #fff;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        max-width: 90vw;
        pointer-events: all;
    }

    .toast-notification.show {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }

    .toast-notification.hide {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }

    .toast-success  { background: linear-gradient(135deg, #2e7d32, #43a047); }
    .toast-error    { background: linear-gradient(135deg, #b71c1c, #e53935); }
    .toast-warning  { background: linear-gradient(135deg, #e65100, #fb8c00); }
    .toast-info     { background: linear-gradient(135deg, #0d47a1, #1976d2); }

    .toast-notification i:first-child { font-size: 18px; flex-shrink: 0; }

    .toast-close {
        background: none;
        border: none;
        color: rgba(255,255,255,0.8);
        cursor: pointer;
        padding: 2px 6px;
        margin-left: 8px;
        border-radius: 4px;
        transition: color 0.2s;
        flex-shrink: 0;
    }

    .toast-close:hover { color: #fff; }
`;

const utilsStyleSheet = document.createElement('style');
utilsStyleSheet.textContent = utilsStyles;
document.head.appendChild(utilsStyleSheet);

// Export global — doit être chargé AVANT contact.js et chat-widget.js
window.utils = utils;