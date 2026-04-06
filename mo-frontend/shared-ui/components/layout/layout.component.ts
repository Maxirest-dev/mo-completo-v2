import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { AiPanelComponent } from '../ai-panel/ai-panel.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, AiPanelComponent],
  template: `
    <div class="layout">
      <app-header />
      <main class="main-content">
        <router-outlet />
      </main>
      <app-ai-panel />
    </div>
  `,
  styles: [`
    .layout {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      background-color: var(--bg-secondary, #F8FAFC);
    }

    .main-content {
      flex: 1;
      padding: 32px;
      max-width: 1440px;
      margin: 0 auto;
      width: 100%;
      overflow-y: auto;
    }

    @media (max-width: 768px) {
      .main-content {
        padding: 16px;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {}
