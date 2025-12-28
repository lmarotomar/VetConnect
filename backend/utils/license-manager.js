// License and Feature Management System
// Implementación del sistema de licencias FREE vs PREMIUM

const LicenseManager = {
    // Definición de planes
    PLANS: {
        FREE: {
            id: 'free',
            name: 'VetConnect Free',
            price: 0,
            limits: {
                maxAppointmentsPerMonth: 50,
                maxClients: 25,
                maxUsers: 1,
                maxPatientsPerClient: 3,
                maxClinicalRecordsPerMonth: 50,
                storageType: 'local' // localStorage only
            },
            features: {
                // Core features
                basicDashboard: true,
                appointmentManagement: true,
                clientManagement: true,
                basicClinicalRecords: true,

                // Premium features (disabled in FREE)
                automation: false,
                autoConfirmations: false,
                autoReminders: false,
                autoFollowups: false,
                triageForm: false,

                // Integrations
                whatsappIntegration: false,
                twilioIntegration: false,
                emailIntegration: false,
                hubspotCRM: false,
                googleCalendar: false,
                googleSheets: false,

                // Advanced features
                advancedReports: false,
                customReports: false,
                dataExport: false,
                pdfGeneration: false,
                cloudSync: false,
                multiDevice: false,
                multiUser: false,

                // Content and education
                educationalContent: 'limited', // 'limited' or 'full'
                customTemplates: false,

                // Support
                prioritySupport: false,
                onboarding: false
            },
            branding: {
                watermark: true,
                customLogo: false,
                customColors: false
            }
        },

        PREMIUM: {
            id: 'premium',
            name: 'VetConnect Premium',
            price: 79, // USD per month
            limits: {
                maxAppointmentsPerMonth: Infinity,
                maxClients: Infinity,
                maxUsers: Infinity,
                maxPatientsPerClient: Infinity,
                maxClinicalRecordsPerMonth: Infinity,
                storageType: 'cloud'
            },
            features: {
                // All core features
                basicDashboard: true,
                appointmentManagement: true,
                clientManagement: true,
                basicClinicalRecords: true,

                // ALL automation enabled
                automation: true,
                autoConfirmations: true,
                autoReminders: true,
                autoFollowups: true,
                triageForm: true,

                // ALL integrations
                whatsappIntegration: true,
                twilioIntegration: true,
                emailIntegration: true,
                hubspotCRM: true,
                googleCalendar: true,
                googleSheets: true,

                // ALL advanced features
                advancedReports: true,
                customReports: true,
                dataExport: true,
                pdfGeneration: true,
                cloudSync: true,
                multiDevice: true,
                multiUser: true,

                // Full content
                educationalContent: 'full',
                customTemplates: true,

                // Premium support
                prioritySupport: true,
                onboarding: true
            },
            branding: {
                watermark: false,
                customLogo: true,
                customColors: true
            }
        },

        TRIAL: {
            id: 'trial',
            name: 'VetConnect Premium Trial',
            price: 0,
            trialDays: 14,

            // TRIAL has all PREMIUM features
            limits: { /* Same as PREMIUM */ },
            features: { /* Same as PREMIUM */ },
            branding: {
                watermark: false,
                customLogo: true,
                customColors: true
            }
        }
    },

    // Current license state (loaded from backend/localStorage)
    currentLicense: null,
    usageStats: {
        appointmentsThisMonth: 0,
        totalClients: 0,
        totalUsers: 1,
        clinicalRecordsThisMonth: 0
    },

    /**
     * Initialize license system
     */
    async init() {
        // Load current license from backend or localStorage
        const storedLicense = localStorage.getItem('vetconnect_license');

        if (storedLicense) {
            this.currentLicense = JSON.parse(storedLicense);
        } else {
            // Default to FREE plan
            this.currentLicense = {
                plan: 'FREE',
                activatedAt: new Date().toISOString(),
                expiresAt: null, // FREE never expires
                status: 'active'
            };
            this.saveLicense();
        }

        // Load usage stats
        this.loadUsageStats();

        // Check if trial expired
        if (this.currentLicense.plan === 'TRIAL') {
            this.checkTrialExpiration();
        }

        return this.currentLicense;
    },

    /**
     * Check if user can use a specific feature
     */
    canUse(featureName) {
        const plan = this.PLANS[this.currentLicense.plan];

        if (!plan) return false;

        return plan.features[featureName] === true;
    },

    /**
     * Check if limit is reached
     */
    checkLimit(limitName) {
        const plan = this.PLANS[this.currentLicense.plan];
        const limit = plan.limits[limitName];
        const current = this.usageStats[limitName] || 0;

        return {
            limit: limit,
            current: current,
            remaining: limit === Infinity ? Infinity : limit - current,
            isExceeded: limit !== Infinity && current >= limit,
            percentage: limit === Infinity ? 0 : (current / limit) * 100
        };
    },

    /**
     * Show upgrade prompt
     */
    showUpgradePrompt(featureName, context = {}) {
        const featureNames = {
            automation: 'Automatizaciones',
            autoConfirmations: 'Confirmaciones Automáticas',
            whatsappIntegration: 'Integración con WhatsApp',
            advancedReports: 'Reportes Avanzados',
            dataExport: 'Exportación de Datos',
            multiUser: 'Múltiples Usuarios'
        };

        const displayName = featureNames[featureName] || featureName;

        const benefits = [
            '✅ Automatizaciones completas de comunicación',
            '✅ Integración con WhatsApp, SMS y Email',
            '✅ Citas y clientes ilimitados',
            '✅ Reportes avanzados y exportación',
            '✅ Soporte prioritario 24/7',
            '✅ Backup automático en la nube'
        ];

        const content = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
        <h2 style="margin-bottom: 1rem;">Característica Premium</h2>
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem;">
          <strong>${displayName}</strong> está disponible en VetConnect Premium
        </p>
        
        <div style="background: var(--bg-glass); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; text-align: left;">
          <h3 style="margin-bottom: 1rem;">Con Premium obtienes:</h3>
          ${benefits.map(b => `<div style="padding: 0.5rem 0;">${b}</div>`).join('')}
        </div>
        
        <div style="background: var(--primary-gradient); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
          <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">Solo</div>
          <div style="font-size: 3rem; font-weight: 700; line-height: 1;">$79</div>
          <div style="font-size: 1rem; opacity: 0.9;">por mes</div>
        </div>
        
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="LicenseManager.startTrial()" style="font-size: 1.125rem; padding: 1rem 2rem;">
            🎁 Probar Gratis 14 Días
          </button>
          <button class="btn btn-secondary" onclick="LicenseManager.viewPricing()">
            Ver Planes y Precios
          </button>
        </div>
        
        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1.5rem;">
          Sin compromiso. Cancela cuando quieras.
        </p>
      </div>
    `;

        if (typeof App !== 'undefined') {
            App.showModal('Actualiza a Premium', content);
        }
    },

    /**
     * Show limit warning
     */
    showLimitWarning(limitName) {
        const status = this.checkLimit(limitName);

        if (!status.isExceeded && status.percentage < 80) {
            return; // Don't show warning if under 80%
        }

        const limitNames = {
            appointmentsThisMonth: 'citas este mes',
            totalClients: 'clientes',
            clinicalRecordsThisMonth: 'registros clínicos este mes'
        };

        const displayName = limitNames[limitName] || limitName;

        let message, action;

        if (status.isExceeded) {
            message = `Has alcanzado el límite de ${status.limit} ${displayName} del plan gratuito.`;
            action = 'Actualiza a Premium para continuar.';
        } else {
            message = `Has usado ${status.current} de ${status.limit} ${displayName} (${Math.round(status.percentage)}%).`;
            action = 'Considera actualizar a Premium para obtener acceso ilimitado.';
        }

        if (typeof App !== 'undefined') {
            App.showNotification(
                'Límite de Plan Gratuito',
                `${message} ${action}`,
                'warning'
            );
        }
    },

    /**
     * Increment usage counter
     */
    incrementUsage(limitName, amount = 1) {
        this.usageStats[limitName] = (this.usageStats[limitName] || 0) + amount;
        this.saveUsageStats();

        // Check if limit reached
        const status = this.checkLimit(limitName);
        if (status.isExceeded) {
            this.showLimitWarning(limitName);
            return false; // Action blocked
        }

        // Show warning if approaching limit
        if (status.percentage >= 80) {
            this.showLimitWarning(limitName);
        }

        return true; // Action allowed
    },

    /**
     * Start premium trial
     */
    async startTrial() {
        // In production, this would create a trial subscription in Stripe
        this.currentLicense = {
            plan: 'TRIAL',
            activatedAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
            status: 'active'
        };

        this.saveLicense();

        if (typeof App !== 'undefined') {
            App.closeModal();
            App.showNotification(
                '🎉 Trial Activado',
                'Tienes 14 días de acceso completo a VetConnect Premium. ¡Disfrútalo!',
                'success'
            );

            // Reload page to apply new permissions
            setTimeout(() => location.reload(), 1500);
        }
    },

    /**
     * Check if trial has expired
     */
    checkTrialExpiration() {
        if (!this.currentLicense.expiresAt) return;

        const expiresAt = new Date(this.currentLicense.expiresAt);
        const now = new Date();

        if (now > expiresAt) {
            // Trial expired, downgrade to FREE
            this.currentLicense.plan = 'FREE';
            this.currentLicense.status = 'expired';
            this.saveLicense();

            // Show expiration message
            this.showTrialExpiredMessage();
        } else {
            // Trial still active, show countdown
            const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 3) {
                this.showTrialExpiringMessage(daysRemaining);
            }
        }
    },

    /**
     * Show trial expired message
     */
    showTrialExpiredMessage() {
        const content = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">⏰</div>
        <h2 style="margin-bottom: 1rem;">Tu Trial ha Finalizado</h2>
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem;">
          Esperamos que hayas disfrutado de todas las características Premium.
        </p>
        
        <p style="margin-bottom: 2rem;">
          Tu cuenta ha sido cambiada al plan gratuito. Para continuar usando las automatizaciones y todas las características premium, actualiza ahora.
        </p>
        
        <div style="background: var(--primary-gradient); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
          <div style="font-size: 2rem; font-weight: 700;">20% OFF</div>
          <div style="font-size: 1rem; opacity: 0.9;">en tu primer mes si actualizas ahora</div>
        </div>
        
        <button class="btn btn-primary" onclick="LicenseManager.upgradeToPremium()" style="font-size: 1.125rem; padding: 1rem 2rem;">
          Actualizar a Premium
        </button>
      </div>
    `;

        if (typeof App !== 'undefined') {
            App.showModal('Trial Finalizado', content);
        }
    },

    /**
     * Show trial expiring soon message
     */
    showTrialExpiringMessage(daysRemaining) {
        if (typeof App !== 'undefined') {
            App.showNotification(
                `⏰ Trial expira en ${daysRemaining} días`,
                'Actualiza a Premium para mantener todas las características',
                'warning'
            );
        }
    },

    /**
     * Upgrade to premium
     */
    async upgradeToPremium() {
        // In production, redirect to Stripe checkout

        // For demo, just show message
        if (typeof App !== 'undefined') {
            App.closeModal();
            App.showNotification(
                'Redirigiendo a pago...',
                'Serás redirigido a la página de pago de Stripe',
                'info'
            );
        }

        // Simulate redirect
        setTimeout(() => {
            // window.location.href = '/checkout?plan=premium';
            alert('En producción, esto redirigiría a Stripe Checkout');
        }, 1500);
    },

    /**
     * View pricing page
     */
    viewPricing() {
        if (typeof App !== 'undefined') {
            App.closeModal();
        }

        // In production, navigate to pricing page
        // window.location.href = '/pricing';
        alert('En producción, esto mostraría la página de precios completa');
    },

    /**
     * Save license to storage
     */
    saveLicense() {
        localStorage.setItem('vetconnect_license', JSON.stringify(this.currentLicense));
    },

    /**
     * Save usage stats
     */
    saveUsageStats() {
        localStorage.setItem('vetconnect_usage_stats', JSON.stringify(this.usageStats));
    },

    /**
     * Load usage stats
     */
    loadUsageStats() {
        const stored = localStorage.getItem('vetconnect_usage_stats');
        if (stored) {
            this.usageStats = JSON.parse(stored);
        }
    },

    /**
     * Get current plan info
     */
    getCurrentPlan() {
        return this.PLANS[this.currentLicense.plan];
    },

    /**
     * Get plan badge HTML
     */
    getPlanBadge() {
        const plan = this.getCurrentPlan();
        const isPremium = this.currentLicense.plan === 'PREMIUM' || this.currentLicense.plan === 'TRIAL';

        const badgeClass = isPremium ? 'badge-success' : 'badge-warning';
        const icon = isPremium ? '💎' : '🆓';

        return `<span class="badge ${badgeClass}">${icon} ${plan.name}</span>`;
    }
};

// Initialize on page load
if (typeof window !== 'undefined') {
    window.LicenseManager = LicenseManager;

    // Auto-init when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            LicenseManager.init();
        });
    } else {
        LicenseManager.init();
    }
}
