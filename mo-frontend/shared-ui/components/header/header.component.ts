import { Component, ChangeDetectionStrategy, signal, inject, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AiPanelService } from '../../services/ai-panel.service';

interface NavItem {
  label: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="header">
      <div class="header-top">
        <!-- Left: Logo -->
        <div class="header-top-left">
          <div class="logo" routerLink="/home" title="Maxirest">
            <img src="/logo.png" alt="Maxirest" class="logo-img" />
          </div>
        </div>

        <!-- Center: Home + Search -->
        <div class="search-group">
          <button class="home-btn" title="Inicio" routerLink="/home">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </button>
          <div class="search-container">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="search-icon">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar..."
              class="search-input"
              [value]="searchQuery()"
              (input)="onSearchInput($event)"
            />
          </div>
        </div>

        <!-- Right: AI CTA + User -->
        <div class="header-right">
          <!-- AI Assistant CTA -->
          <button class="ai-cta" (click)="aiPanel.toggle()" title="Asistente IA (⌘K)">
            <div class="ai-cta-shimmer"></div>
            <div class="ai-cta-inner">
              <span class="ai-cta-emoji">🧠</span>
              <span class="ai-cta-text">Habla con Maxi</span>
            </div>
          </button>

          <!-- User Info -->
          <div class="user-section" (click)="showUserMenu.set(!showUserMenu()); $event.stopPropagation()">
            <div class="user-info">
              <span class="user-code">(22326)</span>
              <span class="user-name">Nombre Nombre</span>
            </div>
            <div class="user-avatar">
              <span>NN</span>
            </div>

            <!-- User Dropdown -->
            @if (showUserMenu()) {
              <div class="user-dropdown" (click)="$event.stopPropagation()">
                <div class="dropdown-header">
                  <div class="dropdown-avatar">NN</div>
                  <div class="dropdown-user-info">
                    <span class="dropdown-user-name">Nombre Nombre</span>
                    <span class="dropdown-user-detail">Cod: 22326 - Encargado - Cajero</span>
                  </div>
                </div>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" routerLink="/mi-cuenta" (click)="showUserMenu.set(false)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  Mi cuenta
                </a>
                <a class="dropdown-item" routerLink="/usuarios" (click)="showUserMenu.set(false)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                  </svg>
                  Usuarios
                </a>
                <a class="dropdown-item" routerLink="/configuracion-negocio" (click)="showUserMenu.set(false)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                  Configuracion del negocio
                </a>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item dropdown-item-danger" (click)="showUserMenu.set(false)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
                  </svg>
                  Cerrar sesion
                </button>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="header-nav">
        <div class="nav-spacer"></div>
        <div class="nav-center">
          @for (item of navItems(); track item.route) {
            <a
              [routerLink]="item.route"
              routerLinkActive="nav-item-active"
              class="nav-item"
              [class.nav-item-active]="item.active"
            >
              {{ item.label }}
            </a>
          }
        </div>
        <div class="nav-spacer nav-spacer-right">
          <button class="download-btn" title="Descargar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
          </button>
        </div>
      </nav>
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

    .header-top {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      gap: 16px;
      background: var(--surface-dark, #01033E);
    }

    .header-top-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
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

    /* Search group */
    .search-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto;
    }

    .home-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: 50%;
      color: white;
      cursor: pointer;
      transition: background 0.15s ease;
    }

    .home-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .home-btn svg {
      width: 20px;
      height: 20px;
    }

    .search-container {
      width: 400px;
      display: flex;
      align-items: center;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 8px;
      padding: 0 12px;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }

    .search-container:focus-within {
      border-color: var(--primary-blue, #1155CC);
      box-shadow: 0 0 0 3px rgba(17, 85, 204, 0.15);
    }

    .search-icon {
      width: 18px;
      height: 18px;
      color: rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
    }

    .search-input {
      flex: 1;
      border: none;
      outline: none;
      padding: 10px 12px;
      font-size: 14px;
      font-family: inherit;
      color: #FFFFFF;
      background: transparent;
    }

    .search-input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    /* Right Section */
    .header-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      justify-content: flex-end;
    }

    /* === AI CTA — subtle, header-native === */
    .ai-cta {
      position: relative;
      display: flex;
      align-items: center;
      border: none;
      border-radius: 10px;
      padding: 0;
      cursor: pointer;
      background: transparent;
      overflow: hidden;
    }

    .ai-cta-shimmer {
      position: absolute;
      inset: 0;
      border-radius: 10px;
      background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.08) 40%,
        rgba(255, 255, 255, 0.15) 50%,
        rgba(255, 255, 255, 0.08) 60%,
        rgba(255, 255, 255, 0) 100%
      );
      background-size: 250% 100%;
      animation: shimmer 6s ease-in-out infinite;
      z-index: 0;
    }

    .ai-cta-inner {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #1155CC, #01033E, #1155CC);
      background-size: 200% 100%;
      animation: ctaGradientShift 8s ease infinite;
      transition: all 0.2s ease;
    }

    .ai-cta:hover .ai-cta-inner {
      background: linear-gradient(135deg, #1a6be6, #0a0d52);
      box-shadow: 0 2px 12px rgba(17, 85, 204, 0.3);
    }

    .ai-cta-emoji {
      font-size: 15px;
      line-height: 1;
      flex-shrink: 0;
      animation: gentlePulse 4s ease-in-out infinite;
    }

    .ai-cta-text {
      font-size: 13px;
      font-weight: 500;
      color: #FFFFFF;
      white-space: nowrap;
      letter-spacing: -0.01em;
    }

    @keyframes ctaGradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }

    @keyframes shimmer {
      0%, 100% { background-position: 250% 0; }
      50% { background-position: -50% 0; }
    }

    @keyframes gentlePulse {
      0%, 100% { opacity: 0.7; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.06); }
    }

    /* User Section */
    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 16px;
      margin-left: 4px;
      border-left: 1px solid rgba(255, 255, 255, 0.15);
      position: relative;
      cursor: pointer;
    }

    .user-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      right: 0;
      width: 280px;
      background: white;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      z-index: 1000;
      overflow: hidden;
    }
    .dropdown-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
    }
    .dropdown-avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: var(--primary-blue, #1155CC); color: white; display: flex;
      align-items: center; justify-content: center;
      font-size: 14px; font-weight: 600; flex-shrink: 0;
    }
    .dropdown-user-info { display: flex; flex-direction: column; }
    .dropdown-user-name { font-size: 14px; font-weight: 600; color: #1F2937; }
    .dropdown-user-detail { font-size: 12px; color: #9CA3AF; }
    .dropdown-divider { height: 1px; background: #F3F4F6; }
    .dropdown-item {
      display: flex; align-items: center; gap: 10px;
      padding: 12px 16px; font-size: 14px; color: #374151;
      text-decoration: none; cursor: pointer; transition: background 0.15s;
      border: none; background: none; width: 100%; font-family: inherit;
    }
    .dropdown-item:hover { background: #F9FAFB; }
    .dropdown-item svg { color: #9CA3AF; flex-shrink: 0; }
    .dropdown-item-danger { color: #DC2626; }
    .dropdown-item-danger svg { color: #DC2626; }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      line-height: 1.3;
    }

    .user-code {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .user-name {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.9);
      font-weight: 500;
    }

    .user-avatar {
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.7);
    }

    /* Navigation */
    .header-nav {
      display: flex;
      align-items: center;
      padding: 0 24px;
      background: var(--surface-dark-nav, #0A0D52);
    }
    .nav-center {
      display: flex;
      align-items: center;
    }
    .nav-spacer {
      flex: 1;
    }
    .nav-spacer-right {
      display: flex;
      justify-content: flex-end;
    }

    .nav-item {
      position: relative;
      padding: 14px 20px;
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      transition: color 0.15s ease;
    }

    .nav-item:hover {
      color: white;
    }

    .nav-item-active {
      color: white;
      background: rgba(255, 255, 255, 0.1);
    }

    .nav-item-active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: white;
    }

    .download-btn {
      margin-left: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      cursor: pointer;
      transition: color 0.15s ease;
    }

    .download-btn:hover {
      color: white;
    }

    .download-btn svg {
      width: 20px;
      height: 20px;
    }

    /* Responsive */
    @media (max-width: 1024px) {
      .user-info {
        display: none;
      }
      .nav-item {
        padding: 14px 14px;
        font-size: 13px;
      }
      .ai-cta-text {
        display: none;
      }
    }

    @media (max-width: 768px) {
      .header-top {
        padding: 12px 16px;
      }
      .search-container {
        max-width: 280px;
      }
      .header-nav {
        padding: 0 16px;
        overflow-x: auto;
      }
      .nav-item {
        padding: 12px 12px;
        white-space: nowrap;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  readonly aiPanel = inject(AiPanelService);

  searchQuery = signal('');
  showUserMenu = signal(false);

  navItems = signal<NavItem[]>([
    { label: 'Punto de venta', route: '/pdv', active: false },
    { label: 'Menu', route: '/carta', active: false },
    { label: 'Compras', route: '/compras', active: false },
    { label: 'Inventario', route: '/inventario', active: false },
    { label: 'Produccion', route: '/produccion', active: false },
    { label: 'Ventas', route: '/ventas', active: false },
  ]);

  @HostListener('document:keydown', ['$event'])
  onKeydown(e: KeyboardEvent): void {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      this.aiPanel.toggle();
    }
  }

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
