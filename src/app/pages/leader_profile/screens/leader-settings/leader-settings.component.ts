import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ValidationProfileService } from '../../../../shared/services/validation-profile.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-leader-settings',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './leader-settings.component.html',
  styleUrl: './leader-settings.component.scss',
})
export class LeaderSettingsComponent implements OnInit {
  validationProfileService = inject(ValidationProfileService);
  router = inject(Router);
  fb = inject(FormBuilder);
  isEditEmail: boolean = false;
  isEditUsername: boolean = false;
  isEditPassword: boolean = false;
  isEditCodeforces: boolean = false;
  isEditVjudge: boolean = false;
  emailForm!: FormGroup;
  isSuccessEmail: boolean = true;
  msgEmail: string = '';
  usernameForm!: FormGroup;
  isSuccessUsername: boolean = true;
  msgUsername: string = '';
  passwordForm!: FormGroup;
  isSuccessPassword: boolean = false;
  msgPassword: string = '';
  codeforcesForm!: FormGroup;
  isSuccessCodeforces: boolean = true;
  msgCodeforces: string = '';
  vjudgeForm!: FormGroup;
  isSuccessVjudge: boolean = true;
  msgVjudge: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  errorMessages: any = [];
  passwordFieldType1: string = 'password';
  passwordFieldType2: string = 'password';
  passwordFieldType3: string = 'password';
  password: string = '';
  currentPath: string = '';
  ngOnInit() {
    this.currentPath = this.router.url;
    this.getGeneralProfile();
    this.emailForm = this.fb.group({
      email: ['', Validators.required],
    });
    this.usernameForm = this.fb.group({
      username: ['', Validators.required],
    });
    this.passwordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
    this.codeforcesForm = this.fb.group({
      codeforces: ['', Validators.required],
    });
    this.vjudgeForm = this.fb.group({
      vjudge: [''],
    });
  }
  getGeneralProfile(): void {
    this.isLoading = true;
    this.validationProfileService.accountInfo().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.emailForm.patchValue({
            email: data.email,
          });
          this.usernameForm.patchValue({
            username: data.userName,
          });
          this.codeforcesForm.patchValue({
            codeforces: data.codeForceHandle,
          });
          this.vjudgeForm.patchValue({
            vjudge: data.vjudgeHandle,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }
  toggleEditMode(type: string) {
    if (type === 'email') {
      this.isEditEmail = !this.isEditEmail;
      if (this.isEditEmail) {
        this.emailForm.enable();
      } else {
        this.emailForm.disable();
        this.msgEmail = '';
        this.getGeneralProfile();
      }
    } else if (type === 'username') {
      this.isEditUsername = !this.isEditUsername;
      if (this.isEditUsername) {
        this.usernameForm.enable();
      } else {
        this.usernameForm.disable();
        this.msgUsername = '';
        this.getGeneralProfile();
      }
    } else if (type === 'password') {
      this.isEditPassword = !this.isEditPassword;
      if (this.isEditPassword) {
        this.passwordForm.enable();
      } else {
        this.passwordForm.disable();
        this.msgPassword = '';
        this.getGeneralProfile();
      }
    } else if (type === 'codeforces') {
      this.isEditCodeforces = !this.isEditCodeforces;
      if (this.isEditCodeforces) {
        this.codeforcesForm.enable();
      } else {
        this.codeforcesForm.disable();
        this.msgCodeforces = '';
        this.getGeneralProfile();
      }
    } else {
      this.isEditVjudge = !this.isEditVjudge;
      if (this.isEditVjudge) {
        this.vjudgeForm.enable();
      } else {
        this.vjudgeForm.disable();
        this.msgVjudge = '';
        this.getGeneralProfile();
      }
    }
  }
  vaildationEmail(): void {
    let email = this.emailForm.get('email')?.value;
    if (email) {
      this.validationProfileService.validateEmail(email).subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.isSuccessEmail = true;
            this.msgEmail = message;
          } else {
            this.isSuccessEmail = false;
            this.msgEmail = message;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.msgEmail = '';
    }
  }
  updateEmail(event: Event) {
    event.preventDefault();
    if (this.emailForm.invalid || !this.isSuccessEmail) {
      return;
    }
    this.isLoading = true;
    this.validationProfileService
      .updateEmail(this.emailForm.value.email)
      .subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.isLoading = false;
            this.successMessage = message;
            this.isEditEmail = false;
            this.msgEmail = '';
          } else if (statusCode === 400) {
            this.isLoading = false;
            this.errorMessage = message;
            this.isLoading = false;
          } else {
            this.handleApiErrors(errors);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
  // username
  vaildationUsername(): void {
    let username = this.usernameForm.get('username')?.value;
    if (username) {
      this.validationProfileService.validateUsername(username).subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.isSuccessUsername = true;
            this.msgUsername = message;
          } else {
            this.isSuccessUsername = false;
            this.msgUsername = message;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.msgUsername = '';
    }
  }
  updateUsername() {
    if (this.usernameForm.invalid || !this.isSuccessUsername) {
      return;
    }
    this.isLoading = true;
    this.validationProfileService
      .updateUsername(this.usernameForm.value.username)
      .subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.isLoading = false;
            this.successMessage = message;
            this.isEditUsername = false;
            this.msgUsername = '';
          } else if (statusCode === 400) {
            this.isLoading = false;
            this.errorMessage = message;
            this.isLoading = false;
          } else {
            this.handleApiErrors(errors);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
  //password
  togglePasswordVisibility(num: number): void {
    if (num == 1) {
      this.passwordFieldType1 =
        this.passwordFieldType1 === 'password' ? 'text' : 'password';
    }
    if (num == 2) {
      this.passwordFieldType2 =
        this.passwordFieldType2 === 'password' ? 'text' : 'password';
    }
    if (num == 3) {
      this.passwordFieldType3 =
        this.passwordFieldType3 === 'password' ? 'text' : 'password';
    }
  }
  matchPassword(): void {
    const confirmPassword = this.passwordForm.get('confirmPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    if (confirmPassword.length < 6) {
      this.msgPassword = 'Password must be 6 characters minimum';
      this.isSuccessPassword = false;
    } else if (newPassword !== confirmPassword) {
      this.msgPassword = 'The two passwords must be matched';
      this.isSuccessPassword = false;
    } else {
      this.isSuccessPassword = true;
      this.msgPassword = 'Password is valid';
    }
  }
  updatePassword(): void {
    this.isLoading = true;
    if (this.passwordForm.invalid || !this.isSuccessPassword) {
      return;
    }
    this.validationProfileService
      .updatePassword(this.passwordForm.value)
      .subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.isLoading = false;
            this.errorMessage = '';
            this.successMessage = message;
            this.isEditPassword = false;
            this.emailForm.reset();
            this.msgPassword = '';
          } else if (statusCode === 400) {
            this.successMessage = '';
            this.errorMessage = message;
            this.msgPassword = message;
            this.isSuccessPassword = false;
            this.isLoading = false;
          } else {
            this.handleApiErrors(errors);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
  // codeforces
  vaildationCodeforces(): void {
    let codeforces = this.codeforcesForm.get('codeforces')?.value;
    if (codeforces) {
      this.validationProfileService
        .validateCodeForcesHandle(codeforces)
        .subscribe({
          next: ({ statusCode, message }) => {
            if (statusCode === 200) {
              this.isSuccessCodeforces = true;
              this.msgCodeforces = message;
            } else {
              this.isSuccessCodeforces = false;
              this.msgCodeforces = message;
            }
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.msgCodeforces = '';
    }
  }
  updateCodeForces() {
    if (this.codeforcesForm.invalid || !this.isSuccessCodeforces) {
      return;
    }
    this.isLoading = true;
    this.validationProfileService
      .updateCodeforceHandle(this.codeforcesForm.value.codeforces)
      .subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.isLoading = false;
            this.successMessage = message;
            this.isEditCodeforces = false;
            this.msgCodeforces = '';
          } else if (statusCode === 400) {
            this.errorMessage = message;
            this.isLoading = false;
          } else {
            this.handleApiErrors(errors);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
  // vjudge
  vaildationVjudge(): void {
    let vjudge = this.vjudgeForm.get('vjudge')?.value;
    if (vjudge) {
      this.validationProfileService.validateVjudgeHandle(vjudge).subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.isSuccessVjudge = true;
            this.msgVjudge = message;
          } else {
            this.isSuccessVjudge = false;
            this.msgVjudge = message;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.msgVjudge = '';
    }
  }
  updateVjudge() {
    if (this.vjudgeForm.invalid || !this.isSuccessVjudge) {
      return;
    }
    this.isLoading = true;
    this.validationProfileService
      .updateVjudgeHandle(this.vjudgeForm.value.vjudge)
      .subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.isLoading = false;
            this.successMessage = message;
            this.isEditVjudge = false;
            this.msgVjudge = '';
          } else if (statusCode === 400) {
            this.errorMessage = message;
            this.isLoading = false;
          } else {
            this.handleApiErrors(errors);
            this.isLoading = false;
          }
        },
        error: (err) => {
          console.log(err);
          this.isLoading = false;
        },
      });
  }
  removeErrorM() {
    this.errorMessage = '';
    this.successMessage = '';
  }
  removeError(index: number) {
    this.errorMessages.splice(index, 1);
  }
  handleApiErrors(errors: any) {
    this.errorMessages = [];
    if (errors) {
      this.errorMessages = errors;
    } else {
      this.errorMessages.push(
        'An unknown error occurred. Please try again later.'
      );
    }
    this.errorMessages.forEach((index: number) => {
      setTimeout(() => {
        this.errorMessages.splice(index, 1);
      }, 3000);
    });
  }
}
