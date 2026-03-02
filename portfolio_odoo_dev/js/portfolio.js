/**
 * Portfolio Odoo Expert - Portfolio Module
 * Gestion dynamique du portfolio et des projets
 */

const portfolioModule = {
    // Configuration
    config: {
        apiEndpoint: '/tables/portfolio_projects',
        itemsPerPage: 6,
        currentPage: 1,
        currentFilter: 'all'
    },

    // Données de secours
    fallbackData: [
        {
            id: '1',
            title: 'Système complet de gestion de supermarché',
            category: 'development',
            description: 'Conception et développement d’un module métier spécifique intégré à Odoo pour optimiser la gestion d’un supermarché. La solution inclut un Point de Vente (POS) personnalisé, la gestion avancée de la caisse, le contrôle des droits d’accès des caissières ainsi qu’un suivi rigoureux des stocks. Le système couvre également l’ensemble du cycle commercial : gestion des leads, devis, commandes, facturation et suivi des paiements, avec une intégration native aux modules comptables et logistiques existants pour garantir cohérence et traçabilité des opérations.',
            client_name: 'SOCOCE MARKET',
            client_industry: 'Grande distribution',
            project_duration: '4 mois',
            odoo_version: '19.0',
            modules_affected: ['CRM', 'Sales','Pos', 'Accounting', 'Stock'],
            technologies: ['Python', 'PostgreSQL', 'JavaScript', 'XML', 'QWeb','Odoo SH', 'PyCharm'],
            results: 'Réduction de 60 % du temps de traitement des commandes, amélioration de 95 % de la fiabilité des données et augmentation de 30 % de la satisfaction client grâce à l’automatisation et à la centralisation des processus.',
            challenge: 'L’entreprise faisait face à des processus de vente complexes impliquant plusieurs niveaux de validation et une gestion multi-sites. L’intégration avec le système comptable existant entraînait des problèmes de synchronisation des données et un manque de visibilité en temps réel.',
            solution: 'Conception et développement d’un module personnalisé sous Odoo intégrant des workflows automatisés, des vues Kanban avancées et une synchronisation bidirectionnelle avec le module comptable. Mise en place d’un système de notifications par e-mail pour fluidifier les validations et réduire les délais de traitement.',
            completion_date: '2024-01-15T00:00:00.000Z',
            is_featured: true,
            status: 'completed',
            image_url: 'images/img1.jpg',
        },
        {
            id: '2',
            title: 'Personnalisation Module POS',
            category: 'customization',
            description: 'Personnalisation complète du module POS d’Odoo pour une chaîne de distribution de fruits et légumes. Ajout de la fonctionnalité de multiple unité de mesure (UOM) pour permettre la vente de produits à la fois au poids et à l’unité, avec une interface utilisateur intuitive pour les caissières. Restriction sur les quantités des produits en focntion des stocks disponnibles. Intégration d’une fonctionnalité robuste sur le contôle de stock et les listes de prix.',
            client_name: 'OCCEAN DISTRIBUTION',
            client_industry: 'Distribution de fruits et légumes',
            project_duration: '5 mois',
            odoo_version: '18.0',
            modules_affected: ['POS', 'Vente', 'Inventaire', 'Product'],
            technologies: ['Python', 'XML', 'QWeb', 'JavaScript', 'Odoo SH', 'PyCharm'],
            results: 'Amélioration de 40 % de la rapidité des transactions au point de vente, réduction de 25 % des erreurs de caisse et augmentation de 20 % des ventes grâce à une meilleure gestion des unités de mesure et des stocks.',
            challenge: 'Le module POS standard ne supportait pas la vente de produits à la fois au poids et à l’unité, ce qui entraînait des erreurs fréquentes et une insatisfaction des clients. De plus, les caissières avaient du mal à gérer les listes de prix complexes et les restrictions de stock en temps réel.',
            solution: 'Développement d’une extension personnalisée du module POS intégrant une gestion avancée des unités de mesure, une interface utilisateur améliorée pour les caissières et une synchronisation en temps réel avec le module d’inventaire pour garantir la disponibilité des produits.',
            completion_date: '2023-11-30T00:00:00.000Z',
            is_featured: true,
            status: 'completed',
            image_url: 'images/img3.jpg'
        },
        {
            id: '3',
            title: 'Intégration Complete',
            category: 'integration',
            description: 'Intégratioon complète des fonctionnalités d’Odoo avec les systèmes existants d’une entreprise de distribution industrielle de glace Sandra dans l’Afrique de l’Ouest. Vérification avancée sur le stock, contrôle sur les prix,gestion des commerciaux et livreurs sur terrain. Gestion des congélateurs chez les clients(affectation,suivi et maintenace). Mise en place d’une fonction d’audite pour suivre la trasabilité des mouvements dans le système. Production d’une API REST personnalisée pour synchroniser les données entre Odoo et leur App mobile Guintan utilisée par les commerciaux et livreurs sur le terrain, permettant une gestion efficace des commandes, des stocks et des clients en temps réel. L’intégration a également inclus la mise en place de connecteurs pour synchroniser les données de stock et de prix entre Odoo et les systèmes de gestion existants, assurant une cohérence totale des données à travers tous les canaux de vente.',
            client_name: 'EDILACTRADE',
            client_industry: 'Distribution industrielle de glace',
            project_duration: '1 an',
            odoo_version: '17.0',
            modules_affected: ['Vente', 'Comptabilité', 'Stock', 'Product','CRM','parc automobile'],
            technologies: ['REST API', 'Python', 'JavaScript', 'JSON', 'Odoo SH', 'PyCharm'],
            results: 'Augmentation des ventes de 40%, réduction des erreurs de commande de 90%, amélioration de la satisfaction client de 50%. Synchronisation en temps réel des données entre Odoo et l’application mobile, permettant une gestion efficace des commandes et des stocks sur le terrain.',
            challenge: 'Synchronisation complexe des données entre Odoo et l’application mobile Guintana, gestion des volumes de données importants, et maintien de la cohérence des données à travers tous les canaux de vente.',
            solution: 'Développement d\'API REST personnalisées, mise en place d\'une file de traitement asynchrone, création de connecteurs bi-directionnels avec validation des données.',
            completion_date: '2023-05-28T00:00:00.000Z',
            is_featured: false,
            status: 'completed',
            image_url: 'images/img4.png'
        },
        {
            id: '4',
            title: 'Formation Equipe Complète',
            category: 'training',
            description: 'Dépoiement de l’Erp Odoo et formation complète de l’adminitration à l’opérationnel. Charger de la formation de 13 utilisateurs sur la prise en main de l’ERP Odoo, couvrant les modules de base tels que CRM, Ventes, Achats,POS, Stock et Comptabilité. La formation a été structurée en sessions théoriques et pratiques, avec des exercices basés sur des scénarios réels pour garantir une compréhension approfondie et une application immédiate des compétences acquises. Un suivi post-formation a été mis en place pour assurer la continuité de l’apprentissage et répondre aux questions des utilisateurs lors de la mise en production. La formation a permis aux caissières de maîtriser les fonctionnalités du POS, aux responsables de stock de gérer efficacement les inventaires, et à l’équipe comptable d’automatiser les processus financiers, contribuant ainsi à une adoption réussie de l’ERP au sein de l’entreprise.',
            client_name: 'Commerçant225',
            client_industry: 'Supermarché',
            project_duration: '3 mois',
            odoo_version: '18.0',
            modules_affected: ['CRM', 'Vente', 'Achats', 'POS', 'Stock', 'Comptabilité'],
            technologies: ['Python', 'PostgreSQL', 'Odoo SH', 'PyCharm'],
            results: 'Formation de 13 utilisateurs sur Odoo, avec une adoption réussie de l\'ERP au sein de l\'entreprise. Amélioration de la productivité de 40% et réduction des erreurs de 60%.',
            challenge: 'Formation d\'une équipe de 13 utilisateurs sur un ERP complexe, avec des niveaux de compétence variés et des contraintes de temps.',
            solution: 'Planification de sessions de formation structurées, utilisation de scénarios réels pour une meilleure compréhension, et mise en place d\'un suivi post-formation.',
            completion_date: '2025-12-10T00:00:00.000Z',
            is_featured: true,
            status: 'completed',
            image_url: 'images/img2.jpeg'
        },
        {
            id: '5',
            title: 'Développemen spécifique',
            category: 'Customization',
            description: 'Customisation du module Fabrication, Vente et Stock pour une entreprise de production de café. La personnalisation a inclus la création de flux de travail spécifiques pour la gestion de la production, l’intégration de fonctionnalités de suivi des lots et des dates d’expiration, ainsi que l’ajout de rapports personnalisés pour le suivi de la performance de la production et des ventes. La solution a permis à l’entreprise d’optimiser ses processus de fabrication, d’améliorer la traçabilité des produits et d’augmenter l’efficacité globale de ses opérations. Développement d’un module de gestion des machines.',
            client_name: 'RotsenCafé',
            client_industry: 'Industrie du café',
            project_duration: '4 mois',
            odoo_version: '18.0',
            modules_affected: ['CRM', 'Vente', 'Achats', 'Fabrication', 'Stock', 'Comptabilité'],
            technologies: ['Python', 'PostgreSQL', 'Odoo SH', 'PyCharm'],
            results: 'Amélioration de 30% de l’efficacité de la production, réduction de 20% des erreurs de fabrication, et augmentation de 25% des ventes grâce à une meilleure gestion des processus et une traçabilité améliorée.',
            challenge: 'Formation d\'une équipe de 13 utilisateurs sur un ERP complexe, avec des niveaux de compétence variés et des contraintes de temps.',
            solution: 'Développement d’un module de gestion des machines, intégration de fonctionnalités avancées de traçabilité et d\'optimisation des processus de fabrication.',
            completion_date: '2025-10-10T00:00:00.000Z',
            is_featured: true,
            status: 'completed',
            image_url: 'images/img6.png'
        },
        {
            id: '6',
            title: 'Développemen spécifique',
            category: 'Customization',
            description: 'Customisation du module POS pour une entreprise de poker. La personnalisation a inclus la création de flux de travail spécifiques pour la gestion de la société, l’intégration de fonctionnalités de suivi des boissons offertes ou non offertes, ainsi que l’ajout de rapports personnalisés pour le suivi de la performance des ventes sur la journée. Chaque caissière devrait voir uniquent leur session en cour et les ventes qui y sont associées. La solution a permis à l’entreprise d’optimiser ses processus de vente, d’améliorer la traçabilité des produits et d’augmenter l’efficacité globale de ses opérations.',
            client_name: 'Terroubi',
            client_industry: 'Poker',
            project_duration: '3 mois',
            odoo_version: '17.0',
            modules_affected: ['POS', 'Achats', 'Stock', 'Comptabilité'],
            technologies: ['Python', 'PostgreSQL', 'Odoo SH', 'PyCharm'],
            results: 'Amélioration de 25% de l’efficacité des ventes, réduction de 15% des erreurs de caisse, et augmentation de 20% des ventes grâce à une meilleure gestion des sessions et une traçabilité améliorée.',
            challenge: 'Le module POS standard ne supportait pas la gestion spécifique des sessions de vente pour une entreprise de poker, ce qui entraînait des erreurs fréquentes et une insatisfaction des clients. De plus, les caissières avaient du mal à gérer les ventes associées à leurs sessions en cours.',
            solution: 'Développement d’une extension personnalisée du module POS intégrant une gestion avancée des sessions de vente, une interface utilisateur améliorée pour les caissières, et une synchronisation en temps réel avec le module d’inventaire pour garantir la disponibilité des produits.',
            completion_date: '2024-10-10T00:00:00.000Z',
            is_featured: true,
            status: 'completed',
            image_url: 'images/img5.jpg'
        }
    ],

    // Initialisation
    init: () => {
        portfolioModule.setupFilters();
        portfolioModule.loadProjects();
        portfolioModule.setupModal();
    },

    // Configuration des filtres
    setupFilters: () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Retirer la classe active de tous les boutons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Ajouter la classe active au bouton cliqué
                button.classList.add('active');
                
                // Mettre à jour le filtre actuel
                portfolioModule.config.currentFilter = button.getAttribute('data-filter');
                portfolioModule.config.currentPage = 1;
                
                // Filtrer les projets
                portfolioModule.filterProjects();
            });
        });
    },

    // Charger les projets depuis l'API ou utiliser les données de secours
    loadProjects: async () => {
         portfolioModule.renderProjects(portfolioModule.fallbackData);
        /*try {
            const response = await fetch(portfolioModule.config.apiEndpoint, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur API');
            }

            const data = await response.json();
            const projects = data.data || [];
            
            if (projects.length === 0) {
                portfolioModule.renderProjects(portfolioModule.fallbackData);
            } else {
                portfolioModule.renderProjects(projects);
            }
        } catch (error) {
            console.warn('Erreur lors du chargement des projets:', error);
            portfolioModule.renderProjects(portfolioModule.fallbackData);
        } */
    },

    // Filtrer les projets
    filterProjects: () => {
        const portfolioGrid = document.getElementById('portfolio-grid');
        const items = portfolioGrid.querySelectorAll('.portfolio-item');
        const filter = portfolioModule.config.currentFilter;
        
        items.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.add('show');
                }, 100);
            } else {
                item.classList.remove('show');
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    },

    // Afficher les projets
    renderProjects: (projects) => {
        const portfolioGrid = document.getElementById('portfolio-grid');
        
        if (!portfolioGrid) return;
        
        // Vider la grille existante
        portfolioGrid.innerHTML = '';
        
        // Filtrer selon le filtre actuel
        const filteredProjects = portfolioModule.config.currentFilter === 'all' 
            ? projects 
            : projects.filter(project => project.category === portfolioModule.config.currentFilter);
        
        // Limiter au nombre d'éléments par page
        const startIndex = (portfolioModule.config.currentPage - 1) * portfolioModule.config.itemsPerPage;
        const endIndex = startIndex + portfolioModule.config.itemsPerPage;
        const projectsToShow = filteredProjects.slice(startIndex, endIndex);
        
        projectsToShow.forEach(project => {
            const projectElement = portfolioModule.createProjectElement(project);
            portfolioGrid.appendChild(projectElement);
        });
        
        // Ajouter la pagination si nécessaire
        if (filteredProjects.length > portfolioModule.config.itemsPerPage) {
            portfolioModule.renderPagination(filteredProjects.length);
        }
    },

    // Créer un élément de projet
    createProjectElement: (project) => {
        const projectDiv = document.createElement('div');
        projectDiv.className = 'portfolio-item';
        projectDiv.setAttribute('data-category', project.category);
        
        // Formater la date
        const completionDate = new Date(project.completion_date);
        const formattedDate = completionDate.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long'
        });
        
        projectDiv.innerHTML = `
            <div class="portfolio-image-wrapper">
                <img src="${project.image_url}" 
                     alt="${project.title}" 
                     class="portfolio-image"
                     loading="lazy">
                <div class="portfolio-overlay">
                    <div class="portfolio-overlay-content">
                        <h4>${project.title}</h4>
                        <p>${project.client_name}</p>
                        <button class="btn btn-primary btn-sm" onclick="portfolioModule.showProjectDetails('${project.id}')">
                            Voir détails
                        </button>
                    </div>
                </div>
                ${project.is_featured ? '<div class="portfolio-badge">À la une</div>' : ''}
            </div>
            <div class="portfolio-content">
                <div class="portfolio-tags">
                    ${project.modules_affected.map(module => 
                        `<span class="portfolio-tag">${module}</span>`
                    ).join('')}
                </div>
                <h3 class="portfolio-title">${project.title}</h3>
                <p class="portfolio-description">${project.description}</p>
                <div class="portfolio-meta">
                    <span class="portfolio-client">
                        <i class="fas fa-building"></i>
                        ${project.client_name}
                    </span>
                    <span class="portfolio-duration">
                        <i class="fas fa-calendar"></i>
                        ${project.project_duration}
                    </span>
                </div>
                <div class="portfolio-tech">
                    <span class="tech-label">Technologies:</span>
                    <div class="tech-tags">
                        ${project.technologies.map(tech => 
                            `<span class="tech-tag">${tech}</span>`
                        ).join('')}
                    </div>
                </div>
                <div class="portfolio-footer">
                    <span class="portfolio-date">${formattedDate}</span>
                    <a href="#" class="portfolio-link" onclick="portfolioModule.showProjectDetails('${project.id}')">
                        En savoir plus <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;
        
        // Ajouter l'événement de clic pour la modale
        projectDiv.addEventListener('click', (e) => {
            if (!e.target.closest('.portfolio-overlay')) {
                portfolioModule.showProjectDetails(project.id);
            }
        });
        
        return projectDiv;
    },

    // Afficher les détails du projet dans une modale
    showProjectDetails: async (projectId) => {
        try {
            // Chercher le projet dans les données chargées
            const project = portfolioModule.fallbackData.find(p => p.id === projectId);
            
            if (!project) {
                throw new Error('Projet non trouvé');
            }
            
            portfolioModule.renderProjectModal(project);
        } catch (error) {
            console.error('Erreur lors de l\'affichage des détails:', error);
            utils.showNotification('Erreur lors de l\'affichage des détails du projet.', 'error');
        }
    },

    // Afficher la modale avec les détails du projet
    renderProjectModal: (project) => {
        const modal = document.getElementById('project-modal');
        const modalBody = modal.querySelector('.modal-body');
        
        const completionDate = new Date(project.completion_date);
        const formattedDate = completionDate.toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        modalBody.innerHTML = `
            <div class="project-modal-content">
                <div class="project-modal-header">
                    <div class="project-modal-image">
                        <img src="${project.image_url || '/api/placeholder/600/300'}" alt="${project.title}">
                        <div class="project-modal-badge">${project.category}</div>
                    </div>
                    <div class="project-modal-info">
                        <h2>${project.title}</h2>
                        <div class="project-modal-meta">
                            <span><i class="fas fa-building"></i> ${project.client_name}</span>
                            <span><i class="fas fa-calendar"></i> ${project.project_duration}</span>
                            <span><i class="fas fa-code"></i> Odoo ${project.odoo_version}</span>
                        </div>
                    </div>
                </div>
                
                <div class="project-modal-body">
                    <div class="project-modal-section">
                        <h3><i class="fas fa-info-circle"></i> Description du projet</h3>
                        <p>${project.description}</p>
                    </div>
                    
                    <div class="project-modal-section">
                        <h3><i class="fas fa-exclamation-triangle"></i> Défi rencontré</h3>
                        <p>${project.challenge}</p>
                    </div>
                    
                    <div class="project-modal-section">
                        <h3><i class="fas fa-lightbulb"></i> Solution mise en œuvre</h3>
                        <p>${project.solution}</p>
                    </div>
                    
                    <div class="project-modal-section">
                        <h3><i class="fas fa-chart-line"></i> Résultats obtenus</h3>
                        <p>${project.results}</p>
                    </div>
                    
                    <div class="project-modal-section">
                        <h3><i class="fas fa-cogs"></i> Modules Odoo concernés</h3>
                        <div class="project-modal-modules">
                            ${project.modules_affected.map(module => 
                                `<span class="module-tag">${module}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal-section">
                        <h3><i class="fas fa-code"></i> Technologies utilisées</h3>
                        <div class="project-modal-tech">
                            ${project.technologies.map(tech => 
                                `<span class="tech-tag">${tech}</span>`
                            ).join('')}
                        </div>
                    </div>
                    
                    <div class="project-modal-footer">
                        <div class="project-modal-date">
                            <i class="fas fa-calendar-check"></i>
                            Terminé en ${formattedDate}
                        </div>
                        <button class="btn btn-primary" onclick="portfolioModule.contactForSimilarProject()">
                            <i class="fas fa-envelope"></i>
                            Projet similaire ?
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        // Afficher la modale
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    // Configuration de la modale
    setupModal: () => {
        const modal = document.getElementById('project-modal');
        const closeBtn = modal.querySelector('.modal-close');
        const overlay = modal.querySelector('.modal-overlay');
        
        // Fermer la modale
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        };
        
        closeBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', closeModal);
        
        // Fermer avec la touche Échap
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    },

    // Contact pour un projet similaire
    contactForSimilarProject: () => {
        // Fermer la modale
        const modal = document.getElementById('project-modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Scroller vers le formulaire de contact
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            
            // Pré-remplir le sujet
            const subjectSelect = document.getElementById('subject');
            if (subjectSelect) {
                subjectSelect.value = 'development';
            }
        }
    }
};

// Initialiser le module portfolio
document.addEventListener('DOMContentLoaded', () => {
    portfolioModule.init();
});

// Exporter pour utilisation externe
window.portfolioModule = portfolioModule;