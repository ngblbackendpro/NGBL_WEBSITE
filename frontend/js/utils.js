/**
 * NGBL Website - Shared Utilities & Helpers
 * Common functions used across multiple modules
 */

/**
 * Utility: Check DOM Ready State
 */
const DOM = {
    isReady() {
        return document.readyState !== 'loading';
    },

    onReady(callback) {
        if (this.isReady()) {
            callback();
        } else {
            document.addEventListener('DOMContentLoaded', callback);
        }
    },

    onLoad(callback) {
        if (document.readyState === 'complete') {
            callback();
        } else {
            window.addEventListener('load', callback);
        }
    }
};

/**
 * Utility: Element Utilities
 */
const Elements = {
    query(selector) {
        return document.querySelector(selector);
    },

    queryAll(selector) {
        return Array.from(document.querySelectorAll(selector));
    },

    queryParent(element, selector) {
        return element.closest(selector);
    },

    addClass(element, className) {
        element ?.classList.add(className);
    },

    removeClass(element, className) {
        element ?.classList.remove(className);
    },

    toggleClass(element, className, force) {
        element ?.classList.toggle(className, force);
    },

    hasClass(element, className) {
        return element ?.classList.contains(className);
    },

    setAttribute(element, attr, value) {
        element ?.setAttribute(attr, value);
    },

    getAttribute(element, attr) {
        return element ?.getAttribute(attr);
    }
};

/**
 * Utility: Form Validation
 */
const FormValidator = {
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    validatePhone(phone) {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    },

    validateRequired(value) {
        return value && value.trim().length > 0;
    },

    validateMinLength(value, length) {
        return value && value.length >= length;
    }
};

/**
 * Utility: Storage Management
 */
const StorageManager = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            return false;
        }
    },

    get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (e) {
            return null;
        }
    },

    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    clear() {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            return false;
        }
    }
};

/**
 * Utility: API Requests (with error handling)
 */
const API = {
    async request(url, options = {}) {
        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            return null;
        }
    },

    get(url) {
        return this.request(url, { method: 'GET' });
    },

    post(url, data) {
        return this.request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    put(url, data) {
        return this.request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    delete(url) {
        return this.request(url, { method: 'DELETE' });
    }
};

/**
 * Utility: Accessibility Helpers
 */
const A11y = {
    announce(message, priority = 'polite') {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', priority);
        announcement.className = 'sr-only';
        announcement.textContent = message;
        document.body.appendChild(announcement);

        setTimeout(() => announcement.remove(), 1000);
    },

    setAriaLabel(element, label) {
        element ?.setAttribute('aria-label', label);
    },

    setAriaHidden(element, hidden) {
        element ?.setAttribute('aria-hidden', hidden ? 'true' : 'false');
    },

    prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
};

/**
 * Utility: Debug Logging (Disabled for Production)
 */
const Logger = {
    debug(message, data = null) {
        // Debug logging disabled in production
    },

    info(message, data = null) {
        // Info logging disabled in production
    },

    warn(message, data = null) {
        // Warning logging disabled in production
    },

    error(message, data = null) {
        // Error logging disabled in production
    }
};

// Export utilities (for ES6 module usage)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { DOM, Elements, FormValidator, StorageManager, API, A11y, Logger };
}