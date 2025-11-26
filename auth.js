// auth.js

const STORAGE_KEY_USERS = "ghasiq_users";
const STORAGE_KEY_CURRENT = "ghasiq_current_user";

const Auth = {
    _loadUsers() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_USERS);
            if (!raw) return [];
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) return [];
            return parsed;
        } catch {
            return [];
        }
    },

    _saveUsers(users) {
        try {
            localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users || []));
        } catch {
            // ignore
        }
    },

    ensureDefaultUsers() {
        let users = this._loadUsers();
        if (!users || users.length === 0) {
            users = [
                // Admin
                { username: "admin", password: "admin123", role: "Admin" },

                // IT Head
                { username: "it.head", password: "123456", role: "IT Head" },

                // HR Head
                { username: "hr.head", password: "123456", role: "HR Head" },

                // Finance Head
                { username: "finance.head", password: "123456", role: "Finance Head" },

                // Operations
                { username: "ops.pm", password: "123456", role: "Operations Manager" },

                // General Manager
                { username: "gm", password: "123456", role: "General Manager" }
            ];
            this._saveUsers(users);
        }
    },

    getUsers() {
        return this._loadUsers();
    },

    getCurrentUser() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
            if (!raw) return null;
            return JSON.parse(raw);
        } catch {
            return null;
        }
    },

    login(username, password) {
        if (!username || !password) return null;

        const users = this._loadUsers();
        const user = users.find(
            u => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            return null; // اسم المستخدم مش موجود
        }

        if (user.password !== password) {
            return null; // باسورد غلط
        }

        const current = {
            username: user.username,
            role: user.role,
            login: true
        };

        try {
            localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(current));
        } catch {
            // ignore
        }

        return current;
    },

    logout() {
        localStorage.removeItem(STORAGE_KEY_CURRENT);
    },

    addUser(username, password, role) {
        const users = this._loadUsers();
        const exists = users.some(
            u => u.username.toLowerCase() === username.toLowerCase()
        );
        if (exists) return false;

        users.push({ username, password, role });
        this._saveUsers(users);
        return true;
    },

    deleteUser(username) {
        const users = this._loadUsers();
        const filtered = users.filter(
            u => u.username.toLowerCase() !== username.toLowerCase()
        );
        this._saveUsers(filtered);
    }
};

// تأكد إن الديفولت يوزرز موجودين
Auth.ensureDefaultUsers();

// نطلّع Auth على الـ window عشان نستخدمه من الصفحات
window.Auth = Auth;
