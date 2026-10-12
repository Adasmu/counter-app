import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAlert, IonButton, IonCard, IonCardContent, IonContent, IonHeader,
  IonItem, IonLabel, IonList, IonNote, IonSearchbar, IonSelect,
  IonSelectOption, IonSpinner, IonTitle, IonToolbar,
} from '@ionic/angular';
import { SORT_ORDERS, SortOrder } from '../models/history-options';
import { CounterService } from '../services/counter.service';
import { FeedbackService } from '../services/feedback.service';
import { selectCounters } from '../utils/history';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe, DecimalPipe, FormsModule, IonAlert, IonButton, IonCard, IonCardContent,
    IonContent, IonHeader, IonItem, IonLabel, IonList, IonNote, IonSearchbar,
    IonSelect, IonSelectOption, IonSpinner, IonTitle, IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);
  private readonly feedback = inject(FeedbackService);
  readonly search = signal('');
  readonly sortOrder = signal<SortOrder>('newest');
  readonly busy = signal(false);
  readonly alertOpen = signal(false);
  readonly alertButtons = [
    { text: 'Zrušit', role: 'cancel' },
    { text: 'Vymazat vše', role: 'confirm' },
  ];
  // The total always includes ALL saved counters, even when a search is active.
  readonly total = computed(() => this.counterService.counters().reduce((sum, item) => sum + item.value, 0));
  readonly visibleCounters = computed(() => selectCounters(
    this.counterService.counters(), this.search(), this.sortOrder(),
  ));

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  setSortOrder(value: unknown): void {
    if (typeof value === 'string' && SORT_ORDERS.includes(value as SortOrder)) {
      this.sortOrder.set(value as SortOrder);
    }
  }

  requestClear(): void {
    if (!this.busy() && this.counterService.initialized()) this.alertOpen.set(true);
  }

  async confirmClear(role: string | undefined): Promise<void> {
    this.alertOpen.set(false);
    if (role === 'confirm') await this.clear();
  }

  async remove(id: string): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.counterService.remove(id);
      await this.feedback.show('Záznam byl odstraněn.');
    } catch (error) {
      console.error('Odstranění se nezdařilo.', error);
      await this.feedback.show('Záznam se nepodařilo odstranit.', 'danger');
    } finally {
      this.busy.set(false);
    }
  }

  private async clear(): Promise<void> {
    if (this.busy()) return;
    this.busy.set(true);
    try {
      await this.counterService.clear();
      await this.feedback.show('Celá historie byla vymazána.');
    } catch (error) {
      console.error('Vymazání historie se nezdařilo.', error);
      await this.feedback.show('Historii se nepodařilo vymazat.', 'danger');
    } finally {
      this.busy.set(false);
    }
  }
}
