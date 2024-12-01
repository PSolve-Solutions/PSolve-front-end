import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OtpService } from '../services/otp.service';
import { ResponseHeader } from '../../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
import { ForgetService } from '../services/forget.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './otp.component.html',
  styleUrl: './otp.component.scss'
})
export class OtpComponent {
resend() {
  this.isLoading = true;
this.srv.otp(this.email).subscribe((d:ResponseHeader)=>{
  if(d.isSuccess){
    alert('OTP send successfully');
    this.isLoading = false;
  }
  else{
    alert('Something went wrong');
    this.isLoading = false;
  }
})
}
  email: any;
  isLoading:boolean = false;
  len:boolean = false;
  constructor(private route: ActivatedRoute, private serv :OtpService,private router: Router, private srv:ForgetService) {}
check = false;
  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
  }
  moveToNext(event: KeyboardEvent, nextInput: HTMLInputElement | null): void {
    // Check if the key pressed is Enter or any other key you want to trigger the move
  
      const input = event.target as HTMLInputElement;
      const max = 9;
      
      if (parseInt(input.value, 9) > max ) {
        
        input.value = max.toString(); // Optionally reset to max value
      }
      else if(parseInt(input.value, 0) < 0){
        input.value = '0'.toString();
      }
    
      // Focus on the next input if it exists
      if (/^[0-9]$/.test(event.key)  ){
        nextInput?.focus();
        
      }
    
  }
  get(email:any , otp:string){
    this.isLoading = true;
    if(otp.length == 4){
      this.len = false;
      this.serv.getData(email , otp).subscribe((d:ResponseHeader)=>{
        if(d.isSuccess){
          this.router.navigate(['/login/set', d.data , email  ])
          this.isLoading = false;
        }
        else{
          this.check = true;
          

          this.isLoading = false;
        }
      })
    }
    else{
      this.isLoading = false;
      this.len = true;
    }
  }
  empty(inp : HTMLInputElement){
    inp.value = ''
  }
}
