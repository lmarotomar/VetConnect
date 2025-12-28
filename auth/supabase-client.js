// BioVetAI - Supabase Client Configuration
// This file handles the connection to Supabase for authentication and database

const SUPABASE_URL = 'https://dppxgwjvfiqbgjupxipf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRwcHhnd2p2ZmlxYmdqdXB4aXBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4ODE4MDksImV4cCI6MjA4MjQ1NzgwOX0.zBDqyWejXCkqeQ-9FqRIHg2QEeppwAgTGymZ_m3DLEc';

// Initialize Supabase client
let supabase = null;

// Role hierarchy and permissions
const ROLES = {
    SUPER_ADMIN: 'super_admin',
    CLINIC_ADMIN: 'clinic_admin',
    VETERINARIAN: 'veterinarian',
    TECHNICIAN: 'technician',
    RECEPTIONIST: 'receptionist',
    VIEWER: 'viewer'
};

const ROLE_LABELS = {
    super_admin: 'Super Administrador',
    clinic_admin: 'Administrador de Clínica',
    veterinarian: 'Veterinario',
    technician: 'Técnico/Asistente',
    receptionist: 'Recepcionista',
    viewer: 'Solo Lectura'
};

// Permissions matrix
const PERMISSIONS = {
    super_admin: {
        dashboard: true,
        appointments: true,
        patients: true,
        clients: true,
        billing: true,
        inventory: true,
        reports: true,
        settings: true,
        users: true,
        global_admin: true
    },
    clinic_admin: {
        dashboard: true,
        appointments: true,
        patients: true,
        clients: true,
        billing: true,
        inventory: true,
        reports: true,
        settings: true,
        users: true,
        global_admin: false
    },
    veterinarian: {
        dashboard: true,
        appointments: true,
        patients: true,
        clients: true,
        billing: 'read',
        inventory: 'read',
        reports: 'read',
        settings: false,
        users: false,
        global_admin: false
    },
    technician: {
        dashboard: true,
        appointments: 'read',
        patients: 'read',
        clients: 'read',
        billing: false,
        inventory: true,
        reports: false,
        settings: false,
        users: false,
        global_admin: false
    },
    receptionist: {
        dashboard: true,
        appointments: true,
        patients: false,
        clients: true,
        billing: true,
        inventory: false,
        reports: false,
        settings: false,
        users: false,
        global_admin: false
    },
    viewer: {
        dashboard: true,
        appointments: 'read',
        patients: 'read',
        clients: 'read',
        billing: 'read',
        inventory: 'read',
        reports: 'read',
        settings: false,
        users: false,
        global_admin: false
    }
};

// Auth state
const AuthState = {
    user: null,
    session: null,
    profile: null,
    role: null,
    organization: null,
    isLoading: true,
    isAuthenticated: false
};

// Initialize Supabase when the script loads
async function initSupabase() {
    // Check if Supabase library is loaded
    if (typeof window.supabase === 'undefined') {
        console.error('Supabase library not loaded. Make sure to include the Supabase CDN script.');
        return false;
    }

    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Check for existing session
    const { data: { session }, error } = await supabase.auth.getSession();

    if (session) {
        AuthState.session = session;
        AuthState.user = session.user;
        AuthState.isAuthenticated = true;
        await loadUserProfile();
    }

    AuthState.isLoading = false;

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event);

        if (event === 'SIGNED_IN' && session) {
            AuthState.session = session;
            AuthState.user = session.user;
            AuthState.isAuthenticated = true;
            await loadUserProfile();
        } else if (event === 'SIGNED_OUT') {
            AuthState.session = null;
            AuthState.user = null;
            AuthState.profile = null;
            AuthState.role = null;
            AuthState.organization = null;
            AuthState.isAuthenticated = false;
        }
    });

    return true;
}

// Load user profile and role from database
async function loadUserProfile() {
    if (!AuthState.user) return;

    try {
        // For now, we'll use a simple approach - check if user is the super admin
        // In production, this would query the user_profiles table
        const superAdminEmail = 'lmarotomar@biovetai.org';

        if (AuthState.user.email === superAdminEmail) {
            AuthState.role = ROLES.SUPER_ADMIN;
            AuthState.profile = {
                name: 'Luis Maroto',
                email: superAdminEmail,
                role: ROLES.SUPER_ADMIN
            };
        } else {
            // Default role for new users
            AuthState.role = ROLES.VIEWER;
            AuthState.profile = {
                name: AuthState.user.email?.split('@')[0] || 'Usuario',
                email: AuthState.user.email,
                role: ROLES.VIEWER
            };
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Authentication functions
const Auth = {
    // Sign up with email and password
    async signUp(email, password, metadata = {}) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;
        return data;
    },

    // Sign in with email and password
    async signIn(email, password) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        return data;
    },

    // Sign out
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        // Redirect to login
        window.location.href = 'auth/login.html';
    },

    // Reset password
    async resetPassword(email) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin + '/auth/reset-password.html'
        });

        if (error) throw error;
        return data;
    },

    // Check if user has permission for a module
    hasPermission(module) {
        if (!AuthState.role) return false;
        const perms = PERMISSIONS[AuthState.role];
        if (!perms) return false;
        return perms[module] === true || perms[module] === 'read';
    },

    // Check if user can edit (not just read)
    canEdit(module) {
        if (!AuthState.role) return false;
        const perms = PERMISSIONS[AuthState.role];
        if (!perms) return false;
        return perms[module] === true;
    },

    // Get current user
    getUser() {
        return AuthState.user;
    },

    // Get user profile
    getProfile() {
        return AuthState.profile;
    },

    // Get user role
    getRole() {
        return AuthState.role;
    },

    // Get role label
    getRoleLabel() {
        return ROLE_LABELS[AuthState.role] || 'Usuario';
    },

    // Check if authenticated
    isAuthenticated() {
        return AuthState.isAuthenticated;
    },

    // Check if loading
    isLoading() {
        return AuthState.isLoading;
    }
};

// Auth guard - protect pages that require authentication
async function requireAuth(redirectUrl = 'auth/login.html') {
    // Wait for auth to initialize
    await initSupabase();

    // Wait a moment for state to settle
    await new Promise(resolve => setTimeout(resolve, 100));

    if (!AuthState.isAuthenticated) {
        // Store the intended destination
        sessionStorage.setItem('returnUrl', window.location.href);
        window.location.href = redirectUrl;
        return false;
    }

    return true;
}

// Check if we're on a protected page
function isProtectedPage() {
    const publicPages = ['login.html', 'register.html', 'reset-password.html', 'pricing.html', 'legal.html'];
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    return !publicPages.includes(currentPage);
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Auth = Auth;
    window.AuthState = AuthState;
    window.ROLES = ROLES;
    window.ROLE_LABELS = ROLE_LABELS;
    window.PERMISSIONS = PERMISSIONS;
    window.initSupabase = initSupabase;
    window.requireAuth = requireAuth;
}
