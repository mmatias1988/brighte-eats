/**
 * Simple authentication service (temporary solution)
 * TODO: Replace with proper JWT-based authentication when User schema is added
 */

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

/**
 * Check if the provided password matches the admin password
 */
export function checkAdminPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  return sessionStorage.getItem('adminAuthenticated') === 'true';
}

/**
 * Attempt to login with password
 * @returns true if login successful, false otherwise
 */
export function login(password: string): boolean {
  if (checkAdminPassword(password)) {
    sessionStorage.setItem('adminAuthenticated', 'true');
    return true;
  }
  return false;
}

/**
 * Logout the current admin user
 */
export function logout(): void {
  sessionStorage.removeItem('adminAuthenticated');
  // Redirect will be handled by the router
}
