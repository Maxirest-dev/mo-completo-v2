import { Injectable, signal } from '@angular/core';

export interface MockUser {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  tenantId: string;
}

/**
 * Mock authentication service.
 * Provides a fake authenticated user for development.
 * Replace with real OAuth2/JWT flow when integrating backend.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {

  readonly isAuthenticated = signal(true);

  readonly currentUser = signal<MockUser>({
    id: 'f0e1d2c3-b4a5-6789-0abc-def123456789',
    nombre: 'Carlos Méndez',
    email: 'carlos.mendez@restaurante.com',
    rol: 'GERENTE',
    tenantId: 'tenant-restaurante-1'
  });

  getToken(): string {
    return 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmMGUxZDJjMy1iNGE1LTY3ODktMGFiYy1kZWYxMjM0NTY3ODkiLCJ0ZW5hbnQiOiJ0ZW5hbnQtcmVzdGF1cmFudGUtMSIsInJvbCI6IkdFUkVOVEUiLCJpYXQiOjE3MTE4NDQ4MDAsImV4cCI6MTcxMTkzMTIwMH0.mock-signature';
  }
}
