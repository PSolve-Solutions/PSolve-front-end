import { Component } from '@angular/core';
import { ForgetService } from '../services/forget.service';
import { FormGroup, FormControl, Validators,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ResponseHeader } from '../../../../shared/model/responseHeader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './forget.component.html',
  styleUrl: './forget.component.scss'
})
export class ForgetComponent {
  constructor(private serv : ForgetService,private router: Router ){

  }
  sub(){
this.found = false;
  }
  isLoading:boolean = false;
  found = false;
  emailForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });
find(email: any) {
  this.isLoading = true;
  this.found = false;
  
this.serv.otp(email.value).subscribe((d:ResponseHeader)=>{
 
  if(d.isSuccess){
    this.router.navigate(['/otp' , email.value]);
    this.isLoading = false;
  }
  else{
    
    this.found = true;
    this.isLoading = false;
  }
});
}

}
