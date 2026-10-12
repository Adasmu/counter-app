import { Component } from '@angular/core';
import {
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { studentConfig } from '../config/student';

@Component({
  selector: 'app-tab3',
  imports: [IonCard, IonCardContent, IonContent, IonHeader, IonTitle, IonToolbar],
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
})
export class Tab3Page {
  readonly student = studentConfig;
}
