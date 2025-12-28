// Authentication and Role Management System
// Multi-tenant architecture for VetConnect SaaS

const AuthManager = {
    // Role hierarchy
    ROLES: {
        SUPER_ADMIN: {
            id: 'super_admin',
            name: 'Super Administrador',
            level: 100,
            description: 'Administrador de la plataforma VetConnect',
            permissions: [
                'view_all_clinics',
                'manage_clinics',
                'view_all_users',
                'manage_subscriptions',
                'view_platform_analytics',
                'access_super_admin_panel',
                'manage_system_settings',
                'view_financials',
                'provide_support',
                // Plus all clinic and user permissions
                '*' // Wildcard - all permissions
            ]
        },

        CLINIC_ADMIN: {
            id: 'clinic_admin',
            name: 'Administrador de Clínica',
            level: 50,
            description: 'Dueño/Administrador de la clínica',
            permissions: [
                'manage_clinic_users',
                'manage_clinic_settings',
                'view_clinic_analytics',
                'manage_subscription',
                'export_data',
                'manage_integrations',
                'view_billing',
                // Plus all veterinarian permissions
                'manage_appointments',
                'manage_clients',
                'manage_clinical_records',
                'send_communications',
                'view_reports'
            ]
        },

        VETERINARIAN: {
            id: 'veterinarian',
            name: 'Veterinario',
            level: 30,
            description: 'Médico veterinario',
            permissions: [
                'manage_appointments',
                'manage_clients',
                'create_clinical_records',
                'edit_own_clinical_records',
                'view_clinical_records',
                'send_communications',
                'view_reports',
                'manage_vaccinations',
                'generate_prescriptions'
            ]
        },

        RECEPTIONIST: {
            id: 'receptionist',
            name: 'Recepcionista',
            level: 10,
            description: 'Personal de recepción',
            permissions: [
                'manage_appointments',
                'manage_clients',
                'view_basic_patient_info',
                'send_basic_communications',
                'view_basic_reports'
            ]
        }
    },

    // Current user session
    currentUser: null,
    currentClinic: null,

    /**
     * Initialize authentication system
     */
    async init() {
        // Check for existing session
        const session = localStorage.getItem('vetconnect_session');

        if (session) {
            const sessionData = JSON.parse(session);

            // Validate session (in production, verify with backend)
            if (this.isSessionValid(sessionData)) {
                this.currentUser = sessionData.user;
                this.currentClinic = sessionData.clinic;
                return true;
            } else {
                // Session expired
                this.logout();
                return false;
            }
        }

        return false;
    },

    /**
     * Login user
     */
    async login(email, password) {
        // In production: API call to backend
        // For demo: simulate authentication

        try {
            // Simulate API call
            const response = await this.authenticateUser(email, password);

            if (response.success) {
                this.currentUser = response.user;
                this.currentClinic = response.clinic;

                // Save session
                this.saveSession({
                    user: response.user,
                    clinic: response.clinic,
                    token: response.token,
                    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
                });

                // Redirect based on role
                this.redirectToAppropriatePanel();

                return { success: true };
            } else {
                return { success: false, error: response.error };
            }
        } catch (error) {
            return { success: false, error: error.message };
        }
    },

    /**
     * Simulate user authentication (replace with real API)
     */
    async authenticateUser(email, password) {
        // Demo users
        const demoUsers = {
            // Super Admin - Luis (Platform Owner)
            'admin@vetconnect.com': {
                user: {
                    id: 1,
                    email: 'admin@vetconnect.com',
                    name: 'Luis Maroto',
                    role: 'super_admin',
                    avatar: null
                },
                clinic: null, // Super admin is not tied to a clinic
                token: 'demo_super_admin_token'
            },

            // Clinic Admin - Demo clinic owner
            'admin@clinicaveterinaria.com': {
                user: {
                    id: 2,
                    email: 'admin@clinicaveterinaria.com',
                    name: 'Dr. María García',
                    role: 'clinic_admin',
                    avatar: null
                },
                clinic: {
                    id: 1,
                    name: 'Clínica Veterinaria Ejemplo',
                    plan: 'premium',
                    status: 'active'
                },
                token: 'demo_clinic_admin_token'
            },

            // Veterinarian - Regular user
            'vet@clinicaveterinaria.com': {
                user: {
                    id: 3,
                    email: 'vet@clinicaveterinaria.com',
                    name: 'Dr. Carlos Rodríguez',
                    role: 'veterinarian',
                    avatar: null
                },
                clinic: {
                    id: 1,
                    name: 'Clínica Veterinaria Ejemplo',
                    plan: 'premium',
                    status: 'active'
                },
                token: 'demo_veterinarian_token'
            }
        };

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        if (demoUsers[email] && password === 'demo123') {
            return { success: true, ...demoUsers[email] };
        } else {
            return { success: false, error: 'Credenciales inválidas' };
        }
    },

    /**
     * Logout user
     */
    logout() {
        this.currentUser = null;
        this.currentClinic = null;
        localStorage.removeItem('vetconnect_session');
        window.location.href = 'login.html';
    },

    /**
     * Check if user has permission
     */
    hasPermission(permission) {
        if (!this.currentUser) return false;

        const role = this.ROLES[this.currentUser.role.toUpperCase()];
        if (!role) return false;

        // Super admin has all permissions
        if (role.permissions.includes('*')) return true;

        // Check specific permission
        return role.permissions.includes(permission);
    },

    /**
     * Check if user has role
     */
    hasRole(roleName) {
        if (!this.currentUser) return false;
        return this.currentUser.role === roleName;
    },

    /**
     * Check if role level is at least X
     */
    hasRoleLevel(minLevel) {
        if (!this.currentUser) return false;

        const role = this.ROLES[this.currentUser.role.toUpperCase()];
        return role && role.level >= minLevel;
    },

    /**
     * Get user's role info
     */
    getUserRole() {
        if (!this.currentUser) return null;
        return this.ROLES[this.currentUser.role.toUpperCase()];
    },

    /**
     * Redirect based on role
     */
    redirectToAppropriatePanel() {
        if (this.hasRole('super_admin')) {
            window.location.href = 'admin-panel.html';
        } else {
            window.location.href = 'index.html';
        }
    },

    /**
     * Save session to storage
     */
    saveSession(sessionData) {
        localStorage.setItem('vetconnect_session', JSON.stringify(sessionData));
    },

    /**
     * Validate session
     */
    isSessionValid(sessionData) {
        if (!sessionData || !sessionData.expiresAt) return false;

        const expiresAt = new Date(sessionData.expiresAt);
        const now = new Date();

        return now < expiresAt;
    },

    /**
     * Require authentication - call on protected pages
     */
    requireAuth() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    /**
     * Require specific permission
     */
    requirePermission(permission) {
        if (!this.requireAuth()) return false;

        if (!this.hasPermission(permission)) {
            this.showAccessDenied();
            return false;
        }

        return true;
    },

    /**
     * Show access denied message
     */
    showAccessDenied() {
        if (typeof App !== 'undefined') {
            App.showNotification(
                'Acceso Denegado',
                'No tienes permisos para acceder a esta función',
                'error'
            );
        } else {
            alert('Acceso denegado. No tienes permisos suficientes.');
        }
    },

    /**
     * Get display header for current user
     */
    getUserHeaderHTML() {
        if (!this.currentUser) return '';

        const role = this.getUserRole();

        return `
      <div style="display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-glass); border-radius: var(--radius-md);">
        <div style="width: 40px; height: 40px; background: var(--primary-gradient); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 700;">
          ${this.currentUser.name.charAt(0)}
        </div>
        <div style="flex: 1;">
          <div style="font-weight: 600;">${this.currentUser.name}</div>
          <div style="font-size: 0.875rem; color: var(--text-muted);">
            ${role.name}
            ${this.currentClinic ? ` • ${this.currentClinic.name}` : ' • Plataforma VetConnect'}
          </div>
        </div>
        <button onclick="AuthManager.logout()" class="btn btn-secondary" style="padding: 0.5rem 1rem;">
          Salir
        </button>
      </div>
    `;
    }
};

// Auto-initialize on page load
if (typeof window !== 'undefined') {
    window.AuthManager = AuthManager;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            AuthManager.init();
        });
    } else {
        AuthManager.init();
    }
}
