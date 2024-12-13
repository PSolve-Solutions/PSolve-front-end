import { CommonModule } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RegisterationService } from '../../../pages/public/Services/registeration.service';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';

type RequiredFields = {
  isRequiredTraineeNationalId: boolean;
  isRequiredTraineePhoneNumber: boolean;
  isOnSite: boolean;
  isRequiredCodeforce: boolean;
  isRequiredVjudge: boolean;
};

@Component({
  selector: 'app-registration-trainee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registration-trainee.component.html',
  styleUrl: './registration-trainee.component.scss',
})
export class RegistrationTraineeComponent implements OnInit {
  registerationService = inject(RegisterationService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);
  registrationForm!: FormGroup;
  superTab: number = 1;
  currentTab: number = 1;
  isDropdownOrganization: boolean = false;
  selectedOrganization: {
    id: string;
    clientName: string;
    logoUrl: string;
  } | null = null;
  allCommunities: { id: string; clientName: string; logoUrl: string }[] = [];
  communityId: string = '';
  isDropdownCamp: boolean = false;
  campName: string = '';
  allCamps: { id: number; name: string }[] = [];
  isDropdownHas: boolean = false;
  hasLab: string = '';
  allUniversity: { name: string }[] = [];
  isDropdownUniversity: boolean = false;
  universityName: string = '';
  allUCollege: { id: number; name: string }[] = [];
  isDropdownCollege: boolean = false;
  collegeName: string = '';
  profileImageName: string = '';
  grade: number = 0;
  isDropdownGrade: boolean = false;
  isDropdownGender: boolean = false;
  gender: string = '';
  isLoading: boolean = false;
  showLoader: boolean = false;
  isCheckNationalId: boolean = false;
  checkRequiredField: RequiredFields = {
    isRequiredTraineeNationalId: false,
    isRequiredTraineePhoneNumber: false,
    isOnSite: false,
    isRequiredCodeforce: false,
    isRequiredVjudge: false,
  };

  constructor() {
    this.registrationForm = this.fb.group({
      FirstName: ['', [Validators.required]],
      MiddleName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      NationalId: ['', [Validators.maxLength(14), Validators.minLength(14)]],
      BirthDate: ['', [Validators.required]],
      Grade: ['', [Validators.required]],
      College: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      CodeForceHandle: [''],
      VjudgeHandle: [''],
      FacebookLink: [null],
      Email: ['', [Validators.required, Validators.email]],
      PhoneNumber: ['', [Validators.maxLength(11), Validators.minLength(11)]],
      Photo: [null],
      HasLaptop: [null, [Validators.required]],
      otp: [null, [Validators.required, Validators.maxLength(4)]],
      CampId: [null, [Validators.required]],
      University: [null, [Validators.required]],
      Comment: [null],
    });
    this.allUCollege = [
      { id: 0, name: 'Computer and Ai' },
      { id: 1, name: 'EELU' },
      { id: 2, name: 'Science' },
      { id: 3, name: 'Engineering' },
      { id: 4, name: 'Commerce' },
      { id: 5, name: 'Law' },
      { id: 6, name: 'Others' },
    ];
  }

  ngOnInit() {
    this.getAllCommunities();
    this.getAllUniversities();
  }

  filterNullValues(form: FormGroup): { [key: string]: any } {
    const filteredData: { [key: string]: any } = {};
    Object.keys(form.value).forEach((key) => {
      const value = form.get(key)?.value;
      if (value !== null && value !== undefined) {
        filteredData[key] = value;
      }
    });
    return filteredData;
  }

  registration(): void {
    this.isLoading = true;
    const myForm = this.filterNullValues(this.registrationForm);
    const formData = new FormData();
    Object.keys(myForm).forEach((key) => {
      const value = this.registrationForm.get(key)?.value;
      if (key === 'Photo' && value) {
        formData.append(key, value);
      } else {
        formData.append(key, value);
      }
    });
    this.registerationService.applyForm(formData).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.isLoading = false;
          this.superTab = 2;
        } else if (statusCode === 400) {
          this.toastr.error(message);
          this.isLoading = false;
        } else if (statusCode === 500) {
          this.toastr.warning(message);
          this.isLoading = false;
        } else {
          errors.forEach((error: any) => {
            this.toastr.error(error);
          });
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      },
    });
  }

  displayFormErrors(controls: string[] = []) {
    const formControls =
      controls.length > 0
        ? controls
        : Object.keys(this.registrationForm.controls);

    formControls.forEach((field) => {
      const control = this.registrationForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
        // Add checks for other error types if needed
        if (control.errors?.['minlength']) {
          this.toastr.error(
            `${field} must be at least ${control.errors['minlength'].requiredLength} characters`
          );
        }
        if (control.errors?.['maxlength']) {
          this.toastr.error(
            `${field} cannot exceed ${control.errors['maxlength'].requiredLength} characters`
          );
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.profileImageName = input.files[0].name;
      this.registrationForm.get('Photo')?.setValue(file);
    }
  }

  sendOTP(): void {
    if (this.registrationForm.get('Email')?.valid) {
      this.showLoader = true;
      this.registerationService
        .sendOtp(this.registrationForm.get('Email')?.value)
        .subscribe({
          next: ({ statusCode, message }) => {
            if (statusCode === 200) {
              this.showLoader = false;
              this.toastr.success(message);
            } else {
              this.toastr.error(message);
              this.showLoader = false;
            }
          },
        });
    }
  }

  getAllCommunities(): void {
    this.registerationService.getCommunities().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allCommunities = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllCamps(communityId: string): void {
    this.registerationService.getCamps(communityId).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allCamps = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  getAllUniversities(): void {
    this.registerationService.getUniversities().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allUniversity = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkContactInfo(): void {
    if (this.registrationForm.invalid) {
      this.displayFormErrors();
      return;
    }
    const contactInfo = {
      communityId: this.communityId,
      campId: this.registrationForm.get('CampId')?.value,
      email: this.registrationForm.get('Email')?.value,
      phoneNumber: this.registrationForm.get('PhoneNumber')?.value,
      codeforces: this.registrationForm.get('CodeForceHandle')?.value,
      vjudgeHandle: this.registrationForm.get('VjudgeHandle')?.value,
      otp: this.registrationForm.get('otp')?.value,
    };
    this.registerationService.checkContactInfo(contactInfo).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.registration();
        } else {
          this.toastr.error(message);
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  checkNationalId(nationalId: string): void {
    this.registerationService.checkNationalId(nationalId).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          this.isCheckNationalId = true;
        } else {
          this.isCheckNationalId = false;
          this.toastr.error(message);
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  updateValidators(requiredFields: { [key: string]: boolean }) {
    Object.keys(requiredFields).forEach((field) => {
      const control = this.registrationForm.get(field);
      if (control) {
        if (requiredFields[field]) {
          control.setValidators([Validators.required]);
        } else {
          control.clearValidators();
        }
        control.updateValueAndValidity();
      }
    });
  }

  campConditions(campId: number): void {
    this.registerationService.campConditions(campId).subscribe({
      next: ({ statusCode, message, data }) => {
        if (statusCode === 200) {
          const required = data as RequiredFields;
          this.checkRequiredField.isOnSite = required.isOnSite;
          this.checkRequiredField.isRequiredTraineeNationalId =
            required.isRequiredTraineeNationalId;
          this.checkRequiredField.isRequiredTraineePhoneNumber =
            required.isRequiredTraineePhoneNumber;
          this.checkRequiredField.isRequiredCodeforce =
            required.isRequiredCodeforce;
          this.checkRequiredField.isRequiredVjudge = required.isRequiredVjudge;
          const updateValidator = {
            CodeForceHandle: required.isRequiredCodeforce,
            NationalId: required.isRequiredTraineeNationalId,
            PhoneNumber: required.isRequiredTraineePhoneNumber,
            VjudgeHandle: required.isRequiredVjudge,
          };
          this.updateValidators(updateValidator);
        } else {
          this.isCheckNationalId = false;
          this.toastr.error(message);
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  swipPage(num: number): void {
    if (num === 1) {
      if (this.currentTab === 1) {
        if (this.hasLab && this.campName) {
          this.currentTab = 2;
        } else {
          this.displayFormErrors(['CampId', 'HasLaptop']);
        }
      } else {
        if (this.checkRequiredField.isRequiredTraineeNationalId) {
          this.checkNationalId(this.registrationForm.get('NationalId')?.value);
        }
        if (
          this.universityName &&
          this.collegeName &&
          this.gender &&
          this.grade &&
          this.registrationForm.get('FirstName')?.value &&
          this.registrationForm.get('MiddleName')?.value &&
          this.registrationForm.get('LastName')?.value &&
          this.registrationForm.get('BirthDate')?.value
        ) {
          this.currentTab = 3;
        } else {
          this.displayFormErrors([
            'FirstName',
            'LastName',
            'MiddleName',
            'NationalId',
            'BirthDate',
            'University',
            'College',
            'Gender',
            'Grade',
          ]);
        }
      }
    } else {
      this.currentTab = --this.currentTab;
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#organization');
    const isInsideDropdownCamp = targetElement.closest('#camp');
    const isInsideDropdownHas = targetElement.closest('#has');
    const isInsideDropdownCollege = targetElement.closest('#college');
    const isInsideDropdownUniversity = targetElement.closest('#university');
    const isInsideDropdownGrade = targetElement.closest('#grade');
    const isInsideDropdownGender = targetElement.closest('#gender');
    if (!isInsideDropdown) {
      this.isDropdownOrganization = false;
    }
    if (!isInsideDropdownCamp) {
      this.isDropdownCamp = false;
    }
    if (!isInsideDropdownHas) {
      this.isDropdownHas = false;
    }
    if (!isInsideDropdownCollege) {
      this.isDropdownCollege = false;
    }
    if (!isInsideDropdownUniversity) {
      this.isDropdownUniversity = false;
    }
    if (!isInsideDropdownGrade) {
      this.isDropdownGrade = false;
    }
    if (!isInsideDropdownGender) {
      this.isDropdownGender = false;
    }
  }

  selectOrganization(option: {
    id: string;
    clientName: string;
    logoUrl: string;
  }) {
    this.selectedOrganization = option;
    this.getAllCamps(option.id);
    this.communityId = option.id;
    this.isDropdownOrganization = false;
  }

  selectCamp(option: any): void {
    this.campName = option.name;
    this.isDropdownCamp = false;
    this.campConditions(option.id);
    this.registrationForm.get('CampId')?.setValue(option.id);
  }

  selectHasLab(option: any): void {
    this.hasLab = option.name;
    this.isDropdownHas = false;
    this.registrationForm
      .get('HasLaptop')
      ?.setValue(option.name === 'Yes' ? true : false);
  }

  selectCollege(option: any): void {
    this.collegeName = option.name;
    this.isDropdownCollege = false;
    this.registrationForm.get('College')?.setValue(option.id);
  }

  selectUniversity(option: { name: string }): void {
    this.universityName = option.name;
    this.isDropdownUniversity = false;
    this.registrationForm.get('University')?.setValue(option.name);
  }

  selectGrade(option: number): void {
    this.grade = option;
    this.isDropdownGrade = false;
    this.registrationForm.get('Grade')?.setValue(option);
  }

  selectGender(option: any): void {
    this.gender = option.name;
    this.isDropdownGender = false;
    this.registrationForm.get('Gender')?.setValue(option.id);
  }

  toggleDropdownGrade() {
    this.isDropdownGrade = !this.isDropdownGrade;
  }
  toggleDropdownGender() {
    this.isDropdownGender = !this.isDropdownGender;
  }

  toggleDropdown() {
    this.isDropdownOrganization = !this.isDropdownOrganization;
  }
  toggleDropdownCamp() {
    if (this.selectedOrganization) {
      this.isDropdownCamp = !this.isDropdownCamp;
    } else {
      this.isDropdownCamp = false;
      this.toastr.error('Select Organization');
    }
  }
  toggleDropdownHas() {
    this.isDropdownHas = !this.isDropdownHas;
  }
  toggleDropdownCollege() {
    this.isDropdownCollege = !this.isDropdownCollege;
  }
  toggleDropdownUniversity() {
    this.isDropdownUniversity = !this.isDropdownUniversity;
  }
}
