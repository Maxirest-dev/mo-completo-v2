import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  computed,
} from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alta-arca',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Header -->
    <div class="arca-header">
      <button class="back-btn" (click)="goBack()" title="Volver">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="20" height="20">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
        </svg>
      </button>
      <div>
        <h1 class="text-title">Alta en ARCA</h1>
        <p class="text-subtitle">Configurar facturacion electronica con ARCA (ex AFIP)</p>
      </div>
    </div>

    <!-- Stepper -->
    <div class="stepper">
      @for (step of steps; track step.number; let i = $index) {
        <div class="step" [class.step-active]="currentStep() === step.number" [class.step-completed]="currentStep() > step.number">
          <div class="step-circle">
            @if (currentStep() > step.number) {
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" width="16" height="16">
                <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            } @else {
              {{ step.number }}
            }
          </div>
          <span class="step-label">Paso {{ step.number }}</span>
        </div>
        @if (i < steps.length - 1) {
          <div class="step-line" [class.step-line-active]="currentStep() > step.number"></div>
        }
      }
    </div>

    <!-- Step Content -->
    <div class="step-content">
      <!-- Paso 1 -->
      @if (currentStep() === 1) {
        <div class="content-card">
          <h3 class="content-title">Emparejamiento y primer alta en ARCA</h3>
          <p class="content-description">Ingrese los datos de configuracion inicial para conectarse con ARCA</p>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="nro">NRO</label>
              <input
                id="nro"
                class="form-input"
                type="text"
                [ngModel]="nro()"
                (ngModelChange)="nro.set($event)"
                placeholder="Ingrese el numero"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="instancia">Instancia</label>
              <input
                id="instancia"
                class="form-input"
                type="text"
                [ngModel]="instancia()"
                (ngModelChange)="instancia.set($event)"
                placeholder="Ingrese la instancia"
              />
            </div>
          </div>

          <div class="form-actions">
            <button
              class="btn btn-primary"
              [disabled]="!isStep1Valid()"
              (click)="currentStep.set(2)"
            >
              Siguiente
            </button>
          </div>
        </div>
      }

      <!-- Paso 2 -->
      @if (currentStep() === 2) {
        <div class="content-card">
          <h3 class="content-title">Facturacion Electronica</h3>
          <p class="content-description">Complete los datos fiscales para habilitar la emision de comprobantes</p>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="condicionIva">Condicion IVA</label>
              <select
                id="condicionIva"
                class="form-select"
                [ngModel]="condicionIva()"
                (ngModelChange)="condicionIva.set($event)"
              >
                <option value="">Seleccione...</option>
                <option value="Responsable Inscripto">Responsable Inscripto</option>
                <option value="Monotributista">Monotributista</option>
                <option value="Exento">Exento</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="razonSocial">Razon Social</label>
              <input
                id="razonSocial"
                class="form-input"
                type="text"
                [ngModel]="razonSocial()"
                (ngModelChange)="razonSocial.set($event)"
                placeholder="Ingrese la razon social"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="fechaAlta">Fecha alta</label>
              <input
                id="fechaAlta"
                class="form-input"
                type="date"
                [ngModel]="fechaAlta()"
                (ngModelChange)="fechaAlta.set($event)"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                id="email"
                class="form-input"
                type="email"
                [ngModel]="email()"
                (ngModelChange)="email.set($event)"
                placeholder="correo@empresa.com"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label" for="celular">Celular</label>
              <input
                id="celular"
                class="form-input"
                type="tel"
                [ngModel]="celular()"
                (ngModelChange)="celular.set($event)"
                placeholder="+54 11 5555-1234"
              />
            </div>
            <div class="form-group">
              <label class="form-label" for="certificado">Certificado</label>
              <div class="file-input-wrapper">
                <input
                  id="certificado"
                  type="file"
                  class="file-input-hidden"
                  (change)="onFileChange($event)"
                  accept=".pem,.crt,.cer"
                />
                <label for="certificado" class="file-input-label">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                  </svg>
                  {{ certificadoNombre() || 'Seleccionar archivo...' }}
                </label>
              </div>
            </div>
          </div>

          <!-- Warning Banner -->
          <div class="warning-banner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
            </svg>
            <div class="warning-text">
              <strong>Importante:</strong> Asegurese de que el certificado digital este vigente y sea el proporcionado por ARCA para su CUIT.
            </div>
          </div>

          <div class="form-actions">
            <button class="btn btn-secondary" (click)="currentStep.set(1)">Volver</button>
            <button
              class="btn btn-primary"
              [disabled]="!isStep2Valid()"
              (click)="currentStep.set(3)"
            >
              Aceptar Datos
            </button>
          </div>
        </div>
      }

      <!-- Paso 3 -->
      @if (currentStep() === 3) {
        <div class="content-card text-center">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="48" height="48">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 class="success-title">Facturacion electronica configurada</h3>
          <p class="success-description">
            La integracion con ARCA fue configurada exitosamente. Ya puede emitir comprobantes electronicos.
          </p>

          <div class="form-actions form-actions-center">
            <button class="btn btn-secondary" (click)="goBack()">Volver al listado</button>
            <button class="btn btn-primary" (click)="goHome()">Volver al inicio</button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    .arca-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 32px;
    }

    .back-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border: 1px solid var(--border-color);
      border-radius: 10px;
      background: white;
      color: var(--gray-600);
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .back-btn:hover {
      background: var(--gray-50);
      border-color: var(--gray-300);
    }

    /* Stepper */
    .stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 32px;
      padding: 0 40px;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex-shrink: 0;
    }

    .step-circle {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      background: var(--gray-200);
      color: var(--gray-500);
      transition: all 0.2s ease;
    }

    .step-active .step-circle {
      background: var(--primary-orange);
      color: white;
    }

    .step-completed .step-circle {
      background: var(--success-color);
      color: white;
    }

    .step-label {
      font-size: 12px;
      font-weight: 500;
      color: var(--gray-400);
    }

    .step-active .step-label {
      color: var(--primary-orange);
      font-weight: 600;
    }

    .step-completed .step-label {
      color: var(--success-color);
    }

    .step-line {
      flex: 1;
      height: 2px;
      background: var(--gray-200);
      margin: 0 8px;
      margin-bottom: 24px;
      min-width: 60px;
    }

    .step-line-active {
      background: var(--success-color);
    }

    /* Content */
    .content-card {
      background: white;
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 32px;
      max-width: 720px;
      margin: 0 auto;
    }

    .content-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 8px 0;
    }

    .content-description {
      font-size: 14px;
      color: var(--gray-500);
      margin: 0 0 24px 0;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 28px;
      padding-top: 20px;
      border-top: 1px solid var(--gray-100);
    }

    .form-actions-center {
      justify-content: center;
    }

    /* File input */
    .file-input-wrapper {
      position: relative;
    }

    .file-input-hidden {
      position: absolute;
      width: 0;
      height: 0;
      opacity: 0;
      overflow: hidden;
    }

    .file-input-label {
      display: flex;
      align-items: center;
      gap: 8px;
      width: 100%;
      padding: 10px 12px;
      font-size: 14px;
      border: 1px dashed var(--border-color);
      border-radius: 8px;
      color: var(--gray-500);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .file-input-label:hover {
      border-color: var(--primary-orange);
      background: var(--primary-orange-light);
    }

    /* Warning */
    .warning-banner {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      padding: 16px;
      background: var(--primary-orange-lighter);
      border: 1px solid var(--primary-orange);
      border-radius: 10px;
      margin-top: 20px;
      color: var(--primary-orange-hover);
    }

    .warning-banner svg {
      flex-shrink: 0;
      margin-top: 1px;
    }

    .warning-text {
      font-size: 13px;
      line-height: 1.5;
      color: #92400E;
    }

    /* Success */
    .text-center {
      text-align: center;
    }

    .success-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: var(--success-bg);
      color: var(--success-color);
      margin-bottom: 20px;
    }

    .success-title {
      font-size: 22px;
      font-weight: 600;
      color: var(--gray-900);
      margin: 0 0 8px 0;
    }

    .success-description {
      font-size: 14px;
      color: var(--gray-500);
      margin: 0;
      max-width: 400px;
      margin-left: auto;
      margin-right: auto;
    }

    @media (max-width: 768px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .stepper {
        padding: 0;
      }

      .step-line {
        min-width: 30px;
      }

      .content-card {
        padding: 20px;
      }
    }
  `],
})
export class AltaArcaComponent {
  private readonly router = inject(Router);

  currentStep = signal<1 | 2 | 3>(1);

  // Step 1
  nro = signal('');
  instancia = signal('');

  // Step 2
  condicionIva = signal('');
  razonSocial = signal('');
  fechaAlta = signal('');
  email = signal('');
  celular = signal('');
  certificadoNombre = signal('');

  steps = [
    { number: 1 as const },
    { number: 2 as const },
    { number: 3 as const },
  ];

  isStep1Valid = computed(() =>
    this.nro().trim().length > 0 && this.instancia().trim().length > 0
  );

  isStep2Valid = computed(() =>
    this.condicionIva().trim().length > 0 &&
    this.razonSocial().trim().length > 0 &&
    this.email().trim().length > 0
  );

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.certificadoNombre.set(input.files[0].name);
    }
  }

  goBack(): void {
    this.router.navigate(['/pdv']);
  }

  goHome(): void {
    this.router.navigate(['/pdv']);
  }
}
