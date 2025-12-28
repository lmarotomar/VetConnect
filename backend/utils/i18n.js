// Internationalization (i18n) Module
// Language support: ES (Spanish) and EN (English)

const i18n = {
    currentLanguage: 'es',

    translations: {
        es: {
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.appointments': 'Citas',
            'nav.clinical_records': 'Historias Clínicas',
            'nav.communication': 'Comunicación',
            'nav.education': 'Educación',
            'nav.billing': 'Facturación',
            'nav.inventory': 'Inventario',
            'nav.reports': 'Reportes',
            'nav.settings': 'Configuración',

            // Header
            'header.new_appointment': 'Nueva Cita',
            'header.logout': 'Cerrar Sesión',
            'header.help': 'Ayuda',

            // Titles
            'title.dashboard': 'Dashboard',
            'title.appointments': 'Gestión de Citas',
            'title.clinical_records': 'Historias Clínicas',
            'title.communication': 'Centro de Comunicación',
            'title.education': 'Educación del Cliente',
            'title.reports': 'Reportes y Análisis',
            'title.settings': 'Configuración',

            // Dashboard
            'dashboard.appointments_today': 'Citas de Hoy',
            'dashboard.pending_communications': 'Comunicaciones Pendientes',
            'dashboard.recent_activity': 'Actividad Reciente',
            'dashboard.quick_actions': 'Acciones Rápidas',
            'dashboard.stats.appointments': 'Citas',
            'dashboard.stats.clients': 'Clientes',
            'dashboard.stats.communications': 'Comunicaciones',
            'dashboard.stats.revenue': 'Ingresos',

            // Common
            'common.confirmed': 'Confirmado',
            'common.pending': 'Pendiente',
            'common.completed': 'Completado',
            'common.cancelled': 'Cancelado',
            'common.save': 'Guardar',
            'common.cancel': 'Cancelar',
            'common.close': 'Cerrar',
            'common.delete': 'Eliminar',
            'common.edit': 'Editar',
            'common.view': 'Ver',
            'common.send': 'Enviar',
            'common.export': 'Exportar',
            'common.filter': 'Filtrar',
            'common.search': 'Buscar',
            'common.all': 'Todas',

            // Footer
            'footer.legal_docs': 'Documentos Legales',
            'footer.terms': 'Términos',
            'footer.privacy': 'Privacidad',
            'footer.pricing': 'Precios',
            'footer.copyright': '© 2025 VetConnect - BioVetAI',
            'footer.description': 'Sistema integral de automatización veterinaria',

            // Notifications
            'notif.appointment_created': 'Cita creada',
            'notif.confirmation_sent': 'Confirmación enviada',
            'notif.reminders_scheduled': 'Recordatorios programados',
            'notif.language_changed': 'Idioma cambiado a Español'
        },

        en: {
            // Navigation
            'nav.dashboard': 'Dashboard',
            'nav.appointments': 'Appointments',
            'nav.clinical_records': 'Clinical Records',
            'nav.communication': 'Communication',
            'nav.education': 'Education',
            'nav.billing': 'Billing',
            'nav.inventory': 'Inventory',
            'nav.reports': 'Reports',
            'nav.settings': 'Settings',

            // Header
            'header.new_appointment': 'New Appointment',
            'header.logout': 'Logout',
            'header.help': 'Help',

            // Titles
            'title.dashboard': 'Dashboard',
            'title.appointments': 'Appointment Management',
            'title.clinical_records': 'Clinical Records',
            'title.communication': 'Communication Center',
            'title.education': 'Client Education',
            'title.reports': 'Reports & Analytics',
            'title.settings': 'Settings',

            // Dashboard
            'dashboard.appointments_today': "Today's Appointments",
            'dashboard.pending_communications': 'Pending Communications',
            'dashboard.recent_activity': 'Recent Activity',
            'dashboard.quick_actions': 'Quick Actions',
            'dashboard.stats.appointments': 'Appointments',
            'dashboard.stats.clients': 'Clients',
            'dashboard.stats.communications': 'Communications',
            'dashboard.stats.revenue': 'Revenue',

            // Common
            'common.confirmed': 'Confirmed',
            'common.pending': 'Pending',
            'common.completed': 'Completed',
            'common.cancelled': 'Cancelled',
            'common.save': 'Save',
            'common.cancel': 'Cancel',
            'common.close': 'Close',
            'common.delete': 'Delete',
            'common.edit': 'Edit',
            'common.view': 'View',
            'common.send': 'Send',
            'common.export': 'Export',
            'common.filter': 'Filter',
            'common.search': 'Search',
            'common.all': 'All',

            // Footer
            'footer.legal_docs': 'Legal Documents',
            'footer.terms': 'Terms',
            'footer.privacy': 'Privacy',
            'footer.pricing': 'Pricing',
            'footer.copyright': '© 2025 VetConnect - BioVetAI',
            'footer.description': 'Comprehensive veterinary automation system',

            // Notifications
            'notif.appointment_created': 'Appointment created',
            'notif.confirmation_sent': 'Confirmation sent',
            'notif.reminders_scheduled': 'Reminders scheduled',
            'notif.language_changed': 'Language changed to English'
        }
    },

    init() {
        // Load saved language preference
        const savedLang = localStorage.getItem('vetconnect_language');
        if (savedLang && this.translations[savedLang]) {
            this.currentLanguage = savedLang;
        }
        this.applyLanguage();
    },

    t(key) {
        // Translate function
        return this.translations[this.currentLanguage][key] || key;
    },

    setLanguage(lang) {
        if (!this.translations[lang]) {
            console.error(`Language ${lang} not supported`);
            return;
        }

        this.currentLanguage = lang;
        localStorage.setItem('vetconnect_language', lang);
        this.applyLanguage();

        // Show notification
        if (typeof App !== 'undefined') {
            const message = lang === 'es' ? 'Idioma cambiado a Español' : 'Language changed to English';
            App.showNotification('✅', message, 'success');
        }

        // Reload current view
        if (typeof App !== 'undefined' && App.currentView) {
            App.loadView(App.currentView);
        }
    },

    applyLanguage() {
        // Update all translatable elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });

        // Update page title
        if (typeof App !== 'undefined' && App.currentView) {
            const titleKey = `title.${App.currentView.replace(/-/g, '_')}`;
            const pageTitle = document.getElementById('pageTitle');
            if (pageTitle) {
                pageTitle.textContent = this.t(titleKey);
            }

            // Reload the current view to apply translations to dynamic content
            setTimeout(() => {
                App.loadView(App.currentView);
            }, 100);
        }

        // Update navigation menu
        this.updateNavigation();
    },

    updateNavigation() {
        // Update nav items
        const navItems = {
            'dashboard': 'nav.dashboard',
            'appointments': 'nav.appointments',
            'clinical-records': 'nav.clinical_records',
            'communication': 'nav.communication',
            'education': 'nav.education',
            'billing': 'nav.billing',
            'inventory': 'nav.inventory',
            'reports': 'nav.reports',
            'settings': 'nav.settings'
        };

        document.querySelectorAll('.nav-link').forEach(link => {
            const view = link.getAttribute('data-view');
            if (view && navItems[view]) {
                const textSpan = link.querySelector('span:last-child');
                if (textSpan) {
                    textSpan.textContent = this.t(navItems[view]);
                }
            }
        });
    },

    getCurrentLanguage() {
        return this.currentLanguage;
    },

    getLanguageName(code) {
        const names = {
            'es': 'Español',
            'en': 'English'
        };
        return names[code] || code;
    }
};

// Auto-initialize
if (typeof window !== 'undefined') {
    window.i18n = i18n;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            i18n.init();
        });
    } else {
        i18n.init();
    }
}
