// License and Feature Management System
// Plans: TRIAL (14d) · SOLO ($39) · CLINICA ($79 + $15/vet) · ENTERPRISE ($199+)

const LicenseManager = {

    // ─── PLAN DEFINITIONS ────────────────────────────────────────────────────

    PLANS: {
        TRIAL: {
            id: 'trial',
            name: 'Trial Premium',
            price: 0,
            trialDays: 14,
            limits: {
                maxAppointmentsPerMonth: Infinity,
                maxClients: Infinity,
                maxVets: 5,
                maxUsers: Infinity,
                maxPatientsPerClient: Infinity,
                maxClinicalRecordsPerMonth: Infinity,
                storageType: 'cloud'
            },
            features: {
                basicDashboard: true,
                appointmentManagement: true,
                clientManagement: true,
                basicClinicalRecords: true,
                automation: true,
                autoConfirmations: true,
                autoReminders: true,
                autoFollowups: true,
                triageForm: true,
                whatsappIntegration: true,
                emailIntegration: true,
                advancedReports: true,
                dataExport: true,
                pdfGeneration: true,
                cloudSync: true,
                multiDevice: true,
                multiUser: true,
                educationalContent: 'full',
                customTemplates: true,
                prioritySupport: false,
                onboarding: false
            },
            branding: { watermark: false, customLogo: false, customColors: false }
        },

        SOLO: {
            id: 'solo',
            name: 'VetConnect Solo',
            price: 39,
            priceAnnual: 390, // 2 months free
            limits: {
                maxAppointmentsPerMonth: 20,
                maxClients: 10,
                maxVets: 1,
                maxUsers: 1,
                maxPatientsPerClient: 5,
                maxClinicalRecordsPerMonth: 20,
                storageType: 'cloud'
            },
            features: {
                basicDashboard: true,
                appointmentManagement: true,
                clientManagement: true,
                basicClinicalRecords: true,
                automation: false,
                autoConfirmations: false,
                autoReminders: false,
                autoFollowups: false,
                triageForm: false,
                whatsappIntegration: false,
                emailIntegration: true,
                advancedReports: false,
                dataExport: false,
                pdfGeneration: false,
                cloudSync: true,
                multiDevice: true,
                multiUser: false,
                educationalContent: 'limited',
                customTemplates: false,
                prioritySupport: false,
                onboarding: false
            },
            branding: { watermark: true, customLogo: false, customColors: false }
        },

        CLINICA: {
            id: 'clinica',
            name: 'VetConnect Clínica',
            price: 79,            // includes 5 vets
            pricePerExtraVet: 15, // each additional vet beyond 5
            priceAnnual: 790,
            limits: {
                maxAppointmentsPerMonth: Infinity,
                maxClients: Infinity,
                maxVets: 5,              // base; each extra is $15/mes
                maxUsers: Infinity,
                maxPatientsPerClient: Infinity,
                maxClinicalRecordsPerMonth: Infinity,
                storageType: 'cloud'
            },
            features: {
                basicDashboard: true,
                appointmentManagement: true,
                clientManagement: true,
                basicClinicalRecords: true,
                automation: true,
                autoConfirmations: true,
                autoReminders: true,
                autoFollowups: true,
                triageForm: true,
                whatsappIntegration: true,
                emailIntegration: true,
                advancedReports: true,
                dataExport: true,
                pdfGeneration: true,
                cloudSync: true,
                multiDevice: true,
                multiUser: true,
                educationalContent: 'full',
                customTemplates: true,
                prioritySupport: true,
                onboarding: true
            },
            branding: { watermark: false, customLogo: true, customColors: true }
        },

        ENTERPRISE: {
            id: 'enterprise',
            name: 'VetConnect Enterprise',
            price: 199,       // base; exact pricing via sales
            priceAnnual: null, // negotiated
            limits: {
                maxAppointmentsPerMonth: Infinity,
                maxClients: Infinity,
                maxVets: Infinity,
                maxUsers: Infinity,
                maxPatientsPerClient: Infinity,
                maxClinicalRecordsPerMonth: Infinity,
                storageType: 'cloud'
            },
            features: {
                basicDashboard: true,
                appointmentManagement: true,
                clientManagement: true,
                basicClinicalRecords: true,
                automation: true,
                autoConfirmations: true,
                autoReminders: true,
                autoFollowups: true,
                triageForm: true,
                whatsappIntegration: true,
                emailIntegration: true,
                advancedReports: true,
                dataExport: true,
                pdfGeneration: true,
                cloudSync: true,
                multiDevice: true,
                multiUser: true,
                educationalContent: 'full',
                customTemplates: true,
                prioritySupport: true,
                onboarding: true,
                dedicatedSupport: true,
                sso: true,
                apiAccess: true,
                multiLocation: true
            },
            branding: { watermark: false, customLogo: true, customColors: true }
        }
    },

    // ─── STATE ───────────────────────────────────────────────────────────────

    currentLicense: null,
    usageStats: {
        appointmentsThisMonth: 0,
        totalClients: 0,
        totalVets: 1,
        totalUsers: 1,
        clinicalRecordsThisMonth: 0
    },

    // ─── INIT ────────────────────────────────────────────────────────────────

    async init() {
        const stored = localStorage.getItem('vetconnect_license');

        if (stored) {
            this.currentLicense = JSON.parse(stored);
        } else {
            // New accounts start on TRIAL
            this.currentLicense = {
                plan: 'TRIAL',
                activatedAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'active',
                extraVets: 0
            };
            this.saveLicense();
        }

        this.loadUsageStats();

        if (this.currentLicense.plan === 'TRIAL') {
            this.checkTrialExpiration();
        }

        return this.currentLicense;
    },

    // ─── FEATURE / LIMIT CHECKS ──────────────────────────────────────────────

    canUse(featureName) {
        const plan = this.PLANS[this.currentLicense.plan];
        if (!plan) return false;
        return plan.features[featureName] === true;
    },

    checkLimit(limitName) {
        const plan = this.PLANS[this.currentLicense.plan];
        if (!plan) return { limit: 0, current: 0, remaining: 0, isExceeded: true, percentage: 100 };

        let limit = plan.limits[limitName];

        // maxVets can be extended by extra purchased vets
        if (limitName === 'maxVets' && this.currentLicense.extraVets) {
            limit = (limit === Infinity) ? Infinity : limit + this.currentLicense.extraVets;
        }

        const current = this.usageStats[limitName] || 0;
        return {
            limit,
            current,
            remaining: limit === Infinity ? Infinity : limit - current,
            isExceeded: limit !== Infinity && current >= limit,
            percentage: limit === Infinity ? 0 : (current / limit) * 100
        };
    },

    incrementUsage(limitName, amount = 1) {
        this.usageStats[limitName] = (this.usageStats[limitName] || 0) + amount;
        this.saveUsageStats();

        const status = this.checkLimit(limitName);
        if (status.isExceeded) {
            this.showLimitWarning(limitName);
            return false;
        }
        if (status.percentage >= 80) {
            this.showLimitWarning(limitName);
        }
        return true;
    },

    // ─── UPGRADE PROMPTS ─────────────────────────────────────────────────────

    showUpgradePrompt(featureName) {
        const featureLabels = {
            automation: 'Automatizaciones',
            autoConfirmations: 'Confirmaciones Automáticas',
            autoReminders: 'Recordatorios Automáticos',
            whatsappIntegration: 'Integración con WhatsApp',
            advancedReports: 'Reportes Avanzados',
            dataExport: 'Exportación de Datos',
            pdfGeneration: 'Generación de PDF',
            multiUser: 'Múltiples Usuarios',
            customTemplates: 'Plantillas Personalizadas',
            triageForm: 'Formulario de Triage'
        };

        const displayName = featureLabels[featureName] || featureName;
        const currentPlan = this.currentLicense.plan;

        // Choose upgrade target based on current plan
        const upgradeTarget = (currentPlan === 'SOLO') ? 'CLINICA' : 'CLINICA';
        const targetPlan = this.PLANS[upgradeTarget];

        const content = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">🔒</div>
        <h2 style="margin-bottom: 1rem;">Función no disponible en tu plan</h2>
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem;">
          <strong>${displayName}</strong> está incluido en el plan Clínica y Enterprise.
        </p>

        <div style="background: var(--bg-glass); border-radius: var(--radius-lg); padding: 1.5rem; margin-bottom: 2rem; text-align: left;">
          <h3 style="margin-bottom: 1rem;">Plan Clínica incluye:</h3>
          <div style="padding: 0.4rem 0;">✅ Automatizaciones completas</div>
          <div style="padding: 0.4rem 0;">✅ WhatsApp + Email + SMS</div>
          <div style="padding: 0.4rem 0;">✅ Citas y clientes ilimitados</div>
          <div style="padding: 0.4rem 0;">✅ Hasta 5 veterinarios (+$15/adicional)</div>
          <div style="padding: 0.4rem 0;">✅ Reportes avanzados y exportación PDF</div>
          <div style="padding: 0.4rem 0;">✅ Soporte prioritario</div>
        </div>

        <div style="background: var(--primary-gradient); padding: 1.5rem; border-radius: var(--radius-lg); margin-bottom: 2rem;">
          <div style="font-size: 0.875rem; opacity: 0.9; margin-bottom: 0.5rem;">Plan Clínica</div>
          <div style="font-size: 3rem; font-weight: 700; line-height: 1;">$79</div>
          <div style="font-size: 1rem; opacity: 0.9;">por mes · 5 vets incluidos</div>
        </div>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          ${currentPlan === 'TRIAL' || currentPlan === 'SOLO'
              ? `<button class="btn btn-primary" onclick="LicenseManager.upgradeToClinica()" style="font-size: 1.125rem; padding: 1rem 2rem;">
                  Actualizar a Clínica
                </button>`
              : ''}
          <button class="btn btn-secondary" onclick="LicenseManager.viewPricing()">
            Ver todos los planes
          </button>
        </div>

        <p style="font-size: 0.875rem; color: var(--text-muted); margin-top: 1.5rem;">
          Sin compromiso. Cancela cuando quieras.
        </p>
      </div>`;

        if (typeof App !== 'undefined') {
            App.showModal('Actualiza tu Plan', content);
        }
    },

    showLimitWarning(limitName) {
        const status = this.checkLimit(limitName);
        if (!status.isExceeded && status.percentage < 80) return;

        const limitLabels = {
            appointmentsThisMonth: 'citas este mes',
            totalClients: 'clientes',
            clinicalRecordsThisMonth: 'registros clínicos este mes',
            totalVets: 'veterinarios'
        };

        const displayName = limitLabels[limitName] || limitName;
        const plan = this.PLANS[this.currentLicense.plan];
        const planName = plan ? plan.name : 'tu plan';

        let message, action;
        if (status.isExceeded) {
            message = `Alcanzaste el límite de ${status.limit} ${displayName} de ${planName}.`;
            action = 'Actualiza tu plan para continuar.';
        } else {
            message = `Usaste ${status.current} de ${status.limit} ${displayName} (${Math.round(status.percentage)}%).`;
            action = 'Considera actualizar para obtener acceso ilimitado.';
        }

        if (typeof App !== 'undefined') {
            App.showNotification('Límite de plan', `${message} ${action}`, 'warning');
        }
    },

    // ─── TRIAL ───────────────────────────────────────────────────────────────

    checkTrialExpiration() {
        if (!this.currentLicense.expiresAt) return;

        const expiresAt = new Date(this.currentLicense.expiresAt);
        const now = new Date();

        if (now > expiresAt) {
            // Trial expired — downgrade to SOLO (not free)
            this.currentLicense.plan = 'SOLO';
            this.currentLicense.status = 'expired';
            this.saveLicense();
            this.showTrialExpiredMessage();
        } else {
            const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
            if (daysRemaining <= 3) {
                this.showTrialExpiringMessage(daysRemaining);
            }
        }
    },

    showTrialExpiredMessage() {
        const content = `
      <div style="text-align: center; padding: 2rem;">
        <div style="font-size: 4rem; margin-bottom: 1rem;">⏰</div>
        <h2 style="margin-bottom: 1rem;">Tu período de prueba finalizó</h2>
        <p style="font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 2rem;">
          Tu cuenta ha pasado al plan <strong>Solo ($39/mes)</strong>. Las funciones de automatización e integraciones están pausadas.
        </p>
        <p style="margin-bottom: 2rem;">
          Actualiza al plan <strong>Clínica ($79/mes)</strong> para recuperar todas las características, incluyendo WhatsApp, recordatorios automáticos y reportes avanzados.
        </p>

        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="LicenseManager.upgradeToClinica()" style="font-size: 1.125rem; padding: 1rem 2rem;">
            Actualizar a Clínica — $79/mes
          </button>
          <button class="btn btn-secondary" onclick="LicenseManager.viewPricing()">
            Ver todos los planes
          </button>
        </div>
      </div>`;

        if (typeof App !== 'undefined') {
            App.showModal('Prueba Finalizada', content);
        }
    },

    showTrialExpiringMessage(daysRemaining) {
        if (typeof App !== 'undefined') {
            App.showNotification(
                `⏰ Trial expira en ${daysRemaining} día${daysRemaining !== 1 ? 's' : ''}`,
                'Actualiza al plan Clínica para mantener todas las funciones',
                'warning'
            );
        }
    },

    // ─── UPGRADE ACTIONS ─────────────────────────────────────────────────────

    async upgradeToSolo() {
        // In production: redirect to Stripe Checkout for SOLO plan
        if (typeof App !== 'undefined') {
            App.closeModal();
            App.showNotification('Redirigiendo a pago...', 'Plan Solo — $39/mes', 'info');
        }
        setTimeout(() => {
            // window.location.href = '/checkout?plan=solo';
            window.location.href = '../pricing.html';
        }, 1200);
    },

    async upgradeToClinica() {
        // In production: redirect to Stripe Checkout for CLINICA plan
        if (typeof App !== 'undefined') {
            App.closeModal();
            App.showNotification('Redirigiendo a pago...', 'Plan Clínica — $79/mes', 'info');
        }
        setTimeout(() => {
            // window.location.href = '/checkout?plan=clinica';
            window.location.href = '../pricing.html';
        }, 1200);
    },

    contactEnterpriseSales() {
        window.location.href = 'mailto:ventas@biovetai.org?subject=VetConnect Enterprise - Consulta&body=Hola,%20estoy%20interesado%20en%20el%20plan%20Enterprise%20para%20mi%20organización.';
    },

    viewPricing() {
        if (typeof App !== 'undefined') App.closeModal();
        // Resolve relative path: works from both root and subdirectories
        const base = window.location.pathname.includes('/auth/') ? '../' : '';
        window.location.href = `${base}pricing.html`;
    },

    // ─── PLAN INFO ───────────────────────────────────────────────────────────

    getCurrentPlan() {
        return this.PLANS[this.currentLicense.plan] || this.PLANS['SOLO'];
    },

    getPlanBadge() {
        const planId = this.currentLicense.plan;
        const plan = this.getCurrentPlan();

        const badgeMap = {
            TRIAL:      { cls: 'badge-info',    icon: '🎁' },
            SOLO:       { cls: 'badge-warning',  icon: '👤' },
            CLINICA:    { cls: 'badge-success',  icon: '🏥' },
            ENTERPRISE: { cls: 'badge-primary',  icon: '🏢' }
        };

        const { cls, icon } = badgeMap[planId] || badgeMap['SOLO'];
        return `<span class="badge ${cls}">${icon} ${plan.name}</span>`;
    },

    getTrialDaysRemaining() {
        if (this.currentLicense.plan !== 'TRIAL') return 0;
        if (!this.currentLicense.expiresAt) return 0;
        const diff = new Date(this.currentLicense.expiresAt) - new Date();
        return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    },

    // ─── PERSISTENCE ─────────────────────────────────────────────────────────

    saveLicense() {
        localStorage.setItem('vetconnect_license', JSON.stringify(this.currentLicense));
    },

    saveUsageStats() {
        localStorage.setItem('vetconnect_usage_stats', JSON.stringify(this.usageStats));
    },

    loadUsageStats() {
        const stored = localStorage.getItem('vetconnect_usage_stats');
        if (stored) {
            try { this.usageStats = JSON.parse(stored); } catch { /* ignore */ }
        }
    }
};

// ─── GLOBAL EXPORT ───────────────────────────────────────────────────────────

if (typeof window !== 'undefined') {
    window.LicenseManager = LicenseManager;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => LicenseManager.init());
    } else {
        LicenseManager.init();
    }
}
