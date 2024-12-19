import { NgClass } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../../services/clients.service';

@Component({
  selector: 'app-add-client',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './add-client.component.html',
  styleUrl: './add-client.component.scss',
})
export class AddClientComponent implements OnInit {
  ocSidebarService = inject(OcSidebarService);
  clientsService = inject(ClientsService);
  fb = inject(FormBuilder);
  router = inject(Router);
  toastr = inject(ToastrService);
  clientForm!: FormGroup;
  clientId: string = '';
  gender: string = '';
  grade: number = 0;
  submitted: boolean = true;
  isLoading: boolean = false;
  isDropdownOpen: boolean = false;
  isDropdownGrade: boolean = false;
  isDropdownCollege: boolean = false;
  profileImage: string = '';
  allCollege: { id: number; name: string }[] = [];
  collegeName: string = '';
  logoName: string = '';

  constructor() {
    this.allCollege = [
      { id: 0, name: 'Computer and Ai' },
      { id: 1, name: 'EELU' },
      { id: 2, name: 'Science' },
      { id: 3, name: 'Engineering' },
      { id: 4, name: 'Commerce' },
      { id: 5, name: 'Law' },
      { id: 6, name: 'Others' },
    ];
  }
  ngOnInit(): void {
    this.clientForm = this.fb.group({
      ClientName: ['', [Validators.required]],
      FirstName: ['', [Validators.required]],
      MiddleName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      CommunityGmail: ['', [Validators.required]],
      NationalId: [''],
      BirthDate: ['', [Validators.required]],
      PhoneNumber: [''],
      College: ['', [Validators.required]],
      CodeForceHandle: [''],
      FacebookLink: [''],
      CommunityFacebookLink: [''],
      Grade: ['', [Validators.required]],
      Gender: ['', [Validators.required]],
      VjudgeHandle: [''],
      StartDate: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      ProfileImage: [null],
      Logo: [null, [Validators.required]],
    });
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

  addClient() {
    this.submitted = true;
    if (this.clientForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    const myForm = this.filterNullValues(this.clientForm);
    const formData = new FormData();
    Object.keys(myForm).forEach((key) => {
      const value = this.clientForm.get(key)?.value;
      formData.append(key, value);
    });
    this.clientsService.createClient(formData).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.clientForm.reset();
          this.isLoading = false;
          this.submitted = false;
          this.router.navigate(['/psovle/clients']);
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

  displayFormErrors() {
    Object.keys(this.clientForm.controls).forEach((field) => {
      const control = this.clientForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.clientForm.get('ProfileImage')?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onLogoSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.logoName = input.files[0].name;
      this.clientForm.get('Logo')?.setValue(file);
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#dropdown');
    const isInsideDropdownCollege = targetElement.closest('#college');
    const isInsideDropdownGrade = targetElement.closest('#grade');
    if (!isInsideDropdown) {
      this.isDropdownOpen = false;
    }
    if (!isInsideDropdownGrade) {
      this.isDropdownGrade = false;
    }
    if (!isInsideDropdownCollege) {
      this.isDropdownCollege = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  selectGender(option: { id: number; name: string }): void {
    this.gender = option.name;
    this.isDropdownOpen = false;
    this.clientForm.get('Gender')?.setValue(option.id);
  }
  toggleDropdownGrade() {
    this.isDropdownGrade = !this.isDropdownGrade;
  }
  selectGrade(option: number): void {
    this.grade = option;
    this.isDropdownGrade = false;
    this.clientForm.get('Grade')?.setValue(option);
  }
  toggleDropdownCollege() {
    this.isDropdownCollege = !this.isDropdownCollege;
  }
  selectCollege(option: { id: number; name: string }): void {
    this.collegeName = option.name;
    this.isDropdownCollege = false;
    this.clientForm.get('College')?.setValue(option.id);
  }
}
