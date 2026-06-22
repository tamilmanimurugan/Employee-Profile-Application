import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts$ = new Subject<Toast>();

  success(message: string): void { this.emit(message, 'success'); }
  error(message: string):   void { this.emit(message, 'error');   }
  warning(message: string): void { this.emit(message, 'warning'); }
  info(message: string):    void { this.emit(message, 'info');    }

  private emit(message: string, type: Toast['type']): void {
    this.toasts$.next({ id: ++this.counter, message, type });
  }
}
