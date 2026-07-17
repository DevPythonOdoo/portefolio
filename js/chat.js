/**
 * Portfolio Odoo Expert - Chat Widget
 * Système de chat en temps réel pour l'interaction avec les visiteurs
 */

// ✅ FIX 1 : Objet utils manquant (causait un crash immédiat au premier message)
const utils = {
    generateId: () => {
        return 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },
    formatTime: (date) => {
        const d = date instanceof Date ? date : new Date(date);
        return d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }
};

const chatWidget = {
    // Configuration
    config: {
        apiEndpoint: '/api/chat/messages',
        refreshInterval: 3000,
        maxMessages: 50,
        maxExchanges: 8,
        typingTimeout: 1000,
        botName: 'Expert Odoo'
    },

    state: {
        isOpen: false,
        isTyping: false,
        currentUser: 'visitor',
        sessionId: null,
        messages: [],
        unreadCount: 0,
        isOnline: true,
        exchangeCount: 0,
        isClosed: false
    },

    inappropriateWords: [
        'con', 'pute', 'salope', 'enculé', 'nique', 'bâtard', 'connard',
        'fdp', 'tg', 'va te faire', 'merde', 'putain', 'abruti', 'débile',
        'insulte', 'insulter', 'gros mot'
    ],

    botResponses: {
        greetings: [
            "Bonjour, je suis l'assistant Expert Odoo. Comment puis-je vous renseigner ?",
            "Bonjour et bienvenue. Je suis à votre disposition pour toute question relative à Odoo."
        ],
        services: [
            "Je propose plusieurs services : développement de modules personnalisés, personnalisation d'Odoo, formation et intégration. Quel est votre besoin ?",
            "Mes services incluent le développement sur mesure, la personnalisation des modules, les formations et les intégrations API. Que recherchez-vous ?"
        ],
        contact: [
            "Pour me contacter, veuillez utiliser le formulaire de contact en bas de page. Je vous répondrai dans les meilleurs délais.",
            "Je vous invite à remplir le formulaire de contact. Je traite personnellement chaque demande."
        ],
        pricing: [
            "Les tarifs sont adaptés à chaque projet. Je vous invite à me contacter via le formulaire pour un devis personnalisé.",
            "Chaque projet fait l'objet d'une étude personnalisée. Contactez-moi via le formulaire pour obtenir un devis."
        ],
        training: [
            "Je propose des formations Odoo adaptées à tous les niveaux, de l'utilisateur au développeur. Souhaitez-vous plus d'informations ?",
            "Mes formations couvrent l'administration, le développement et l'utilisation quotidienne d'Odoo. Quel est votre besoin ?"
        ],
        closing: [
            "Je vous remercie pour cet échange. Pour toute demande personnalisée, je vous invite à utiliser le formulaire de contact. Je reste à votre disposition.",
            "Cet échange arrive à son terme. N'hésitez pas à me contacter via le formulaire pour toute question complémentaire. Bien cordialement."
        ],
        inappropriate: [
            "Je vous prie de formuler votre demande de manière professionnelle. Pour toute question relative à mes services, je vous invite à utiliser le formulaire de contact.",
            "Ce canal est dédié aux échanges professionnels. Veuillez reformuler votre message ou utiliser le formulaire de contact."
        ],
        default: [
            "Je vous remercie pour votre question. Pour une réponse détaillée et personnalisée, je vous invite à remplir le formulaire de contact.",
            "Votre demande mérite une attention particulière. Je vous invite à me contacter via le formulaire pour en discuter en détail."
        ]
    },

    // Initialisation
    init: () => {
        chatWidget.generateSessionId();
        chatWidget.setupUI();
        chatWidget.setupEventListeners();
        chatWidget.loadChatHistory();
        chatWidget.startAutoRefresh();

        // Afficher la notification initiale après un délai
        setTimeout(() => {
            chatWidget.showInitialNotification();
        }, 5000);
    },

    // Générer un ID de session unique
    generateSessionId: () => {
        chatWidget.state.sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    // Configuration de l'interface
    setupUI: () => {
        const chatButton = document.getElementById('chat-button');
        const chatWindow = document.getElementById('chat-window');

        if (!chatButton || !chatWindow) return;

        // Ajouter l'indicateur de statut en ligne
        const statusIndicator = document.createElement('div');
        statusIndicator.className = 'chat-status-indicator';
        statusIndicator.innerHTML = '<span class="status-dot"></span>En ligne';

        const chatHeader = chatWindow.querySelector('.chat-header');
        if (chatHeader) {
            chatHeader.appendChild(statusIndicator);
        }
    },

    // Configuration des écouteurs d'événements
    setupEventListeners: () => {
        const chatButton = document.getElementById('chat-button');
        const chatClose  = document.getElementById('chat-close');
        const chatInput  = document.getElementById('chat-input');
        const chatSend   = document.getElementById('chat-send');

        if (chatButton) {
            chatButton.addEventListener('click', chatWidget.toggleChat);
        }

        if (chatClose) {
            chatClose.addEventListener('click', chatWidget.closeChat);
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    chatWidget.sendMessage();
                }
            });

            chatInput.addEventListener('input', () => {
                chatWidget.handleTyping();
            });
        }

        if (chatSend) {
            chatSend.addEventListener('click', chatWidget.sendMessage);
        }

        // Fermer le chat en cliquant en dehors
        document.addEventListener('click', (e) => {
            const chatWidgetEl = document.getElementById('chat-widget');
            if (chatWidget.state.isOpen && chatWidgetEl && !chatWidgetEl.contains(e.target)) {
                chatWidget.closeChat();
            }
        });

        // Gérer la visibilité de la page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                chatWidget.stopAutoRefresh();
            } else {
                chatWidget.startAutoRefresh();
            }
        });
    },

    // Basculer l'affichage du chat
    toggleChat: () => {
        if (chatWidget.state.isOpen) {
            chatWidget.closeChat();
        } else {
            chatWidget.openChat();
        }
    },

    // Ouvrir le chat
    openChat: () => {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');

        if (!chatWindow || !chatButton) return;

        chatWindow.classList.add('active');
        chatButton.classList.add('active');
        chatWidget.state.isOpen = true;

        // Réinitialiser le compteur de messages non lus
        chatWidget.state.unreadCount = 0;
        chatWidget.updateUnreadCount();

        // Focus sur l'input
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            setTimeout(() => chatInput.focus(), 300);
        }

        // Marquer les messages comme lus
        chatWidget.markMessagesAsRead();
    },

    // Fermer le chat
    closeChat: () => {
        const chatWindow = document.getElementById('chat-window');
        const chatButton = document.getElementById('chat-button');

        if (!chatWindow || !chatButton) return;

        chatWindow.classList.remove('active');
        chatButton.classList.remove('active');
        chatWidget.state.isOpen = false;
    },

    // Envoyer un message
    sendMessage: () => {
        const chatInput = document.getElementById('chat-input');
        if (!chatInput) return;

        const message = chatInput.value.trim();
        if (!message) return;

        // Ajouter le message de l'utilisateur
        chatWidget.addMessage(message, 'user');

        // Effacer l'input
        chatInput.value = '';

        // Réponse automatique du bot après un court délai
        setTimeout(() => {
            chatWidget.generateBotResponse(message);
        }, 1000);
    },

    // Ajouter un message au chat
    addMessage: (content, sender = 'user') => {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;

        const messageId  = utils.generateId();   // ✅ utils désormais défini
        const timestamp  = new Date();

        const message = {
            id: messageId,
            content: content,
            sender: sender,
            timestamp: timestamp,
            sessionId: chatWidget.state.sessionId
        };

        // Créer l'élément HTML du message
        const messageElement = chatWidget.createMessageElement(message);
        chatBody.appendChild(messageElement);

        // Ajouter aux messages
        chatWidget.state.messages.push(message);

        // Sauvegarder dans la base de données
        chatWidget.saveMessage(message);

        // Faire défiler vers le bas
        chatWidget.scrollToBottom();

        // Mettre à jour le compteur si le chat est fermé
        if (!chatWidget.state.isOpen && sender === 'bot') {
            chatWidget.state.unreadCount++;
            chatWidget.updateUnreadCount();
        }
    },

    // Créer l'élément HTML d'un message
    createMessageElement: (message) => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message chat-message-${message.sender}`;
        messageDiv.setAttribute('data-message-id', message.id);

        const time = utils.formatTime(message.timestamp);  // ✅ utils désormais défini

        const avatarIcon = message.sender === 'bot' ? '<i class="fas fa-briefcase"></i>' : '<i class="fas fa-user"></i>';
        messageDiv.innerHTML = `
            <div class="message-avatar">${avatarIcon}</div>
            <div class="message-content">
                <p>${chatWidget.escapeHtml(message.content)}</p>
                <span class="message-time">${time}</span>
            </div>
        `;

        // Animation d'entrée
        setTimeout(() => {
            messageDiv.classList.add('show');
        }, 10);

        return messageDiv;
    },

    // Échapper le HTML pour éviter les injections XSS
    escapeHtml: (text) => {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    // Vérifier si le message contient des propos inappropriés
    containsInappropriateContent: (message) => {
        const lower = message.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return chatWidget.inappropriateWords.some(word => lower.includes(word));
    },

    // Fermer le chat avec un message professionnel
    closeChatWithMessage: (category) => {
        if (chatWidget.state.isClosed) return;
        chatWidget.state.isClosed = true;

        chatWidget.state.isTyping = true;
        chatWidget.showTypingIndicator();

        const responses = chatWidget.botResponses[category] || chatWidget.botResponses.closing;
        const response = responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
            chatWidget.hideTypingIndicator();
            chatWidget.addMessage(response, 'bot');
            chatWidget.state.isTyping = false;

            setTimeout(() => {
                chatWidget.disableChat();
            }, 4000);
        }, 1500);
    },

    // Désactiver le chat
    disableChat: () => {
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        if (chatInput) {
            chatInput.disabled = true;
            chatInput.placeholder = 'Chat fermé';
        }
        if (chatSend) chatSend.disabled = true;

        setTimeout(() => {
            chatWidget.closeChat();
        }, 3000);
    },

    // Générer une réponse automatique du bot
    generateBotResponse: (userMessage) => {
        if (chatWidget.state.isTyping || chatWidget.state.isClosed) return;

        chatWidget.state.exchangeCount++;
        chatWidget.state.isTyping = true;
        chatWidget.showTypingIndicator();

        const lowerMessage = userMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

        // Vérifier les propos inappropriés
        if (chatWidget.containsInappropriateContent(userMessage)) {
            setTimeout(() => {
                chatWidget.hideTypingIndicator();
                chatWidget.closeChatWithMessage('inappropriate');
            }, 1000);
            return;
        }

        // Vérifier la limite d'échanges
        if (chatWidget.state.exchangeCount >= chatWidget.config.maxExchanges) {
            setTimeout(() => {
                chatWidget.hideTypingIndicator();
                chatWidget.closeChatWithMessage('closing');
            }, 1000);
            return;
        }

        // Vérifier si la conversation approche de la limite (avant-dernier échange)
        if (chatWidget.state.exchangeCount === chatWidget.config.maxExchanges - 1) {
            const closingMsg = "Je vous remercie pour cet échange. Pour aller plus loin, je vous invite à utiliser le formulaire de contact. Une question complémentaire ?";
            setTimeout(() => {
                chatWidget.hideTypingIndicator();
                chatWidget.addMessage(closingMsg, 'bot');
                chatWidget.state.isTyping = false;
            }, 1500);
            return;
        }

        // Analyser le message
        let responseCategory = 'default';

        if (lowerMessage.includes('bonjour') || lowerMessage.includes('bonsoir') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
            responseCategory = 'greetings';
        } else if (lowerMessage.includes('service') || lowerMessage.includes('offre') || lowerMessage.includes('propose')) {
            responseCategory = 'services';
        } else if (lowerMessage.includes('prix') || lowerMessage.includes('tarif') || lowerMessage.includes('cout') || lowerMessage.includes('devis') || lowerMessage.includes('budget') || lowerMessage.includes('combien')) {
            responseCategory = 'pricing';
        } else if (lowerMessage.includes('contact') || lowerMessage.includes('contacter') || lowerMessage.includes('joindre') || lowerMessage.includes('email') || lowerMessage.includes('telephone')) {
            responseCategory = 'contact';
        } else if (lowerMessage.includes('formation') || lowerMessage.includes('apprendre') || lowerMessage.includes('cours') || lowerMessage.includes('former')) {
            responseCategory = 'training';
        }

        const responses = chatWidget.botResponses[responseCategory];
        const response = responses[Math.floor(Math.random() * responses.length)];

        setTimeout(() => {
            chatWidget.hideTypingIndicator();
            chatWidget.addMessage(response, 'bot');
            chatWidget.state.isTyping = false;
        }, 1500);
    },

    // Afficher l'indicateur de frappe
    showTypingIndicator: () => {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message chat-message-bot typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar"><i class="fas fa-briefcase"></i></div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;

        chatBody.appendChild(typingDiv);
        chatWidget.scrollToBottom();
    },

    // Cacher l'indicateur de frappe
    hideTypingIndicator: () => {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    },

    // Gérer l'indication de frappe
    handleTyping: () => {
        if (chatWidget.typingTimeout) {
            clearTimeout(chatWidget.typingTimeout);
        }

        chatWidget.typingTimeout = setTimeout(() => {
            // Espace réservé pour une logique future (ex: "en train d'écrire...")
        }, chatWidget.config.typingTimeout);
    },

    // Faire défiler vers le bas
    scrollToBottom: () => {
        const chatBody = document.getElementById('chat-body');
        if (chatBody) {
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    },

    // Mettre à jour le compteur de messages non lus
    updateUnreadCount: () => {
        const notification = document.getElementById('chat-notification');
        if (notification) {
            if (chatWidget.state.unreadCount > 0) {
                notification.textContent = chatWidget.state.unreadCount;
                notification.style.display = 'flex';
            } else {
                notification.style.display = 'none';
            }
        }
    },

    // Marquer les messages comme lus
    markMessagesAsRead: () => {
        chatWidget.state.unreadCount = 0;
        chatWidget.updateUnreadCount();

        chatWidget.state.messages.forEach(message => {
            if (!message.is_read && message.sender === 'bot') {
                chatWidget.markMessageAsRead(message.id);
            }
        });
    },

    // Marquer un message comme lu (API)
    markMessageAsRead: async (messageId) => {
        try {
            await fetch(`${chatWidget.config.apiEndpoint}/${messageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_read: true })
            });
        } catch (error) {
            console.warn('Erreur lors de la mise à jour du message:', error);
        }
    },

    // Charger l'historique du chat
    loadChatHistory: async () => {
        try {
            const response = await fetch(
                `${chatWidget.config.apiEndpoint}?session_id=${chatWidget.state.sessionId}&limit=10&sort=timestamp:desc`
            );
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                const messages = data.data.reverse();
                messages.forEach(message => {
                    chatWidget.state.messages.push(message);
                    chatWidget.renderMessage(message);
                });
                chatWidget.scrollToBottom();
            }
        } catch (error) {
            console.warn('Erreur lors du chargement de l\'historique:', error);
        }
    },

    // Afficher un message dans l'interface
    renderMessage: (message) => {
        const chatBody = document.getElementById('chat-body');
        if (!chatBody) return;

        const messageElement = chatWidget.createMessageElement(message);
        chatBody.appendChild(messageElement);
    },

    // Sauvegarder un message (API)
    saveMessage: async (message) => {
        try {
            await fetch(chatWidget.config.apiEndpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message_type: message.sender,
                    content: message.content,
                    timestamp: message.timestamp,
                    visitor_ip: await chatWidget.getClientIP(),
                    user_agent: navigator.userAgent,
                    session_id: message.sessionId,
                    is_read: false
                })
            });
        } catch (error) {
            console.warn('Erreur lors de la sauvegarde du message:', error);
        }
    },

    // Obtenir l'IP du client
    getClientIP: async () => {
        try {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            return data.ip;
        } catch {
            return 'unknown';
        }
    },

    // Démarrer le rafraîchissement automatique
    startAutoRefresh: () => {
        if (chatWidget.refreshIntervalId) return;

        chatWidget.refreshIntervalId = setInterval(() => {
            if (chatWidget.state.isOpen) {
                chatWidget.loadNewMessages();
            }
        }, chatWidget.config.refreshInterval);
    },

    // Arrêter le rafraîchissement automatique
    stopAutoRefresh: () => {
        if (chatWidget.refreshIntervalId) {
            clearInterval(chatWidget.refreshIntervalId);
            chatWidget.refreshIntervalId = null;
        }
    },

    // Charger les nouveaux messages
    loadNewMessages: async () => {
        try {
            const lastMessage   = chatWidget.state.messages[chatWidget.state.messages.length - 1];
            const lastTimestamp = lastMessage ? lastMessage.timestamp : new Date(0).toISOString();

            const response = await fetch(
                `${chatWidget.config.apiEndpoint}?session_id=${chatWidget.state.sessionId}&timestamp_gt=${lastTimestamp}&sort=timestamp:asc`
            );
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                data.data.forEach(message => {
                    if (!chatWidget.state.messages.find(m => m.id === message.id)) {
                        chatWidget.state.messages.push(message);
                        chatWidget.renderMessage(message);

                        if (message.sender === 'bot') {
                            chatWidget.playNotificationSound();
                        }
                    }
                });
                chatWidget.scrollToBottom();
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des nouveaux messages:', error);
        }
    },

    // Jouer un son de notification
    playNotificationSound: () => {
        if (localStorage.getItem('chatSoundEnabled') !== 'false') {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator   = audioContext.createOscillator();
                const gainNode     = audioContext.createGain();

                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);

                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
            } catch (error) {
                console.warn('Erreur lors de la lecture du son:', error);
            }
        }
    },

    // Afficher la notification initiale
    showInitialNotification: () => {
        if (!chatWidget.state.isOpen) {
            chatWidget.state.unreadCount = 1;
            chatWidget.updateUnreadCount();

            setTimeout(() => {
                chatWidget.addMessage("Bonjour, je suis disponible pour répondre à vos questions sur Odoo.", 'bot');
            }, 2000);
        }
    }
};

// ─── Styles CSS ───────────────────────────────────────────────────────────────
const chatStyles = `
    .chat-status-indicator {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        opacity: 0.9;
    }

    .status-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #4caf50;
        animation: pulse-status 2s infinite;
    }

    @keyframes pulse-status {
        0%   { box-shadow: 0 0 0 0   rgba(76, 175, 80, 0.7); }
        70%  { box-shadow: 0 0 0 10px rgba(76, 175, 80, 0);   }
        100% { box-shadow: 0 0 0 0   rgba(76, 175, 80, 0);   }
    }

    .typing-indicator .typing-dots {
        display: flex;
        gap: 4px;
    }

    .typing-dots span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--light-gray);
        animation: typing-dot 1.4s infinite ease-in-out both;
    }

    .typing-dots span:nth-child(1) { animation-delay: -0.32s; }
    .typing-dots span:nth-child(2) { animation-delay: -0.16s; }

    @keyframes typing-dot {
        0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
        40%            { transform: scale(1); opacity: 1;   }
    }

    .chat-message {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 15px;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.3s ease;
    }

    .chat-message.show {
        opacity: 1;
        transform: translateY(0);
    }

    .chat-message-user { flex-direction: row-reverse; }

    .message-avatar {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        flex-shrink: 0;
        background: var(--primary-blue);
        color: white;
    }

    .chat-message-user .message-avatar { background: var(--primary-orange); }

    .message-content {
        max-width: 70%;
        word-wrap: break-word;
    }

    .chat-message-bot .message-content {
        background: rgba(255, 255, 255, 0.05);
        padding: 12px 16px;
        border-radius: 18px;
        border-bottom-left-radius: 5px;
    }

    .chat-message-user .message-content {
        background: linear-gradient(135deg, var(--primary-orange), var(--secondary-orange));
        padding: 12px 16px;
        border-radius: 18px;
        border-bottom-right-radius: 5px;
        color: var(--white);
    }

    .message-content p { margin: 0; line-height: 1.4; }

    .message-time {
        font-size: 11px;
        color: var(--light-gray);
        opacity: 0.7;
        display: block;
        margin-top: 4px;
    }

    .chat-message-user .message-time { color: rgba(255, 255, 255, 0.8); }

    @media (max-width: 480px) {
        .chat-window {
            width: 90vw !important;
            right: 5vw !important;
            height: 60vh !important;
            bottom: 80px !important;
        }
        .chat-input-container { padding: 10px !important; }
        .chat-input { font-size: 14px !important; }
    }
`;

// Injecter les styles
// Vérifier si le style n'existe pas déjà
if (!document.getElementById('chat-styles')) {
    const chatStyleSheet = document.createElement('style');
    chatStyleSheet.id = 'chat-styles';
    chatStyleSheet.textContent = chatStyles;
    document.head.appendChild(chatStyleSheet);
}

// Démarrage
document.addEventListener('DOMContentLoaded', () => {
    chatWidget.init();
});

// Export global
window.chatWidget = chatWidget;