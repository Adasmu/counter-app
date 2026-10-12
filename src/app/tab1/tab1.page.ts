import { Component, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { FeedbackService } from '../services/feedback.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CounterComponent, IonContent, IonHeader, IonTitle, IonToolbar],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);
  private readonly feedback = inject(FeedbackService);
  readonly saving = signal(false);

  async onSaved(counter: SavedCounter): Promise<void> {
    if (this.saving()) return;
    this.saving.set(true);
    try {
      await this.counterService.add(counter);
      await this.feedback.show('Počítadlo bylo uloženo.');
    } catch (error) {
      console.error('Uložení se nezdařilo.', error);
      await this.feedback.show('Počítadlo se nepodařilo uložit.', 'danger');
    } finally {
      this.saving.set(false);
    }
  }
}
