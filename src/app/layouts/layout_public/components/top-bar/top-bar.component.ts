import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ResponsiveService } from '../../../../pages/Trainee/Services/responsive.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.scss'
})
export class TopBarComponent {

  public responsive = inject(ResponsiveService);


  ngOnInit(): void {
    this.responsive.start()
  }

  ngOnDestroy(): void {
    this.responsive.destroy()
  }



}
