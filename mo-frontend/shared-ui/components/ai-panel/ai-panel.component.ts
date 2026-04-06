import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  ElementRef,
  viewChild,
  effect,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AiPanelService } from '../../services/ai-panel.service';

@Component({
  selector: 'app-ai-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Panel — no backdrop, page stays interactive -->
    <div
      class="ai-panel"
      [class.ai-panel-open]="panelService.isOpen()"
      [style.width.px]="panelWidth()"
    >
      <!-- Resize handle -->
      <div
        class="ai-resize-handle"
        (mousedown)="startResize($event)"
      >
        <div class="ai-resize-grip">
          <span class="grip-dot"></span>
          <span class="grip-dot"></span>
          <span class="grip-dot"></span>
        </div>
      </div>

      <!-- Header -->
      <div class="ai-panel-header">
        <div class="ai-panel-header-left">
          <div class="ai-avatar">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="url(#panel-star)"/>
              <defs>
                <linearGradient id="panel-star" x1="2" y1="2" x2="22" y2="22">
                  <stop offset="0%" stop-color="#F18800"/>
                  <stop offset="100%" stop-color="#FF6B00"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div class="ai-panel-title">
            <span class="ai-panel-name">Maxirest AI</span>
            <span class="ai-panel-status">
              <span class="status-dot"></span>
              Online
            </span>
          </div>
        </div>
        <div class="ai-panel-header-actions">
          <button class="ai-header-btn" title="Limpiar chat" (click)="clearChat()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="16" height="16">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
          <button class="ai-header-btn" (click)="panelService.close()">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" width="18" height="18">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Messages -->
      <div class="ai-panel-messages" #messagesContainer>
        @for (msg of panelService.messages(); track msg.id) {
          <div class="ai-msg" [class.ai-msg-user]="msg.role === 'user'" [class.ai-msg-assistant]="msg.role === 'assistant'">
            @if (msg.role === 'assistant') {
              <div class="ai-msg-avatar">
                <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                  <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="#F18800"/>
                </svg>
              </div>
            }
            <div class="ai-msg-bubble" [innerHTML]="formatMessage(msg.content)"></div>
          </div>
        }

        @if (panelService.isTyping()) {
          <div class="ai-msg ai-msg-assistant">
            <div class="ai-msg-avatar">
              <svg viewBox="0 0 24 24" fill="none" width="14" height="14">
                <path d="M12 2L13.09 8.26L18 6L14.74 10.91L21 12L14.74 13.09L18 18L13.09 15.74L12 22L10.91 15.74L6 18L9.26 13.09L3 12L9.26 10.91L6 6L10.91 8.26L12 2Z" fill="#F18800"/>
              </svg>
            </div>
            <div class="ai-msg-bubble ai-typing">
              <span class="dot"></span>
              <span class="dot"></span>
              <span class="dot"></span>
            </div>
          </div>
        }
      </div>

      <!-- Quick suggestions (only on welcome) -->
      @if (panelService.messages().length <= 1 && !panelService.isTyping()) {
        <div class="ai-suggestions">
          @for (s of suggestions; track s.label) {
            <button class="ai-chip" (click)="useSuggestion(s)">
              <span class="chip-icon">{{ s.icon }}</span>
              {{ s.label }}
            </button>
          }
        </div>
      }

      <!-- Input -->
      <div class="ai-panel-input">
        <div class="ai-input-row">
          <input
            #inputEl
            type="text"
            placeholder="Preguntale algo a la IA..."
            class="ai-input"
            [value]="inputValue()"
            (input)="onInput($event)"
            (keydown.enter)="send()"
          />
          <button
            class="ai-send-btn"
            [class.active]="inputValue().trim().length > 0"
            [disabled]="!inputValue().trim() || panelService.isTyping()"
            (click)="send()"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
              <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
            </svg>
          </button>
        </div>
        <span class="ai-disclaimer">Maxirest AI puede cometer errores. Verificá la información.</span>
      </div>
    </div>
  `,
  styles: [`
    /* Panel — fixed right, no backdrop */
    .ai-panel {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 380px;
      min-width: 300px;
      max-width: 700px;
      background: #FFFFFF;
      z-index: 999;
      display: flex;
      flex-direction: column;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: -4px 0 24px rgba(0, 0, 0, 0.08), -1px 0 0 rgba(0, 0, 0, 0.06);
    }

    .ai-panel-open {
      transform: translateX(0);
    }

    /* Resize handle */
    .ai-resize-handle {
      position: absolute;
      top: 0;
      left: -4px;
      bottom: 0;
      width: 8px;
      cursor: col-resize;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ai-resize-handle:hover .ai-resize-grip,
    .ai-resize-handle:active .ai-resize-grip {
      opacity: 1;
    }

    .ai-resize-grip {
      display: flex;
      flex-direction: column;
      gap: 3px;
      padding: 8px 2px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.04);
      opacity: 0;
      transition: opacity 0.15s ease;
    }

    .ai-resize-handle:hover .ai-resize-grip {
      background: rgba(0, 0, 0, 0.08);
    }

    .grip-dot {
      width: 3px;
      height: 3px;
      border-radius: 50%;
      background: #94A3B8;
    }

    /* Header */
    .ai-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px;
      background: linear-gradient(135deg, #01033E, #0A0D52);
      flex-shrink: 0;
    }

    .ai-panel-header-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .ai-avatar {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: rgba(241, 136, 0, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ai-avatar svg {
      width: 18px;
      height: 18px;
    }

    .ai-panel-title {
      display: flex;
      flex-direction: column;
      gap: 1px;
    }

    .ai-panel-name {
      font-size: 14px;
      font-weight: 600;
      color: #FFFFFF;
    }

    .ai-panel-status {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);
    }

    .status-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: #22C55E;
      animation: pulse 2.5s ease infinite;
    }

    .ai-panel-header-actions {
      display: flex;
      gap: 2px;
    }

    .ai-header-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      border: none;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ai-header-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: white;
    }

    /* Messages */
    .ai-panel-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      scroll-behavior: smooth;
    }

    .ai-panel-messages::-webkit-scrollbar { width: 4px; }
    .ai-panel-messages::-webkit-scrollbar-track { background: transparent; }
    .ai-panel-messages::-webkit-scrollbar-thumb { background: #E2E8F0; border-radius: 10px; }

    .ai-msg {
      display: flex;
      gap: 8px;
      max-width: 94%;
      animation: msgIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .ai-msg-user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .ai-msg-avatar {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: #FFF3E0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-top: 2px;
    }

    .ai-msg-bubble {
      padding: 10px 14px;
      border-radius: 14px;
      font-size: 13px;
      line-height: 1.55;
      color: #1F2937;
    }

    .ai-msg-assistant .ai-msg-bubble {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-top-left-radius: 4px;
    }

    .ai-msg-user .ai-msg-bubble {
      background: #01033E;
      color: #FFFFFF;
      border-top-right-radius: 4px;
    }

    .ai-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 12px 18px;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #94A3B8;
      animation: bounce 1.4s ease-in-out infinite;
    }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }

    /* Suggestions */
    .ai-suggestions {
      padding: 0 16px 12px;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      flex-shrink: 0;
    }

    .ai-chip {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 6px 12px;
      border: 1px solid #E2E8F0;
      border-radius: 18px;
      background: #FFFFFF;
      color: #475569;
      font-size: 12px;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.12s ease;
      white-space: nowrap;
    }

    .ai-chip:hover {
      border-color: #F18800;
      color: #F18800;
      background: #FFFBF5;
    }

    .chip-icon {
      font-size: 13px;
    }

    /* Input */
    .ai-panel-input {
      padding: 12px 16px;
      border-top: 1px solid #E2E8F0;
      flex-shrink: 0;
    }

    .ai-input-row {
      display: flex;
      align-items: center;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 10px;
      padding: 3px 3px 3px 14px;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .ai-input-row:focus-within {
      border-color: #F18800;
      box-shadow: 0 0 0 2px rgba(241, 136, 0, 0.08);
    }

    .ai-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-size: 13px;
      font-family: inherit;
      color: #1F2937;
      padding: 7px 0;
    }

    .ai-input::placeholder { color: #94A3B8; }

    .ai-send-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 8px;
      background: #E2E8F0;
      color: #94A3B8;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
      flex-shrink: 0;
    }

    .ai-send-btn.active {
      background: #F18800;
      color: white;
    }

    .ai-send-btn.active:hover {
      background: #D97800;
    }

    .ai-send-btn:disabled { cursor: default; }

    .ai-disclaimer {
      display: block;
      text-align: center;
      font-size: 10px;
      color: #94A3B8;
      margin-top: 6px;
    }

    /* Animations */
    @keyframes msgIn {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes bounce {
      0%, 60%, 100% { transform: translateY(0); }
      30% { transform: translateY(-3px); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    /* Responsive */
    @media (max-width: 480px) {
      .ai-panel {
        min-width: unset;
        max-width: unset;
        width: 100vw !important;
      }
      .ai-resize-handle { display: none; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AiPanelComponent {
  readonly panelService = inject(AiPanelService);
  readonly inputValue = signal('');
  readonly panelWidth = signal(380);

  readonly messagesContainer = viewChild<ElementRef<HTMLDivElement>>('messagesContainer');
  readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private resizing = false;

  readonly suggestions = [
    { icon: '📊', label: 'Ventas del día' },
    { icon: '📦', label: 'Cargar stock' },
    { icon: '🍽️', label: 'Abrir turno POS' },
    { icon: '📋', label: 'Editar menú' },
    { icon: '🧾', label: 'Ver facturas' },
    { icon: '⚙️', label: 'Configurar negocio' },
  ];

  constructor() {
    effect(() => {
      const msgs = this.panelService.messages();
      const typing = this.panelService.isTyping();
      if (msgs.length > 0 || typing) {
        setTimeout(() => this.scrollToBottom(), 50);
      }
    });

    effect(() => {
      if (this.panelService.isOpen()) {
        setTimeout(() => this.inputEl()?.nativeElement.focus(), 300);
      }
    });
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.panelService.isOpen()) {
      this.panelService.close();
    }
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (!this.resizing) return;
    const newWidth = window.innerWidth - e.clientX;
    const clamped = Math.max(300, Math.min(700, newWidth));
    this.panelWidth.set(clamped);
  }

  @HostListener('document:mouseup')
  onMouseUp(): void {
    if (this.resizing) {
      this.resizing = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
  }

  startResize(e: MouseEvent): void {
    e.preventDefault();
    this.resizing = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }

  onInput(event: Event): void {
    this.inputValue.set((event.target as HTMLInputElement).value);
  }

  send(): void {
    const val = this.inputValue();
    if (!val.trim() || this.panelService.isTyping()) return;
    this.panelService.sendMessage(val);
    this.inputValue.set('');
    const el = this.inputEl()?.nativeElement;
    if (el) el.value = '';
  }

  useSuggestion(s: { icon: string; label: string }): void {
    this.panelService.sendMessage(s.label);
  }

  clearChat(): void {
    this.panelService.clearChat();
  }

  formatMessage(content: string): string {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br>')
      .replace(/• /g, '<span style="color:#F18800;margin-right:4px">•</span> ');
  }

  private scrollToBottom(): void {
    const container = this.messagesContainer()?.nativeElement;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }
}
