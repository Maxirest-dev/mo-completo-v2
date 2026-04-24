import { Component, ChangeDetectionStrategy, signal, inject, HostListener, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AiPanelService } from '../../services/ai-panel.service';
import { TourService, SpotlightAction } from '../../services/tour.service';

interface NavItem {
  label: string;
  route: string;
  active: boolean;
}

interface Local {
  code: string;
  name: string;
  selected: boolean;
}

interface Brand {
  id: string;
  code: string;
  name: string;
  color: string;
  locals: Local[];
  expanded: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  template: `
    <header class="header">
      <div class="header-single">
        <!-- Left: Logo + Brand -->
        <div class="header-left">
          <div class="logo" routerLink="/home" title="Inicio">
            <img src="/logo-icon.png" alt="Maxirest" class="logo-img" />
          </div>

          <button
            class="brand-selector"
            (click)="showBrandMenu.set(!showBrandMenu()); $event.stopPropagation()"
            [attr.aria-expanded]="showBrandMenu()"
            aria-haspopup="true"
            aria-label="Selector de marca y locales"
          >
            <span class="brand-badge" [style.background]="activeBrand().color">{{ activeBrand().code }}</span>
            <span class="brand-name">{{ activeBrand().name }}</span>
            <span class="brand-count">{{ selectedLocalsCount() }}</span>
            <svg class="brand-chevron" [class.brand-chevron-open]="showBrandMenu()" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="14" height="14">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>

          @if (showBrandMenu()) {
            <div class="brand-dropdown" role="menu" (click)="$event.stopPropagation()">
              @for (brand of brands(); track brand.id) {
                <div class="brand-section">
                  <div class="brand-section-header" role="menuitem" (click)="selectBrand(brand.id)">
                    <span class="brand-badge-sm" [style.background]="brand.color">{{ brand.code }}</span>
                    <span class="brand-section-name">{{ brand.name }}</span>
                    @if (brand.id === activeBrand().id) {
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="var(--primary-blue, #1155CC)" width="16" height="16">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                      </svg>
                    }
                    <svg class="brand-section-chevron" [class.brand-section-chevron-open]="brand.expanded" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="12" height="12" (click)="toggleBrandExpand(brand.id); $event.stopPropagation()">
                      <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                  </div>
                  @if (brand.expanded && brand.id === activeBrand().id) {
                    <div class="brand-locals">
                      <label class="local-item local-item-all">
                        <input type="checkbox" class="local-checkbox" [checked]="allLocalsSelected(brand.id)" (change)="toggleAllLocals(brand.id)" />
                        <span class="local-label">Seleccionar todo</span>
                      </label>
                      @for (local of brand.locals; track local.code) {
                        <label class="local-item">
                          <input type="checkbox" class="local-checkbox" [checked]="local.selected" (change)="toggleLocal(brand.id, local.code)" />
                          <span class="local-code">{{ local.code }}</span>
                          <span class="local-label">{{ local.name }}</span>
                        </label>
                      }
                      <button class="brand-apply-btn" (click)="applySelection()">Aplicar</button>
                    </div>
                  }
                </div>
              }
            </div>
          }
        </div>

        <!-- Center: Nav -->
        <nav class="header-nav" aria-label="Navegacion principal">
          @for (item of navItems(); track item.route) {
            <a [routerLink]="item.route" routerLinkActive="nav-item-active" class="nav-item">
              {{ item.label }}
            </a>
          }
          <div class="nav-more" (click)="showMoreMenu.set(!showMoreMenu()); $event.stopPropagation()">
            <span class="nav-item" role="button" [attr.aria-expanded]="showMoreMenu()" aria-haspopup="true">
              Mas
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="more-chevron" [class.more-chevron-open]="showMoreMenu()" width="12" height="12">
                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </span>
            @if (showMoreMenu()) {
              <div class="more-dropdown" role="menu" (click)="$event.stopPropagation()">
                @for (item of moreItems(); track item.route) {
                  <a class="more-dropdown-item" role="menuitem" [routerLink]="item.route" (click)="showMoreMenu.set(false)">{{ item.label }}</a>
                }
              </div>
            }
          </div>

          <a routerLink="/mis-productos" routerLinkActive="nav-item-active" class="nav-item nav-item-icon" title="Mis Productos" aria-label="Mis Productos">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="20" height="20" aria-hidden="true">
              <path d="M3 9h18l-1.5 11a2 2 0 0 1-2 1.75H6.5a2 2 0 0 1-2-1.75L3 9Z" />
              <path d="M8 9V6a4 4 0 0 1 8 0v3" />
            </svg>
          </a>
        </nav>

        <!-- Right: AI CTA + User -->
        <div class="header-right">
          <button class="ai-cta" (click)="aiPanel.toggle()" aria-label="Asistente IA - Habla con Maxi">
            <div class="ai-cta-shimmer"></div>
            <div class="ai-cta-inner">
              <svg class="ai-cta-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L14.09 8.26L20 6L16.74 10.91L23 12L16.74 13.09L20 18L14.09 15.74L12 22L9.91 15.74L4 18L7.26 13.09L1 12L7.26 10.91L4 6L9.91 8.26L12 2Z" fill="rgba(255,255,255,0.85)" stroke="rgba(255,255,255,0.3)" stroke-width="0.5"/>
              </svg>
              <span class="ai-cta-text">Habla con Maxi</span>
            </div>
          </button>

          <button class="help-btn" aria-label="Ayuda" [attr.aria-expanded]="showHelpMenu()" (click)="toggleHelpMenu(); $event.stopPropagation()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
          </button>
          @if (showHelpMenu()) {
            <div class="help-dropdown" (click)="$event.stopPropagation()">
              <!-- Search -->
              <div class="help-search">
                <svg class="help-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"/>
                </svg>
                <input type="text" class="help-search-input" placeholder="Buscar acción..."
                  [ngModel]="helpSearch()" (ngModelChange)="helpSearch.set($event)" />
              </div>

              @if (spotlightResults().length > 0) {
                <!-- Spotlight results -->
                <div class="help-section">
                  @for (action of spotlightResults(); track action.label) {
                    <a class="help-action-item" [routerLink]="action.route" (click)="showHelpMenu.set(false); helpSearch.set('')">
                      <span class="help-action-icon" aria-hidden="true">{{ action.icon }}</span>
                      <div class="help-action-info">
                        <span class="help-action-label">{{ action.label }}</span>
                        <span class="help-action-desc">{{ action.description }}</span>
                      </div>
                      <span class="help-action-section">{{ action.section }}</span>
                    </a>
                  }
                </div>
              } @else {
                <!-- Tour CTA -->
                @if (currentSectionHelp()) {
                  <button class="help-tour-btn" (click)="startCurrentTour()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"/>
                    </svg>
                    Iniciar tour de {{ currentSectionHelp()!.sectionName }}
                  </button>
                }

                <!-- Context links -->
                @if (currentSectionHelp()) {
                  <div class="help-section">
                    <span class="help-section-title">Ayuda de {{ currentSectionHelp()!.sectionName }}</span>
                    @for (link of currentSectionHelp()!.links; track link.label) {
                      <div class="help-link-item">
                        <span class="help-link-icon" aria-hidden="true">{{ link.icon }}</span>
                        <div class="help-link-info">
                          <span class="help-link-label">{{ link.label }}</span>
                          <span class="help-link-desc">{{ link.description }}</span>
                        </div>
                      </div>
                    }
                  </div>
                }
              }
            </div>
          }

          <button class="notif-btn" aria-label="Notificaciones">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span class="notif-badge"></span>
          </button>

          <button class="user-section" [attr.aria-expanded]="showUserMenu()" aria-haspopup="true" aria-label="Menu de usuario" (click)="showUserMenu.set(!showUserMenu()); $event.stopPropagation()">
            <div class="user-avatar"><span>NN</span></div>
            @if (showUserMenu()) {
              <div class="user-dropdown" role="menu" (click)="$event.stopPropagation()">
                <div class="dropdown-header">
                  <div class="dropdown-avatar">NN</div>
                  <div class="dropdown-user-info">
                    <span class="dropdown-user-name">Nombre Nombre</span>
                    <span class="dropdown-user-detail">Cod: 22326 - Encargado - Cajero</span>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" role="menuitem" routerLink="/mi-cuenta" (click)="showUserMenu.set(false)">Mi cuenta</a>
                <a class="dropdown-item" role="menuitem" routerLink="/usuarios" (click)="showUserMenu.set(false)">Usuarios</a>
                <a class="dropdown-item" role="menuitem" routerLink="/configuracion-negocio" (click)="showUserMenu.set(false)">Configuracion del negocio</a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item dropdown-item-danger" role="menuitem" aria-label="Cerrar sesion" (click)="showUserMenu.set(false)">Cerrar sesion</button>
              </div>
            }
          </button>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: var(--surface-dark, #01033E);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    /* === Single bar === */
    .header-single {
      display: flex;
      align-items: center;
      padding: 10px 24px;
      gap: 24px;
      background: var(--surface-dark, #01033E);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
      flex: 1;
      position: relative;
    }

    .logo {
      flex-shrink: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .logo-img {
      height: 32px;
      width: auto;
      object-fit: contain;
    }

    /* Brand/Local Selector */
    .brand-selector {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 14px;
      border-radius: 6px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.08);
      cursor: pointer;
      transition: all 0.15s ease;
      font-family: inherit;
      color: inherit;
    }

    .brand-selector:hover {
      background: rgba(255, 255, 255, 0.06);
      border-color: rgba(255, 255, 255, 0.15);
    }

    .brand-selector:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .brand-badge {
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      color: #000;
      letter-spacing: 0.3px;
      flex-shrink: 0;
    }

    .brand-name {
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
      white-space: nowrap;
      transition: color 0.15s ease;
    }

    .brand-selector:hover .brand-name {
      color: #FFFFFF;
    }

    .brand-count {
      font-size: 10px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.5);
      background: rgba(255, 255, 255, 0.1);
      padding: 1px 6px;
      border-radius: 8px;
      flex-shrink: 0;
    }

    .brand-chevron {
      color: rgba(255, 255, 255, 0.4);
      transition: transform 0.2s ease, color 0.15s ease;
      flex-shrink: 0;
    }

    .brand-selector:hover .brand-chevron {
      color: rgba(255, 255, 255, 0.7);
    }

    .brand-chevron-open { transform: rotate(180deg); }

    .brand-dropdown {
      position: absolute;
      top: calc(100% + 20px);
      left: 132px;
      width: 280px;
      max-height: 420px;
      overflow-y: auto;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      animation: brandDropIn 0.15s ease;
    }

    .brand-dropdown::-webkit-scrollbar { width: 4px; }
    .brand-dropdown::-webkit-scrollbar-track { background: transparent; }
    .brand-dropdown::-webkit-scrollbar-thumb { background: var(--slate-200, #E2E8F0); border-radius: 10px; }

    @keyframes brandDropIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .brand-section { border-bottom: none; }

    .brand-section-header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      margin: 6px 8px;
      border-radius: 8px;
      background: var(--slate-50, #F8FAFC);
      border: 1px solid #EEF2F6;
      cursor: pointer;
      transition: all 0.12s ease;
    }

    .brand-section-header:hover {
      background: var(--slate-100, #F1F5F9);
      border-color: var(--slate-200, #E2E8F0);
    }

    .brand-badge-sm {
      padding: 2px 6px;
      border-radius: 3px;
      font-size: 10px;
      font-weight: 700;
      color: #000;
      letter-spacing: 0.3px;
      flex-shrink: 0;
    }

    .brand-section-name { flex: 1; font-size: 13px; font-weight: 600; color: var(--slate-800, #1F2937); }
    .brand-section-chevron { color: var(--slate-400, #9CA3AF); transition: transform 0.2s ease; flex-shrink: 0; }
    .brand-section-chevron-open { transform: rotate(180deg); }

    .brand-locals { padding: 0 12px 12px; }

    .local-item {
      display: flex; align-items: center; gap: 8px;
      padding: 7px 8px; border-radius: 6px; cursor: pointer;
      transition: background 0.1s ease;
    }
    .local-item:hover { background: var(--slate-50, #F9FAFB); }
    .local-item-all { padding-bottom: 8px; margin-bottom: 4px; border-bottom: 1px solid var(--slate-100, #F3F4F6); }

    .local-checkbox { width: 16px; height: 16px; border-radius: 4px; accent-color: var(--accent-orange, #F18800); cursor: pointer; flex-shrink: 0; }
    .local-code { font-size: 11px; color: var(--slate-400, #9CA3AF); font-weight: 500; flex-shrink: 0; }
    .local-label { font-size: 13px; color: var(--slate-700, #374151); }
    .local-item-all .local-label { font-weight: 500; color: var(--slate-800, #1F2937); }

    .brand-apply-btn {
      display: inline-block; margin-top: 8px; padding: 5px 20px;
      border: none; border-radius: 6px; background: var(--primary-blue, #1155CC); color: white;
      font-size: 12px; font-weight: 500; font-family: inherit; cursor: pointer;
      transition: background 0.15s ease;
    }
    .brand-apply-btn:hover { background: var(--primary-blue-hover, #0D44A6); }

    /* Right Section */
    .header-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 14px;
      flex: 1;
    }

    /* AI CTA */
    .ai-cta {
      position: relative; display: flex; align-items: center;
      border: none; border-radius: 10px; padding: 0;
      cursor: pointer; background: transparent; overflow: hidden;
    }

    .ai-cta:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .ai-cta-shimmer {
      position: absolute; inset: 0; border-radius: 10px;
      background: linear-gradient(120deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.08) 40%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0.08) 60%, rgba(255,255,255,0) 100%);
      background-size: 250% 100%; animation: shimmer 6s ease-in-out infinite; z-index: 0;
    }

    .ai-cta-inner {
      position: relative; z-index: 1; display: flex; align-items: center; gap: 8px;
      padding: 8px 14px; border-radius: 10px; border: none;
      background: linear-gradient(135deg, #1155CC, #01033E, #1155CC);
      background-size: 200% 100%; animation: ctaGradientShift 8s ease infinite;
      transition: all 0.2s ease;
    }

    .ai-cta:hover .ai-cta-inner {
      background: linear-gradient(135deg, #1a6be6, #0a0d52);
      box-shadow: 0 2px 12px rgba(17, 85, 204, 0.3);
    }

    .ai-cta-icon { width: 16px; height: 16px; flex-shrink: 0; animation: gentlePulse 4s ease-in-out infinite; }
    .ai-cta-text { font-size: 13px; font-weight: 500; color: #FFFFFF; white-space: nowrap; }

    @keyframes ctaGradientShift { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
    @keyframes shimmer { 0%, 100% { background-position: 250% 0; } 50% { background-position: -50% 0; } }
    @keyframes gentlePulse { 0%, 100% { opacity: 0.85; transform: scale(1); } 50% { opacity: 1; transform: scale(1.06); } }

    /* Notifications */
    .help-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .help-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    /* Help Dropdown */
    .help-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      width: 320px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
      border: 1px solid var(--slate-200, #E2E8F0);
      z-index: 100;
      overflow: hidden;
      animation: dropIn 0.15s ease;
    }

    @keyframes dropIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .help-search {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      border-bottom: 1px solid var(--slate-100, #F1F5F9);
    }

    .help-search-icon { color: var(--slate-400, #94A3B8); flex-shrink: 0; }

    .help-search-input {
      flex: 1;
      border: none;
      outline: none;
      font-size: 13px;
      font-family: 'Inter', sans-serif;
      color: var(--slate-900, #0F172B);
      background: transparent;
    }

    .help-search-input::placeholder { color: var(--slate-400, #94A3B8); }

    /* Tour CTA */
    .help-tour-btn {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      padding: 14px;
      border: none;
      background: var(--slate-50, #F8FAFC);
      border-bottom: 1px solid var(--slate-100, #F1F5F9);
      color: var(--primary-orange, #F18800);
      font-size: 13px;
      font-weight: 600;
      font-family: 'Inter', sans-serif;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .help-tour-btn:hover { background: #FFF7ED; }
    .help-tour-btn svg { color: var(--primary-orange, #F18800); }

    /* Section & links */
    .help-section { padding: 8px 0; }

    .help-section-title {
      display: block;
      padding: 6px 14px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--slate-400, #94A3B8);
    }

    .help-link-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 14px;
      cursor: default;
      transition: background 0.1s;
    }

    .help-link-item:hover { background: var(--slate-50, #F8FAFC); }

    .help-link-icon { font-size: 16px; flex-shrink: 0; }
    .help-link-info { display: flex; flex-direction: column; }
    .help-link-label { font-size: 13px; font-weight: 500; color: var(--slate-900, #0F172B); }
    .help-link-desc { font-size: 11px; color: var(--slate-400, #94A3B8); }

    /* Spotlight results */
    .help-action-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      text-decoration: none;
      transition: background 0.1s;
      cursor: pointer;
    }

    .help-action-item:hover { background: var(--slate-50, #F8FAFC); }

    .help-action-icon { font-size: 16px; flex-shrink: 0; }
    .help-action-info { display: flex; flex-direction: column; flex: 1; }
    .help-action-label { font-size: 13px; font-weight: 500; color: var(--slate-900, #0F172B); }
    .help-action-desc { font-size: 11px; color: var(--slate-400, #94A3B8); }
    .help-action-section {
      font-size: 10px; font-weight: 500; color: var(--slate-400, #94A3B8);
      background: var(--slate-100, #F1F5F9); padding: 2px 6px; border-radius: 4px;
      flex-shrink: 0;
    }

    .notif-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: none;
      background: transparent;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .notif-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #FFFFFF;
    }

    .notif-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: var(--accent-orange, #F18800);
      border: 1.5px solid var(--surface-dark, #01033E);
    }

    /* User Section */
    .user-section {
      display: flex; align-items: center;
      padding: 0;
      border-radius: 50%;
      border: none;
      background: transparent;
      position: relative; cursor: pointer;
      font-family: inherit;
      transition: all 0.15s ease;
    }

    .user-section:hover .user-avatar {
      background: rgba(255, 255, 255, 0.18);
      border-color: rgba(255, 255, 255, 0.35);
    }

    .user-section:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .user-dropdown {
      position: absolute; top: calc(100% + 12px); right: 0; width: 280px;
      background: white; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 1000; overflow: hidden; animation: brandDropIn 0.15s ease;
    }
    .dropdown-header { display: flex; align-items: center; gap: 12px; padding: 16px; }
    .dropdown-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--primary-blue, #1155CC); color: white; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
    .dropdown-user-info { display: flex; flex-direction: column; }
    .dropdown-user-name { font-size: 14px; font-weight: 600; color: var(--slate-800, #1F2937); }
    .dropdown-user-detail { font-size: 12px; color: var(--slate-400, #9CA3AF); }
    .dropdown-divider { height: 1px; background: var(--slate-100, #F3F4F6); }
    .dropdown-item { display: flex; align-items: center; gap: 10px; padding: 12px 16px; font-size: 14px; color: var(--slate-700, #374151); text-decoration: none; cursor: pointer; transition: background 0.15s; border: none; background: none; width: 100%; font-family: inherit; }
    .dropdown-item:hover { background: var(--slate-50, #F9FAFB); }
    .dropdown-item-danger { color: var(--danger-color, #DC2626); }

    .user-avatar { width: 32px; height: 32px; background: rgba(255, 255, 255, 0.1); border: 1.5px solid rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: rgba(255, 255, 255, 0.8); flex-shrink: 0; transition: all 0.15s ease; }

    /* === Navigation inline === */
    .header-nav {
      display: flex;
      align-items: center;
      flex: 0 0 auto;
      justify-content: center;
      gap: 0;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 8px 14px;
      font-size: 13.5px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      border-radius: 6px;
      transition: color 0.15s ease, background 0.15s ease;
      white-space: nowrap;
    }

    .nav-item:hover {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.06);
    }

    .nav-item:focus-visible {
      outline: 2px solid white;
      outline-offset: 2px;
    }

    .nav-item-active {
      color: #FFFFFF;
      background: rgba(255, 255, 255, 0.1);
    }

    /* More menu */
    .nav-more { position: relative; }
    .nav-more .nav-item { gap: 4px; cursor: pointer; }

    /* Nav icon-only button */
    .nav-item-icon {
      padding: 7px 10px;
      color: rgba(255, 255, 255, 0.85);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .nav-item-icon:hover { color: #FFFFFF; }
    .nav-item-icon.nav-item-active { color: #FFFFFF; }
    .nav-item-icon svg { display: block; }
    .more-chevron { transition: transform 0.2s ease; }
    .more-chevron-open { transform: rotate(180deg); }

    .more-dropdown {
      position: absolute; top: calc(100% + 4px); left: 0; min-width: 180px;
      background: #FFFFFF; border-radius: 10px; box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 1000; overflow: hidden; animation: brandDropIn 0.15s ease; padding: 4px 0;
    }
    .more-dropdown-item { display: block; padding: 10px 16px; font-size: 13.5px; font-weight: 500; color: var(--slate-700, #374151); text-decoration: none; transition: background 0.1s ease; }
    .more-dropdown-item:hover { background: var(--slate-50, #F9FAFB); }

    /* Responsive */
    @media (max-width: 1280px) {
      .nav-item { padding: 8px 10px; font-size: 12px; }
    }

    @media (max-width: 1024px) {
      .ai-cta-text { display: none; }
      .nav-item { padding: 6px 8px; font-size: 11.5px; }
      .header-left { gap: 16px; }
    }

    @media (max-width: 768px) {
      .header-single { padding: 10px 16px; gap: 12px; }
      .brand-name { display: none; }
      .brand-count { display: none; }
      .header-nav { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly aiPanel = inject(AiPanelService);
  readonly tourService = inject(TourService);
  private readonly router = inject(Router);

  showUserMenu = signal(false);
  showBrandMenu = signal(false);
  showMoreMenu = signal(false);
  showHelpMenu = signal(false);
  helpSearch = signal('');

  readonly spotlightResults = computed(() => this.tourService.searchActions(this.helpSearch()));

  readonly currentSectionHelp = computed(() => {
    const section = this.tourService.detectSection(this.router.url);
    return this.tourService.getSectionHelp(section);
  });

  toggleHelpMenu(): void {
    this.showHelpMenu.update(v => !v);
    this.helpSearch.set('');
    // Close other menus
    this.showUserMenu.set(false);
    this.showMoreMenu.set(false);
  }

  startCurrentTour(): void {
    const section = this.tourService.detectSection(this.router.url);
    this.showHelpMenu.set(false);
    this.helpSearch.set('');
    setTimeout(() => this.tourService.startTour(section), 200);
  }

  brands = signal<Brand[]>([
    {
      id: 'bp', code: 'C33', name: 'BIG PONS', color: '#FACC15',
      expanded: true,
      locals: [
        { code: 'C2330', name: 'Quilmes', selected: true },
        { code: 'C2326', name: 'Lomas de Zamora', selected: true },
        { code: 'C2340', name: 'Escobar', selected: false },
        { code: 'C2345', name: 'Pilar', selected: false },
        { code: 'C2350', name: 'San Isidro', selected: true },
        { code: 'C2360', name: 'Tigre', selected: false },
      ],
    },
    {
      id: 'bk', code: 'C25', name: 'BURGER KING', color: '#F97316',
      expanded: false,
      locals: [
        { code: 'C2500', name: 'Palermo', selected: true },
        { code: 'C2510', name: 'Belgrano', selected: true },
        { code: 'C2520', name: 'Recoleta', selected: false },
        { code: 'C2530', name: 'Caballito', selected: true },
      ],
    },
  ]);

  activeBrand = signal<Brand>({
    id: 'bp', code: 'C33', name: 'BIG PONS', color: '#FACC15',
    expanded: true,
    locals: [
      { code: 'C2330', name: 'Quilmes', selected: true },
      { code: 'C2326', name: 'Lomas de Zamora', selected: true },
      { code: 'C2340', name: 'Escobar', selected: false },
      { code: 'C2345', name: 'Pilar', selected: false },
      { code: 'C2350', name: 'San Isidro', selected: true },
      { code: 'C2360', name: 'Tigre', selected: false },
    ],
  });

  selectedLocalsCount = computed(() => {
    const brand = this.activeBrand();
    const selected = brand.locals.filter(l => l.selected).length;
    return `${selected}/${brand.locals.length}`;
  });

  navItems = signal<NavItem[]>([
    { label: 'Punto de venta', route: '/pdv', active: false },
    { label: 'Menu', route: '/carta', active: false },
    { label: 'Compras', route: '/compras', active: false },
    { label: 'Inventario', route: '/inventario', active: false },
    { label: 'Produccion', route: '/produccion', active: false },
    { label: 'Ventas', route: '/ventas', active: false },
  ]);

  moreItems = signal<NavItem[]>([
    { label: 'Tesoreria', route: '/tesoreria', active: false },
    { label: 'Personal', route: '/personal', active: false },
    { label: 'Balances', route: '/balances', active: false },
  ]);

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.aiPanel.toggle();
    }
    if (e.key === 'Escape') {
      this.showBrandMenu.set(false);
      this.showUserMenu.set(false);
      this.showMoreMenu.set(false);
      this.showHelpMenu.set(false);
    }
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.showBrandMenu.set(false);
    this.showUserMenu.set(false);
    this.showMoreMenu.set(false);
    this.showHelpMenu.set(false);
  }

  selectBrand(brandId: string): void {
    const brand = this.brands().find(b => b.id === brandId);
    if (brand) {
      this.activeBrand.set(brand);
      this.brands.update(brands =>
        brands.map(b => ({ ...b, expanded: b.id === brandId }))
      );
    }
  }

  toggleBrandExpand(brandId: string): void {
    this.brands.update(brands =>
      brands.map(b => ({ ...b, expanded: b.id === brandId ? !b.expanded : b.expanded }))
    );
  }

  toggleLocal(brandId: string, localCode: string): void {
    this.brands.update(brands =>
      brands.map(b => b.id !== brandId ? b : {
        ...b,
        locals: b.locals.map(l => l.code === localCode ? { ...l, selected: !l.selected } : l),
      })
    );
  }

  toggleAllLocals(brandId: string): void {
    const brand = this.brands().find(b => b.id === brandId);
    if (!brand) return;
    const allSelected = brand.locals.every(l => l.selected);
    this.brands.update(brands =>
      brands.map(b => b.id !== brandId ? b : {
        ...b,
        locals: b.locals.map(l => ({ ...l, selected: !allSelected })),
      })
    );
  }

  allLocalsSelected(brandId: string): boolean {
    const brand = this.brands().find(b => b.id === brandId);
    return brand ? brand.locals.every(l => l.selected) : false;
  }

  applySelection(): void {
    const brand = this.brands().find(b => b.id === this.activeBrand().id);
    if (brand) {
      this.activeBrand.set(brand);
      this.showBrandMenu.set(false);
    }
  }
}
