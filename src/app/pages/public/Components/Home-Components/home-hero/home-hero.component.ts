import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ResponsiveService } from '../../../Services/responsive.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home-hero',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './home-hero.component.html',
  styleUrls: ['./home-hero.component.scss']
})
export class HomeHeroComponent {
  letters: string[] = 'problemsolving'.split('');
   public responsive = inject(ResponsiveService);


    ngOnInit(): void {
      this.responsive.start()
    }

    ngOnDestroy(): void {
      this.responsive.destroy()
    }
}
