import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface NegocioData {
  nombre: string;
  tipo: string;
  telefono: string;
  email: string;
  domicilio: string;
  sitioWeb: string;
  pais: string;
  provincia: string;
  ciudad: string;
  altura: string;
  situacionIva: string;
  razonSocial: string;
  condicionIva: string;
  cuit: string;
}

const MOCK_NEGOCIO: NegocioData = {
  nombre: 'The Sush Catering',
  tipo: 'Local de Sushi',
  telefono: '+1 2512 4425',
  email: 'thesush@gmail.com',
  domicilio: 'Av. Belgrano 1200 Rosario',
  sitioWeb: 'www.thesushcatering.com',
  pais: 'Argentina',
  provincia: 'Ciudad Federal',
  ciudad: 'Catamarca',
  altura: '177',
  situacionIva: 'Monotributista',
  razonSocial: 'Maxisistemas S.R.L',
  condicionIva: 'Responsable Inscripto',
  cuit: '32145573310',
};

@Component({
  selector: 'app-negocio',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <div class="page-header">
      <div class="page-header-left">
        <button class="back-btn" (click)="goBack()" title="Volver">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </button>
        <div class="page-header-info">
          <h1 class="page-title">Mi Negocio</h1>
          <p class="page-subtitle">Mantene la informacion de tu negocio actualizada</p>
        </div>
      </div>
    </div>

    <!-- Business Card -->
    <div class="business-card">
      <div class="business-card-actions">
        @if (editing()) {
          <button class="btn-secondary" (click)="cancelEdit()">Cancelar</button>
          <button class="btn-dark" (click)="saveEdit()">Guardar</button>
        } @else {
          <button class="btn-edit-card" (click)="startEdit()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="15" height="15">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>
            Editar informacion
          </button>
        }
      </div>
      <!-- Top row: logo + name + type -->
      <div class="business-top">
        <div class="business-logo">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="36" height="36">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z" />
          </svg>
        </div>
        <div class="business-field">
          <span class="field-label">Nombre</span>
          @if (editing()) {
            <input class="field-input" [ngModel]="draft().nombre" (ngModelChange)="updateDraft('nombre', \$event)" />
          } @else {
            <span class="field-value field-value--bold">{{ data().nombre }}</span>
          }
        </div>
        <div class="business-field">
          <span class="field-label">Tipo</span>
          @if (editing()) {
            <input class="field-input" [ngModel]="draft().tipo" (ngModelChange)="updateDraft('tipo', \$event)" />
          } @else {
            <span class="field-value">{{ data().tipo }}</span>
          }
        </div>
      </div>

      <!-- Separator -->
      <div class="card-separator"></div>

      <!-- Contact row -->
      <div class="contact-section">
        <h3 class="section-label">Datos de contacto</h3>
        <div class="contact-grid">
          <!-- Telefono -->
          <div class="contact-item">
            <div class="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
              </svg>
            </div>
            <div class="contact-info">
              <span class="field-label">Telefono</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().telefono" (ngModelChange)="updateDraft('telefono', \$event)" />
              } @else {
                <span class="field-value">{{ data().telefono }}</span>
              }
            </div>
          </div>

          <!-- Email -->
          <div class="contact-item">
            <div class="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <div class="contact-info">
              <span class="field-label">Email</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().email" (ngModelChange)="updateDraft('email', \$event)" />
              } @else {
                <span class="field-value">{{ data().email }}</span>
              }
            </div>
          </div>

          <!-- Domicilio -->
          <div class="contact-item">
            <div class="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div class="contact-info">
              <span class="field-label">Domicilio</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().domicilio" (ngModelChange)="updateDraft('domicilio', \$event)" />
              } @else {
                <span class="field-value">{{ data().domicilio }}</span>
              }
            </div>
          </div>

          <!-- Sitio Web -->
          <div class="contact-item">
            <div class="contact-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
              </svg>
            </div>
            <div class="contact-info">
              <span class="field-label">Sitio Web</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().sitioWeb" (ngModelChange)="updateDraft('sitioWeb', \$event)" />
              } @else {
                <span class="field-value">{{ data().sitioWeb }}</span>
              }
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row: Ubicacion + Datos tributarios -->
    <div class="bottom-grid">
      <!-- Ubicacion card -->
      <div class="info-card">
        <div class="info-card-header">
          <h3 class="info-card-title">Ubicacion</h3>
        </div>
        <div class="info-card-body">
          <div class="info-field-grid">
            <div class="info-field">
              <span class="field-label">Pais</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().pais" (ngModelChange)="updateDraft('pais', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().pais }}</span>
                </div>
              }
            </div>
            <div class="info-field">
              <span class="field-label">Provincia</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().provincia" (ngModelChange)="updateDraft('provincia', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().provincia }}</span>
                </div>
              }
            </div>
            <div class="info-field">
              <span class="field-label">Ciudad</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().ciudad" (ngModelChange)="updateDraft('ciudad', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().ciudad }}</span>
                </div>
              }
            </div>
            <div class="info-field">
              <span class="field-label">Altura</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().altura" (ngModelChange)="updateDraft('altura', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().altura }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Datos tributarios card -->
      <div class="info-card">
        <div class="info-card-header">
          <h3 class="info-card-title">Datos tributarios</h3>
        </div>
        <div class="info-card-body">
          <div class="info-field-grid">
            <div class="info-field">
              <span class="field-label">Situacion IVA</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().situacionIva" (ngModelChange)="updateDraft('situacionIva', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().situacionIva }}</span>
                </div>
              }
            </div>
            <div class="info-field">
              <span class="field-label">Razon social</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().razonSocial" (ngModelChange)="updateDraft('razonSocial', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().razonSocial }}</span>
                </div>
              }
            </div>
            <div class="info-field">
              <span class="field-label">Condicion de IVA</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().condicionIva" (ngModelChange)="updateDraft('condicionIva', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().condicionIva }}</span>
                </div>
              }
            </div>
            <div class="info-field">
              <span class="field-label">CUIT</span>
              @if (editing()) {
                <input class="field-input field-input--sm" [ngModel]="draft().cuit" (ngModelChange)="updateDraft('cuit', \$event)" />
              } @else {
                <div class="info-field-row">
                  <span class="field-value">{{ data().cuit }}</span>
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    /* ===== Header ===== */
    .page-header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 16px;
      margin-bottom: 28px;
      flex-wrap: wrap;
    }

    .page-header-left {
      display: flex;
      align-items: flex-start;
      gap: 16px;
    }

    .page-header-right {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      border: 1px solid var(--slate-200);
      background: white;
      color: var(--slate-700);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }
    .back-btn:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    .page-title {
      font-size: 26px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0 0 4px;
      letter-spacing: -0.01em;
    }
    .page-subtitle {
      font-size: 14px;
      color: var(--slate-500);
      margin: 0;
    }

    /* ===== Buttons ===== */
    .btn-primary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border: none;
      border-radius: var(--radius-sm);
      background: var(--primary-orange);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
      white-space: nowrap;
    }
    .btn-primary:hover {
      background: var(--primary-orange-hover);
    }

    .btn-dark {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border: none;
      border-radius: var(--radius-sm);
      background: var(--slate-900);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.15s ease;
      white-space: nowrap;
    }
    .btn-dark:hover {
      background: var(--slate-800);
    }

    .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-sm);
      background: white;
      color: var(--slate-700);
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .btn-secondary:hover {
      background: var(--slate-50);
      border-color: var(--slate-300);
    }

    /* ===== Business Card ===== */
    .business-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      padding: 28px;
      margin-bottom: 20px;
      box-shadow: var(--shadow-sm);
      position: relative;
    }

    .business-card-actions {
      position: absolute;
      top: 20px;
      right: 24px;
      display: flex;
      gap: 10px;
    }

    .btn-edit-card {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-sm);
      background: white;
      color: var(--primary-orange);
      font-size: 13px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .btn-edit-card:hover {
      background: var(--primary-orange-light);
      border-color: var(--primary-orange);
    }

    .business-top {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .business-logo {
      width: 80px;
      height: 80px;
      border-radius: var(--radius-lg);
      background: var(--primary-orange-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-orange);
      flex-shrink: 0;
    }

    .business-field {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .card-separator {
      height: 1px;
      background: var(--slate-100);
      margin: 24px 0;
    }

    /* ===== Contact Section ===== */
    .section-label {
      font-size: 14px;
      font-weight: 600;
      color: var(--slate-700);
      margin: 0 0 16px;
    }

    .contact-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }

    .contact-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
    }

    .contact-icon {
      width: 40px;
      height: 40px;
      border-radius: var(--radius-md);
      background: var(--primary-orange-light);
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary-orange);
      flex-shrink: 0;
    }

    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
      flex: 1;
    }

    /* ===== Field styles ===== */
    .field-label {
      font-size: 11px;
      font-weight: 600;
      color: var(--slate-400);
      text-transform: uppercase;
      letter-spacing: 0.03em;
    }

    .field-value {
      font-size: 14px;
      color: var(--slate-900);
      font-weight: 500;
    }
    .field-value--bold {
      font-weight: 700;
      font-size: 16px;
    }

    .field-input {
      padding: 8px 12px;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-md);
      font-size: 14px;
      color: var(--slate-700);
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
      width: 100%;
      box-sizing: border-box;
    }
    .field-input:focus {
      border-color: var(--primary-orange);
      box-shadow: 0 0 0 3px rgba(242, 121, 32, 0.1);
    }
    .field-input--sm {
      padding: 6px 10px;
      font-size: 13px;
    }

    /* ===== Bottom Grid ===== */
    .bottom-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .info-card {
      background: white;
      border: 1px solid var(--slate-200);
      border-radius: var(--radius-lg);
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }

    .info-card-header {
      padding: 20px 24px 0;
    }

    .info-card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--slate-900);
      margin: 0;
    }

    .info-card-body {
      padding: 16px 24px 24px;
    }

    .info-field-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    .info-field {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .info-field-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    /* ===== Responsive ===== */
    @media (max-width: 1024px) {
      .contact-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 768px) {
      .page-header {
        flex-direction: column;
      }
      .page-header-right {
        width: 100%;
        justify-content: flex-end;
      }
      .page-title {
        font-size: 22px;
      }
      .business-top {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .contact-grid {
        grid-template-columns: 1fr;
      }
      .bottom-grid {
        grid-template-columns: 1fr;
      }
      .info-field-grid {
        grid-template-columns: 1fr;
      }
    }
  `],
})
export class NegocioComponent {
  private readonly router = inject(Router);

  readonly editing = signal(false);
  readonly data = signal<NegocioData>({ ...MOCK_NEGOCIO });
  readonly draft = signal<NegocioData>({ ...MOCK_NEGOCIO });

  goBack(): void {
    this.router.navigate(['/mi-cuenta']);
  }

  startEdit(): void {
    this.draft.set({ ...this.data() });
    this.editing.set(true);
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  saveEdit(): void {
    this.data.set({ ...this.draft() });
    this.editing.set(false);
  }

  updateDraft(field: keyof NegocioData, value: string): void {
    this.draft.update(current => ({ ...current, [field]: value }));
  }
}
