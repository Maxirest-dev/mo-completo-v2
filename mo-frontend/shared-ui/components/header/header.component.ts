import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
        <!-- Left: Logo + Home -->
        <div class="header-top-left">
          <div class="logo" routerLink="/home" title="Maxirest">
            <svg viewBox="0 0 558 170" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
              <path d="M103.25 53.08c-2.66-1.12-5.73-.52-7.77 1.53l-13 13.64-13-13.63-.06-.06c-2.03-2.05-5.1-2.65-7.76-1.54-2.68 1.14-4.4 3.78-4.37 6.69v27.7c0 1.42-2.34 3.39-4.65 3.39s-4.65-2-4.65-3.39V34.19c1.99-1.53 2.78-4.15 1.97-6.52-.8-2.37-3.03-3.97-5.54-3.97-2.5 0-4.73 1.6-5.54 3.97-.8 2.37-.01 4.99 1.97 6.52v53.22c0 6 6.22 10.52 11.78 10.52 5.56 0 11.77-4.5 11.77-10.52V59.68l13.27 13.89.06.06c2.63 2.62 6.89 2.62 9.52 0l.06-.06 13.27-13.89v69.38c.02.95-.63 1.79-1.56 2-5.58 1.24-11.28 1.85-17 1.81-28.61-.15-54.66-16.49-67.26-42.18-12.59-25.69-9.54-56.29 7.87-78.99 2.37 0 4.5-1.42 5.41-3.6.91-2.19.41-4.7-1.26-6.38-1.67-1.68-4.19-2.18-6.38-1.27-2.19.9-3.61 3.04-3.61 5.41 0 .47.06.95.17 1.41C-17.86 33.92-19.31 72.02-.27 101.31c19.04 29.29 54.46 43.42 88.43 35.28 1.32-.37 5.63-1.94 5.77-6.56V58.67c.04-2.89-1.65-5.52-4.29-6.68" fill="white"/>
              <path d="M247 93.69q-.4-6-.86-12.12-.46-6.12-1-11.76c-.34-3.74-.68-7-1-9.75-.32-2.75-.64-4.71-.91-5.85-.2-1.05-.84-1.95-1.77-2.48-1.15-.55-2.41-.81-3.68-.75-.88.01-1.76.09-2.63.25-.81.12-1.59.38-2.32.76q-3 7-7.42 16.86-4.42 9.86-8.81 20.64h-.4q-2.33-5.35-4.85-11.41-2.52-6.06-5.15-12.16-2.62-6.06-5.25-11.21c-.52-1.18-1.41-2.17-2.52-2.82-1.21-.64-2.57-.95-3.94-.91-1.17-.02-2.34.18-3.44.6-.84.32-1.62.76-2.32 1.32q-.51 5.66-1.06 12.67-.55 7.01-1.06 14.24-.51 7.22-.86 13.58c-.23 4.24-.44 7.82-.6 10.75-.16 2.93-.25 4.8-.25 5.6-.05.94.27 1.87.9 2.58.86.74 1.99 1.11 3.13 1 .69 0 1.39-.06 2.07-.2.53-.11 1.06-.24 1.57-.41q.51-7.26.86-13.68.35-6.42.76-12.54c.58-8.93 1.05-17.87 1.41-26.81h.4q2.43 6.17 6.41 15.55 3.98 9.38 9.34 20.7c.35.75.99 1.33 1.77 1.62.92.35 1.9.52 2.88.5.87.01 1.74-.12 2.57-.4.66-.21 1.29-.52 1.87-.91q6-13.83 9.8-22.57 3.8-8.74 6.06-14.29h.4q.3 5.06.71 13 .41 7.94 1 17.52.55 9.54 1.16 19.33c0 1.08.49 2.09 1.33 2.76.8.52 1.73.78 2.68.76.78.01 1.56-.09 2.32-.3.68-.21 1.33-.52 1.92-.91q-.11-2.83-.46-7.63c-.24-3.16-.46-6.75-.76-10.72m43.01-25.04q-5.15-3.94-13.93-3.94c-2.56-.02-5.12.24-7.63.76-2.19.43-4.31 1.16-6.31 2.17q-2.93 1.41-2.93 4c.01.72.24 1.42.66 2 .4.61.88 1.18 1.43 1.67 2.16-1.09 4.41-2 6.72-2.72 2.56-.82 5.24-1.23 7.93-1.22 2.91-.15 5.78.67 8.17 2.33 2 1.55 3 4 3 7.37v2.83l-14.33 1.41q-7.79.71-12.17 4.19-4.38 3.48-4.39 10 0 7.06 5.2 10.8 5.2 3.74 14.69 3.74c3.07.04 6.12-.34 9.09-1.11 2.24-.57 4.4-1.38 6.46-2.43.99-.54 1.87-1.28 2.57-2.17.64-1.01.94-2.19.86-3.38V77.87q.06-8.49-5.09-12.42m-2.83 36.25c-1.25.73-2.6 1.29-4 1.66-2.28.63-4.64.92-7 .86-3.91 0-6.85-.7-8.84-2.12-1.94-1.3-3.07-3.51-3-5.85-.13-2.16.82-4.24 2.53-5.56q2.52-1.92 7.77-2.32l12.52-1.31.02 14.64zm40.69-15.99l5.81-7q3.58-4.35 7-8.59c.57-.72 1.06-1.49 1.46-2.32.31-.66.46-1.39.46-2.12.03-1-.42-1.96-1.21-2.58-.97-.7-2.14-1.05-3.33-1h-.51c-.21.01-.41.04-.61.1q-3.82 5.55-7.47 10.2-3 3.89-6.44 8.27c-1.67-2.14-3.3-4.35-4.87-6.61q-3.31-4.77-6.34-8.77c-.57-.84-1.24-1.6-2-2.28-.77-.6-1.74-.9-2.72-.85-1.02-.02-2.01.38-2.73 1.11-.8.87-1.33 1.96-1.52 3.13q4.05 5.15 7.88 10 3.51 4.44 7.52 9.29-2.82 3.56-5.8 7c-2.7 3.13-5.25 6.31-7.68 9.54-.67.76-1.23 1.61-1.66 2.53-.23.54-.35 1.12-.36 1.71-.02.98.41 1.91 1.16 2.53 1.01.74 2.24 1.09 3.49 1h1.41q3.64-5.06 7.58-10.35 3.35-4.5 6.54-8.76 2.31 3.18 4.82 6.69l6.41 9c.73.99 1.57 1.89 2.52 2.68.79.59 1.75.89 2.73.86 1.09.04 2.14-.36 2.93-1.11.77-.82 1.23-1.88 1.31-3q-4.16-5.43-8.35-10.72-3.73-4.74-7.43-9.58m27.77-37.57c-1.39-.04-2.74.5-3.73 1.47-.97.94-1.51 2.23-1.51 3.59 0 1.35.55 2.64 1.51 3.59.99.99 2.33 1.53 3.73 1.51 2.79 0 5.05-2.26 5.05-5.05s-2.26-5.05-5.05-5.05v-.05zm2.98 15.04c-.93-.65-2.05-.95-3.18-.86-.76-.01-1.53.08-2.27.25-.53.12-1.05.27-1.56.45v43.32c-.1 1.05.31 2.09 1.11 2.78.95.63 2.09.94 3.23.86.75 0 1.49-.08 2.22-.25.51-.12 1.02-.27 1.51-.46V69.32c.11-1.07-.28-2.13-1.06-2.87m32.53-1.67c-3.4-.04-6.8.39-10.09 1.26-2.53.64-4.94 1.65-7.17 3-1.14.68-2.12 1.59-2.88 2.68-.63 1.12-.92 2.4-.86 3.68v34.23c-.1 1.05.32 2.09 1.11 2.78.95.63 2.09.94 3.23.86.75 0 1.49-.08 2.22-.25.52-.12 1.02-.27 1.52-.46V69.73c1.85-1 3.82-1.77 5.86-2.28 2.68-.67 5.44-.99 8.21-.94 1.08 0 2.17.06 3.24.2 1.07.13 1.95.27 2.62.4.36-.43.63-.93.81-1.46.21-.6.31-1.23.3-1.87q-.04-4.05-8.12-4.05m43.47 2.63c-3.33-1.8-7.07-2.71-10.85-2.63-3.08-.03-6.14.54-9 1.67-2.69 1.07-5.12 2.7-7.12 4.79-2.05 2.2-3.63 4.8-4.64 7.63-1.16 3.29-1.73 6.75-1.67 10.24-.15 4.75.91 9.46 3.08 13.69 1.98 3.66 5.05 6.61 8.79 8.43 4.21 1.97 8.83 2.94 13.48 2.83 2.7.03 5.39-.3 8-1 2.07-.53 4.02-1.44 5.76-2.68 1.26-.78 2.06-2.11 2.17-3.58.01-.78-.22-1.54-.66-2.18-.47-.67-1.07-1.23-1.76-1.66-1.67 1.25-3.51 2.26-5.46 3-2.44.97-5.05 1.45-7.67 1.41q-8 0-12.57-4.19c-2.53-2.41-4.22-5.56-4.83-9h31.13c1.05-.06 2.04-.47 2.83-1.16.75-.88 1.11-2.03 1-3.18.07-3.76-.85-7.47-2.68-10.75-1.72-3.07-4.26-5.61-7.33-7.32m-25.38 20.42q.21-7.74 4.08-12c2.62-2.96 6.4-4.6 10.35-4.5q6.06 0 9.49 3.59c2.33 2.49 3.7 5.73 3.84 9.14l-27.76 3.77zm63.2-1.74l-7-1.72c-1.87-.32-3.61-1.18-5-2.47-1.01-1.04-1.57-2.44-1.56-3.89-.05-1.99.99-3.85 2.72-4.85 2.18-1.24 4.67-1.83 7.17-1.72 1.87-.02 3.74.2 5.56.66 1.52.38 2.99.92 4.39 1.62 1.06.53 2.08 1.12 3.08 1.76.72-.32 1.34-.84 1.77-1.51.44-.69.66-1.5.65-2.32-.09-1.38-.83-2.64-2-3.39-1.65-1.2-3.52-2.06-5.5-2.52-2.7-.7-5.49-1.03-8.28-1q-8.88 0-13.23 3.94c-2.75 2.31-4.33 5.7-4.34 9.29-.09 2.9.92 5.73 2.83 7.92q2.82 3.18 9 4.7l8.39 2.22c1.97.38 3.78 1.34 5.21 2.75 1.2 1.3 1.83 3.02 1.76 4.79q0 7.08-10.5 7.07c-2.84.05-5.66-.5-8.28-1.61-2.23-.97-4.36-2.16-6.36-3.54-.83.42-1.53 1.07-2 1.87-.42.72-.65 1.54-.66 2.37q0 2.83 4.85 5.2 4.85 2.37 12.52 2.38 9 0 13.74-3.64c3.14-2.38 4.92-6.16 4.74-10.1.15-3.38-1.09-6.68-3.43-9.13q-3.38-3.52-10.24-5.13m46.47 20.8c-.29-.56-.67-1.07-1.11-1.52-1.12.61-2.3 1.09-3.53 1.42-1.25.37-2.54.58-3.84.6-2.24.12-4.47-.46-6.36-1.66q-2.32-1.68-2.32-5.71V78.41h14.44c.84.04 1.65-.29 2.22-.91.58-.71.86-1.62.81-2.53 0-.65-.1-1.3-.31-1.92-.14-.46-.34-.9-.6-1.31h-16.56V60.13c.09-1.04-.3-2.07-1.06-2.78-.93-.64-2.05-.94-3.18-.86-.77 0-1.53.08-2.28.26-.53.12-1.05.27-1.56.45v48q0 7.26 4.39 10.4 4.39 3.14 11.46 3.13c2.5.12 5-.37 7.27-1.42q2.63-1.41 2.63-3.63c.02-.75-.15-1.49-.51-2.15" fill="white"/>
            </svg>
          </div>
        </div>

        <!-- Home button + Search Bar -->
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
          <button class="voice-btn" title="Busqueda por voz">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
            </svg>
          </button>
        </div>
        </div>

        <!-- Right Section -->
        <div class="header-right">
          <!-- Notifications -->
          <button class="notification-btn" title="Notificaciones">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
            </svg>
            <span class="notification-badge">2</span>
          </button>

          <!-- Help -->
          <button class="help-btn" title="Ayuda">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
            </svg>
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

    /* Logo SVG */
    .logo {
      flex-shrink: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
    }

    .logo-svg {
      height: 32px;
      width: auto;
    }

    /* Search group: home btn + search bar together */
    .search-group {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0 auto;
    }

    /* Home Button */
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

    /* Search */
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

    .voice-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: transparent;
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .voice-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .voice-btn svg {
      width: 18px;
      height: 18px;
    }

    /* Right Section */
    .header-right {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      justify-content: flex-end;
    }

    .notification-btn,
    .help-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: transparent;
      border: none;
      border-radius: 50%;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .notification-btn:hover,
    .help-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .notification-btn svg,
    .help-btn svg {
      width: 22px;
      height: 22px;
    }

    .notification-badge {
      position: absolute;
      top: 6px;
      right: 6px;
      min-width: 16px;
      height: 16px;
      background: var(--accent-orange, #F18800);
      color: white;
      font-size: 10px;
      font-weight: 600;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
    }

    /* User Section */
    .user-section {
      display: flex;
      align-items: center;
      gap: 12px;
      padding-left: 16px;
      margin-left: 8px;
      border-left: 1px solid rgba(255, 255, 255, 0.15);
      position: relative;
      cursor: pointer;
    }

    /* User Dropdown */
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

    /* Navigation - Gray background like reference */
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

  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }
}
