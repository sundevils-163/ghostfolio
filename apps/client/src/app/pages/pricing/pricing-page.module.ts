import { GfPremiumIndicatorComponent } from '@ghostfolio/ui/premium-indicator';

import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { IonIcon } from '@ionic/angular/standalone';

import { PricingPageRoutingModule } from './pricing-page-routing.module';
import { PricingPageComponent } from './pricing-page.component';

@NgModule({
  declarations: [PricingPageComponent],
  imports: [
    CommonModule,
    GfPremiumIndicatorComponent,
    IonIcon,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    PricingPageRoutingModule,
    RouterModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PricingPageModule {}
