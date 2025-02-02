import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { CampsHeroComponent } from '../../Components/camps-components/hero/camps-hero.component';
import { CardsComponent } from '../../Components/camps-components/cards/cards.component';
import { CarouselComponent } from '../../Components/camps-components/carousel/carousel.component';
import { IncomingCardsComponent } from '../../Components/camps-components/incoming-cards/incoming-cards.component';
declare var $: any;
@Component({
  selector: 'app-camps-public',
  standalone: true,
  imports: [
    CampsHeroComponent,
    CardsComponent,
    CarouselComponent,
    IncomingCardsComponent,
  ],
  templateUrl: './camps-public.component.html',
  styleUrls: ['./camps-public.component.scss'],
})
export class CampsPublicComponent {}
