import { Component } from '@angular/core';
import { TopBarComponent } from "../layout_public/components/top-bar/top-bar.component";
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/footer/footer.component";

@Component({
  selector: 'app-layout-public',
  standalone: true,
  imports: [TopBarComponent, RouterOutlet, FooterComponent],
  templateUrl: './layout-public.component.html',
  styleUrl: './layout-public.component.scss'
})
export class LayoutPublicComponent{



}
