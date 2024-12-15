import { Component } from '@angular/core';
import { MentorHeaderComponent } from '../../../layouts/mentor/mentor-header/mentor-header.component';
import { TrackingService } from '../services/tracking.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-tracking',
  standalone: true,
  imports: [MentorHeaderComponent,CommonModule],
  templateUrl: './tracking.component.html',
  styleUrl: './tracking.component.scss'
})
export class TrackingComponent {
  isLoading: boolean = true;
constructor (private serv:TrackingService){
this.get(this.id);
}
curr: any = {};
sheet: any = {};
contest: any = {};
id = localStorage.getItem("camp") || null;
  get(id:any){
    this.isLoading = true
    if(id != null){
      
      this.serv.getSheet(id).subscribe((d:ResponseHeader)=>{
        this.sheet = d.data;
        
        this.isLoading = false
      });
      
      
    }
    else{
      this.isLoading = false;
    }
  }
  con:boolean = false;
  sh:boolean = true;
  she(){
    this.isLoading = true
    let e = document.getElementById('contest');
    let e1 = document.getElementById('she');
    let a = document.getElementById('sheet');
    let a1 = document.getElementById('cont');
    this.con = false;
    this.sh = true;
    e1?.classList.add('bg-[#2A8E9E]', 'text-white');
    e1?.classList.remove('border', 'text-[#2A8E9E]', 'border-[#2A8E9E]');
    a1?.classList.remove('bg-[#2A8E9E]', 'text-white');
    a1?.classList.add('border', 'text-[#2A8E9E]', 'border-[#2A8E9E]');
    
    this.isLoading = false
  }
  conte:boolean = true;
   getCont(){
    this.isLoading = true
    if(this.id != null && this.conte){
      this.serv.getContest(this.id).subscribe((d:ResponseHeader)=>{
        this.contest = d.data;
        this.conte = false;
        this.isLoading = false;
      });    
    }
    else{
      this.isLoading = false;
    }
   }
  cont(){
    
    
      this.getCont();
      
    
    let e = document.getElementById('sheet');
    let e1 = document.getElementById('cont');
    let a = document.getElementById('contest');
    let a1 = document.getElementById('she');
   
    e1?.classList.add('bg-[#2A8E9E]', 'text-white');
    e1?.classList.remove('border', 'text-[#2A8E9E]', 'border-[#2A8E9E]');
    a1?.classList.remove('bg-[#2A8E9E]', 'text-white');
    a1?.classList.add('border', 'text-[#2A8E9E]', 'border-[#2A8E9E]');
    this.con = true;
    this.sh = false;
    
  }
}
