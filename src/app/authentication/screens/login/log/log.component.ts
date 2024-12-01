import { RouterOutlet } from '@angular/router';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-log',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './log.component.html',
  styleUrl: './log.component.scss',
})
export class LogComponent {
  authService = inject(AuthService);
  router = inject(Router);
  formBuilder = inject(FormBuilder);
  loginForm!: FormGroup;
  submitted = false;
  error: string = '';
  userData: boolean = false;
  isLoading: boolean = false;
  passwordFieldType: string = 'password';
  password: string = '';

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      userName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  togglePasswordVisibility(): void {
    this.passwordFieldType =
      this.passwordFieldType === 'password' ? 'text' : 'password';
  }

  onLogin() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    debugger;
    this.isLoading = true;
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: ({ statusCode, data, message }) => {
        if (statusCode === 200) {
          if (data.roles[0] === 'Leader') {
            this.router.navigate(['/leader']);
          } else if (data.roles[0] === 'Mentor') {
            this.router.navigateByUrl('/mentor');
          } else if (data.roles[0] === 'Head_Of_Camp') {
            this.router.navigateByUrl('/head_of_camp');
          } else if (data.roles[0] === 'Trainee') {
            this.router.navigateByUrl('/trainee');
          } else if (data.roles[0] === 'Admin') {
            this.router.navigateByUrl('/psovle');
          } else {
            this.router.navigate(['/']);
          }
          this.isLoading = false;
          this.authService.setIsAuth(true);
        } else {
          this.isLoading = false;
          this.userData = true;

          this.error = message;
          this.authService.setIsAuth(false);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }
}
