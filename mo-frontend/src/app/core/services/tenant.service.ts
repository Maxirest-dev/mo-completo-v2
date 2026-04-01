import { Injectable, signal } from '@angular/core';

/**
 * Mock tenant context service.
 * Holds the current tenant identifier for multi-tenant operations.
 * Replace with real tenant resolution (subdomain, JWT claim, etc.) when integrating backend.
 */
@Injectable({ providedIn: 'root' })
export class TenantService {

  readonly currentTenantId = signal('tenant-restaurante-1');

  getTenantId(): string {
    return this.currentTenantId();
  }
}
