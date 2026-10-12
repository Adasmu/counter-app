import { Injectable, inject } from '@angular/core';
import { ToastController } from '@ionic/angular';

// User notifications are separate from the service that stores the data.
@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly controller = inject(ToastController);
  private currentToast: HTMLIonToastElement | null = null;

  async show(message: string, color: 'success' | 'danger' = 'success'): Promise<void> {
    try {
      await this.currentToast?.dismiss();
      this.currentToast = await this.controller.create({
        message,
        color,
        duration: 2400,
        position: 'bottom',
        buttons: [{ text: 'Zavřít', role: 'cancel' }],
      });
      await this.currentToast.present();
    } catch (error) {
      // A failed notification must not turn a successful data write into a failed save.
      console.error('Oznámení se nepodařilo zobrazit.', error);
    }
  }
}
