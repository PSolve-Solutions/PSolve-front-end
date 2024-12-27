import { Component } from '@angular/core';
import { AttendanceService } from '../services/attendance.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
import { MentorHeaderComponent } from '../../../layouts/mentor/mentor-header/mentor-header.component';

@Component({
  selector: 'app-attendance',
  standalone: true,
  imports: [CommonModule,MentorHeaderComponent],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  isLoading:boolean = false;
constructor(private serv :AttendanceService){
  if(localStorage.getItem("camp")){
    this.att(Number(localStorage.getItem("camp")));
  }

}
atten:any = null;
att(id:any){
  this.isLoading = true
  this.serv.getData(id).subscribe((d:ResponseHeader)=>{
    this.atten = d.data;
    this.isLoading = false
  })
}
}
