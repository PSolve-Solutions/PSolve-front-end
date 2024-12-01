import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { SetpassService } from '../services/setpass.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseHeader } from '../../../../shared/model/responseHeader';

@Component({
  selector: 'app-setpass',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './setpass.component.html',
  styleUrl: './setpass.component.scss'
})
export class SetpassComponent {
email : any;
token:any;
isLoading: boolean = false;
  constructor (private serv :SetpassService,private route: ActivatedRoute,private router: Router){

  }
  ngOnInit() {
    this.email = this.route.snapshot.paramMap.get('email');
    this.token = this.route.snapshot.paramMap.get('token');
  }
  passwordForm = new FormGroup(
    {
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordsMatchValidator() } // Call the validator function here
  );

  get password() {
    return this.passwordForm.get('password');
  }

  get confirmPassword() {
    return this.passwordForm.get('confirmPassword');
  }

  // Custom Validator Function for Matching Passwords
  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      return password === confirmPassword ? null : { passwordMismatch: true };
    };
  }
  error:boolean = false; 
  err:any[]=[];
  onSubmit() {
    this.isLoading = true;
    if (this.passwordForm.valid) {
      // Handle the form submission logic here
      const inputElement = document.getElementById('pass') as HTMLInputElement;
     let  data = {
      "password": inputElement.value,
      "token": this.token,
      "email": this.email
    }
    this.serv.reset(data).subscribe((d:ResponseHeader)=>{
      if(d.isSuccess){
        this.router.navigate(['/login' ]);
        this.isLoading = false;
      }
      else{
        this.error = true;
        this.err = [];
        for (const field in d.errors) {

          if (d.errors.hasOwnProperty(field)) {
            this.err.push(`${field}: ${d.errors[field].join(', ')}`);
          }
        }
      }
      this.isLoading = false;
    })
    }
    else{
      this.isLoading = false;
    }
  }
}
