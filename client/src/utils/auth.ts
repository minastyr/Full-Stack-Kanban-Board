import { JwtPayload, jwtDecode } from 'jwt-decode';

class AuthService {
  getProfile() {
      const token = this.getToken();
      if (!token) return null;
  
      try {
        return jwtDecode<JwtPayload>(token);
      } catch (error) {
        console.error('Invalid token:', error);
        return null;
      }
    }

  loggedIn() {
    const token = this.getToken();
    return token && !this.isTokenExpired(token);
  }
  
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (!decoded || typeof decoded.exp !== 'number') {
        return true; // If no expiration is found, assume expired
      }
      const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
      return decoded.exp < currentTime;
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Assume expired if decoding fails
    }
  }

  getToken(): string {
    const loggedUser = localStorage.getItem('id_token') || '';
    return loggedUser;
  }

  login(idToken: string) {
    localStorage.setItem('id_token', idToken);
    window.location.assign('/');
  }

  logout() {
    localStorage.removeItem('id_token');
    window.location.assign('/');
  }
}

export default new AuthService();
