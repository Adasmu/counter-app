import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCs from '@angular/common/locales/cs';
import { provideIonicAngular } from '@ionic/angular';

registerLocaleData(localeCs);
export default [provideIonicAngular({ animated: false }), { provide: LOCALE_ID, useValue: 'cs-CZ' }];
