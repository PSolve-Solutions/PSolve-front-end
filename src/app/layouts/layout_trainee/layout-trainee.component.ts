import { Component, inject, OnDestroy } from '@angular/core';
import { TopBarComponent } from "./components/top-bar/top-bar.component";
import { RouterOutlet } from '@angular/router';
import { ResponsiveService } from '../../pages/Trainee/Services/responsive.service';

@Component({
  selector: 'app-layout-trainee',
  standalone: true,
  imports: [TopBarComponent,RouterOutlet],
  templateUrl: './layout-trainee.component.html',
  styleUrl: './layout-trainee.component.scss'
})
export class LayoutTraineeComponent implements OnDestroy {
  responsive = inject(ResponsiveService);

  ngOnInit(): void {
    this.responsive.start()
  }

  ngOnDestroy(): void {
    this.responsive.destroy()
  }

}
