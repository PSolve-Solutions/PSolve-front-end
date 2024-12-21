import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-founder-child',
  standalone: true,
  imports: [CommonModule,NgOptimizedImage],
  templateUrl: './founder.child.component.html',
  styleUrls: ['./founder.child.component.scss']
})
export class FounderChildComponent {

  @Input() founderData!: any; // Input property



  openUrl(link:any):void{

    window.open(link,"_blank")

  }


}
