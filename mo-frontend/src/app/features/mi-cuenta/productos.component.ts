import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductoCardComponent } from './marketplaces/components/catalogo/producto-card.component';
import { SolucionCardComponent } from './marketplaces/components/catalogo/solucion-card.component';
import { WizardContainerComponent } from './marketplaces/components/wizard/wizard-container.component';
import { MarketplacesFacade } from './marketplaces/state/marketplaces.facade';
import { Solucion } from './marketplaces/models/marketplaces.models';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ProductoCardComponent, SolucionCardComponent, WizardContainerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="productos-page">
      <!-- Header -->
      <div class="page-header">
        <div class="title-section">
          <h1 class="page-title">Tienda</h1>
          <p class="page-subtitle">Contrata integraciones y productos para potenciar tu restaurante</p>
        </div>
      </div>

      @if (facade.loading()) {
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando catálogo...</p>
        </div>
      } @else {
        <div class="catalogo-grid">
          @for (producto of facade.productosHardware(); track producto.id) {
            <app-producto-card
              class="catalogo-item catalogo-item--destacado"
              [producto]="producto"
              (conocerMas)="onConocerMasProducto($event)" />
          }
          @for (solucion of facade.soluciones(); track solucion.id) {
            <app-solucion-card
              class="catalogo-item"
              [solucion]="solucion"
              (conocerMas)="onConocerMasSolucion($event)" />
          }
        </div>
      }

      <!-- Wizard Overlay -->
      @if (facade.wizardAbierto()) {
        <app-wizard-container />
      }
    </div>
  `,
  styles: [`
    .productos-page { }

    /* Header */
    .page-header {
      display: flex;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 32px;
    }

    .page-title {
      font-size: 26px;
      font-weight: 700;
      color: var(--slate-900, #0F172B);
      margin: 0 0 4px;
    }

    .page-subtitle {
      font-size: 14px;
      color: var(--slate-500, #64748B);
      margin: 0;
    }

    /* Sections */
    /* Grid unificado — todas las cards con el mismo ancho */
    .catalogo-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      align-items: stretch;
    }
    .catalogo-item { display: flex; }

    @media (max-width: 1200px) {
      .catalogo-grid { grid-template-columns: repeat(3, 1fr); }
    }
    @media (max-width: 900px) {
      .catalogo-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 600px) {
      .catalogo-grid { grid-template-columns: 1fr; }
    }

    /* Producto Card (hardware - colored) */
    :host ::ng-deep .producto-card {
      border-radius: 12px;
      padding: 24px;
      color: white;
      display: flex;
      flex-direction: column;
      position: relative;
      overflow: hidden;
      width: 100%;
    }

    :host ::ng-deep .producto-card__label {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.85;
      margin-bottom: 4px;
    }

    :host ::ng-deep .producto-card__nombre {
      font-size: 28px;
      font-weight: 800;
      margin: 0 0 4px 0;
    }

    :host ::ng-deep .producto-card__subtitulo {
      font-size: 14px;
      opacity: 0.85;
      margin-bottom: 0;
    }

    :host ::ng-deep .producto-card__features {
      list-style: none;
      padding: 0;
      margin: 0 0 auto 0;
    }

    :host ::ng-deep .producto-card__features li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      padding: 4px 0;
      opacity: 0.9;
    }

    :host ::ng-deep .feature-check {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      flex-shrink: 0;
    }

    :host ::ng-deep .producto-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid rgba(255, 255, 255, 0.2);
    }

    :host ::ng-deep .precio-valor {
      font-size: 24px;
      font-weight: 700;
    }

    :host ::ng-deep .precio-periodo {
      font-size: 12px;
      opacity: 0.75;
    }

    :host ::ng-deep .precio-iva {
      font-size: 11px;
      opacity: 0.6;
      display: block;
    }

    :host ::ng-deep .btn-conocer-mas {
      padding: 10px 20px;
      border-radius: 8px;
      border: 2px solid rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.15);
      color: white;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
    }

    :host ::ng-deep .btn-conocer-mas:hover {
      background: rgba(255, 255, 255, 0.25);
      border-color: rgba(255, 255, 255, 0.8);
    }

    /* Solucion Card (white) */
    :host ::ng-deep .solucion-card {
      background: white;
      border: 1px solid var(--slate-200, #E5E7EB);
      border-radius: 12px;
      padding: 20px;
      display: flex;
      flex-direction: column;
      transition: all 0.15s ease;
      width: 100%;
    }

    :host ::ng-deep .solucion-card:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      border-color: var(--slate-300, #CBD5E1);
    }

    :host ::ng-deep .solucion-card__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    :host ::ng-deep .solucion-icon {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      flex-shrink: 0;
    }

    :host ::ng-deep .solucion-card__nombre {
      font-size: 15px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0 0 4px;
    }

    :host ::ng-deep .solucion-card__descripcion {
      font-size: 13px;
      color: var(--slate-500, #64748B);
      line-height: 1.5;
      margin-bottom: auto;
      flex: 1;
    }

    :host ::ng-deep .solucion-card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid var(--slate-100, #F1F5F9);
    }

    :host ::ng-deep .solucion-precio {
      font-size: 15px;
      font-weight: 700;
      color: var(--slate-900, #0F172B);
    }

    :host ::ng-deep .solucion-precio .precio-periodo {
      font-size: 12px;
      font-weight: 400;
      color: var(--slate-500, #64748B);
      opacity: 1;
    }

    :host ::ng-deep .btn-solucion {
      padding: 8px 16px;
      border-radius: 8px;
      border: 1px solid var(--slate-200, #E5E7EB);
      background: white;
      color: var(--slate-700, #314158);
      font-size: 12px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: 'Inter', sans-serif;
    }

    :host ::ng-deep .btn-solucion:hover {
      background: var(--slate-50, #F8FAFC);
      border-color: var(--slate-300, #CBD5E1);
    }

    :host ::ng-deep .btn-solucion--primary {
      background: #7C3AED;
      color: white;
      border-color: #7C3AED;
    }

    :host ::ng-deep .btn-solucion--primary:hover {
      background: #6D28D9;
      border-color: #6D28D9;
    }

    /* Badge estado */
    :host ::ng-deep .badge-estado {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 500;
    }

    :host ::ng-deep .badge-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
    }

    :host ::ng-deep .badge-estado--activo {
      background: #DCFCE7;
      color: #166534;
    }

    :host ::ng-deep .badge-estado--activo .badge-dot { background: #16A34A; }

    :host ::ng-deep .badge-estado--disponible {
      background: #DBEAFE;
      color: #1E40AF;
    }

    :host ::ng-deep .badge-estado--disponible .badge-dot { background: #3B82F6; }

    :host ::ng-deep .badge-estado--inactivo {
      background: var(--slate-100, #F1F5F9);
      color: var(--slate-500, #64748B);
    }

    :host ::ng-deep .badge-estado--inactivo .badge-dot { background: var(--slate-400, #94A3B8); }

    /* Wizard */
    :host ::ng-deep .wizard-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 24px;
      animation: fadeIn 0.2s ease;
    }

    :host ::ng-deep .wizard-modal {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 640px;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      animation: slideUp 0.25s ease;
    }
    :host ::ng-deep .wizard-modal--compact { max-width: 440px; }

    :host ::ng-deep .wizard-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid var(--slate-200, #E5E7EB);
      flex-shrink: 0;
    }

    :host ::ng-deep .wizard-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--slate-900, #0F172B);
      margin: 0;
    }

    :host ::ng-deep .wizard-close {
      background: none;
      border: none;
      color: var(--slate-400, #94A3B8);
      cursor: pointer;
      padding: 4px;
      font-size: 18px;
      transition: color 0.15s;
    }

    :host ::ng-deep .wizard-close:hover {
      color: var(--slate-600, #475569);
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    /* Wizard body/footer */
    :host ::ng-deep .wizard-body { padding: 24px; overflow-y: auto; flex: 1; }
    :host ::ng-deep .wizard-footer {
      display: flex; align-items: center; justify-content: flex-end;
      gap: 12px; padding: 16px 24px; border-top: 1px solid #E5E7EB; flex-shrink: 0;
    }

    /* Progress bar */
    :host ::ng-deep .wizard-progress { display: flex; align-items: center; gap: 8px; margin-bottom: 24px; }
    :host ::ng-deep .progress-step { flex: 1; height: 4px; border-radius: 2px; background: #E5E7EB; transition: background 0.3s ease; }
    :host ::ng-deep .progress-step--active, :host ::ng-deep .progress-step--completed { background: #7C3AED; }

    /* Paso 1 - Contratacion */
    :host ::ng-deep .contratacion-logo {
      width: 64px; height: 64px; border-radius: 12px; display: flex;
      align-items: center; justify-content: center; margin-bottom: 16px; font-size: 28px; font-weight: 800;
    }
    :host ::ng-deep .contratacion-nombre { font-size: 22px; font-weight: 700; color: #0F172B; margin: 0 0 8px; }
    :host ::ng-deep .contratacion-descripcion { font-size: 14px; color: #64748B; line-height: 1.6; margin-bottom: 24px; }
    :host ::ng-deep .contratacion-features { list-style: none; padding: 0; margin: 0 0 24px; }
    :host ::ng-deep .contratacion-features li { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 14px; color: #374151; }
    :host ::ng-deep .feature-icon {
      width: 22px; height: 22px; border-radius: 50%; background: #DCFCE7; color: #16A34A;
      display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0;
    }
    :host ::ng-deep .contratacion-precio-box {
      background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 12px; padding: 20px;
      display: flex; align-items: center; justify-content: space-between;
    }
    :host ::ng-deep .precio-label { font-size: 12px; color: #64748B; margin-bottom: 4px; }
    :host ::ng-deep .contratacion-precio-box .precio-valor { font-size: 28px; font-weight: 700; color: #0F172B; }
    :host ::ng-deep .contratacion-precio-box .precio-periodo { font-size: 14px; font-weight: 400; color: #64748B; }
    :host ::ng-deep .contratacion-precio-box .precio-iva { font-size: 12px; color: #94A3B8; display: block; margin-top: 2px; }

    /* Paso 2 - Configuracion */
    :host ::ng-deep .config-section { margin-bottom: 24px; }
    :host ::ng-deep .config-label { display: block; font-size: 14px; font-weight: 600; color: #0F172B; margin-bottom: 8px; }
    :host ::ng-deep .config-sublabel { font-size: 13px; color: #64748B; margin-bottom: 12px; }
    :host ::ng-deep .config-select {
      width: 100%; padding: 10px 40px 10px 14px; border: 1px solid #E5E7EB; border-radius: 8px;
      font-size: 14px; font-family: inherit; color: #374151; background: white; cursor: pointer;
      appearance: none; -webkit-appearance: none; -moz-appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2'%3e%3cpath d='m6 9 6 6 6-6'/%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 14px center;
    }
    :host ::ng-deep .config-select:focus { outline: none; border-color: #7C3AED; box-shadow: 0 0 0 3px rgba(124,58,237,0.1); }
    :host ::ng-deep .radio-cards { display: flex; flex-direction: column; gap: 10px; }
    :host ::ng-deep .radio-card {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
      border: 2px solid #E5E7EB; border-radius: 8px; cursor: pointer; transition: all 0.15s ease;
    }
    :host ::ng-deep .radio-card:hover { border-color: #D1D5DB; background: #F8FAFC; }
    :host ::ng-deep .radio-card--selected { border-color: #7C3AED; background: #F5F3FF; }
    :host ::ng-deep .radio-card--selected:hover { border-color: #7C3AED; background: #F5F3FF; }
    :host ::ng-deep .radio-indicator {
      width: 20px; height: 20px; border-radius: 50%; border: 2px solid #D1D5DB;
      display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 1px;
    }
    :host ::ng-deep .radio-indicator::after { content: ''; width: 10px; height: 10px; border-radius: 50%; background: transparent; transition: all 0.15s; }
    :host ::ng-deep .radio-card--selected .radio-indicator { border-color: #7C3AED; }
    :host ::ng-deep .radio-card--selected .radio-indicator::after { background: #7C3AED; }
    :host ::ng-deep .radio-content { flex: 1; }
    :host ::ng-deep .radio-title { font-size: 14px; font-weight: 600; color: #0F172B; margin-bottom: 2px; display: flex; align-items: center; gap: 8px; }
    :host ::ng-deep .radio-description { font-size: 13px; color: #64748B; line-height: 1.4; }
    :host ::ng-deep .radio-meta { font-size: 12px; color: #94A3B8; margin-top: 4px; }
    :host ::ng-deep .badge-recomendado { background: #EDE9FE; color: #5B21B6; padding: 2px 8px; border-radius: 9999px; font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    :host ::ng-deep .warning-card {
      display: flex; align-items: flex-start; gap: 12px; padding: 14px 16px;
      background: #FFFBEB; border: 1px solid #FDE68A; border-radius: 8px; margin-top: 16px;
    }
    :host ::ng-deep .warning-icon { color: #D97706; font-size: 18px; flex-shrink: 0; }
    :host ::ng-deep .warning-title { font-size: 13px; font-weight: 600; color: #92400E; margin-bottom: 2px; }
    :host ::ng-deep .warning-text { font-size: 12px; color: #A16207; line-height: 1.4; }

    /* Paso 3 - Confirmacion */
    :host ::ng-deep .confirmacion-section {
      margin-bottom: 20px; background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px;
    }
    :host ::ng-deep .confirmacion-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
    :host ::ng-deep .confirmacion-label { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #64748B; }
    :host ::ng-deep .btn-editar { background: none; border: none; color: #7C3AED; font-size: 12px; font-weight: 600; cursor: pointer; font-family: inherit; }
    :host ::ng-deep .btn-editar:hover { color: #6D28D9; text-decoration: underline; }
    :host ::ng-deep .confirmacion-valor { font-size: 15px; font-weight: 600; color: #0F172B; }
    :host ::ng-deep .confirmacion-detalle { font-size: 13px; color: #64748B; margin-top: 2px; }
    :host ::ng-deep .facturacion-box { background: white; border: 1px solid #E5E7EB; border-radius: 8px; padding: 16px; margin-bottom: 20px; }
    :host ::ng-deep .facturacion-title { font-size: 14px; font-weight: 600; color: #0F172B; margin-bottom: 12px; }
    :host ::ng-deep .facturacion-row { display: flex; justify-content: space-between; padding: 6px 0; }
    :host ::ng-deep .facturacion-label { font-size: 13px; color: #64748B; }
    :host ::ng-deep .facturacion-valor { font-size: 13px; font-weight: 600; color: #0F172B; }
    :host ::ng-deep .terminos-check {
      display: flex; align-items: flex-start; gap: 10px; padding: 14px;
      background: #F8FAFC; border: 1px solid #E5E7EB; border-radius: 8px;
    }
    :host ::ng-deep .terminos-check input[type="checkbox"] { width: 18px; height: 18px; margin-top: 1px; accent-color: #7C3AED; cursor: pointer; flex-shrink: 0; }
    :host ::ng-deep .terminos-check label { font-size: 13px; color: #374151; line-height: 1.5; cursor: pointer; }
    :host ::ng-deep .terminos-check label a { color: #7C3AED; text-decoration: underline; }

    /* Activando */
    :host ::ng-deep .activando-container { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 64px 32px; text-align: center; }
    :host ::ng-deep .activando-spinner { width: 56px; height: 56px; border: 4px solid #E5E7EB; border-top-color: #7C3AED; border-radius: 50%; animation: spin 0.8s linear infinite; margin-bottom: 24px; }
    :host ::ng-deep .activando-titulo { font-size: 18px; font-weight: 600; color: #0F172B; margin: 0 0 8px; }
    :host ::ng-deep .activando-subtitulo { font-size: 14px; color: #64748B; }

    /* Exito */
    :host ::ng-deep .exito-container { display: flex; flex-direction: column; align-items: center; padding: 32px 24px; text-align: center; }
    :host ::ng-deep .exito-check { width: 56px; height: 56px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 18px; animation: scaleIn 0.3s ease; }
    @keyframes scaleIn { from { transform: scale(0); } to { transform: scale(1); } }
    :host ::ng-deep .exito-titulo { font-size: 20px; font-weight: 700; color: #0F172B; margin: 0 0 6px; }
    :host ::ng-deep .exito-subtitulo { font-size: 13px; color: #64748B; margin-bottom: 22px; line-height: 1.55; }
    :host ::ng-deep .exito-checks { list-style: none; padding: 0; margin: 0 0 32px; width: 100%; max-width: 360px; }
    :host ::ng-deep .exito-checks li { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 10px 0; font-size: 14px; color: #374151; border-bottom: 1px solid #F1F5F9; }
    :host ::ng-deep .exito-checks li:last-child { border-bottom: none; }
    :host ::ng-deep .check-icon { width: 22px; height: 22px; border-radius: 50%; background: #DCFCE7; color: #16A34A; display: flex; align-items: center; justify-content: center; font-size: 12px; flex-shrink: 0; }
    :host ::ng-deep .exito-actions { display: flex; gap: 12px; margin-top: 24px; }

    /* Common buttons */
    :host ::ng-deep .btn-ghost {
      padding: 10px 20px; border-radius: 8px; border: 1px solid #E5E7EB; background: white;
      color: #374151; font-size: 13px; font-weight: 500; cursor: pointer; transition: all 0.15s ease; font-family: 'Inter', sans-serif;
    }
    :host ::ng-deep .btn-ghost:hover { background: #F8FAFC; border-color: #D1D5DB; }
    :host ::ng-deep .btn-purple {
      padding: 10px 20px; border-radius: 8px; border: none; background: #7C3AED;
      color: white; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; font-family: 'Inter', sans-serif;
    }
    :host ::ng-deep .btn-purple:hover:not(:disabled) { background: #6D28D9; }
    :host ::ng-deep .btn-purple:disabled { opacity: 0.5; cursor: not-allowed; }
    :host ::ng-deep .btn-purple-outline {
      padding: 10px 20px; border-radius: 8px; border: 1px solid #7C3AED; background: white;
      color: #7C3AED; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; font-family: 'Inter', sans-serif;
    }
    :host ::ng-deep .btn-purple-outline:hover { background: #F5F3FF; }
    :host ::ng-deep .btn-contratar {
      padding: 12px 24px; border-radius: 8px; border: none; background: #E02020;
      color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; font-family: 'Inter', sans-serif;
    }
    :host ::ng-deep .btn-contratar:hover { background: #C01A1A; }
    :host ::ng-deep .btn-activar {
      padding: 12px 24px; border-radius: 8px; border: none; background: #7C3AED;
      color: white; font-size: 14px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; font-family: 'Inter', sans-serif;
    }
    :host ::ng-deep .btn-activar:hover:not(:disabled) { background: #6D28D9; }
    :host ::ng-deep .btn-activar:disabled { opacity: 0.5; cursor: not-allowed; }

    /* Loading */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 80px;
      color: var(--slate-500, #64748B);
      font-size: 14px;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid var(--slate-200, #E2E8F0);
      border-top-color: var(--primary-orange, #F27920);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin-bottom: 16px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `],
})
export class ProductosComponent implements OnInit {
  readonly facade = inject(MarketplacesFacade);

  ngOnInit(): void {
    this.facade.cargarCatalogo();
  }

  onConocerMasProducto(_producto: unknown): void {
    // Productos hardware: solo info
  }

  onConocerMasSolucion(solucion: Solucion): void {
    if (solucion.tieneWizard) {
      this.facade.abrirContratacion(solucion);
    }
  }
}
