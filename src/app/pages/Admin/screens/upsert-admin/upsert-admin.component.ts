import { NgClass } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AdminsService } from '../../services/admins.service';
import { ToastrService } from 'ngx-toastr';
import { OneAdmin } from '../../model/admins';
@Component({
  selector: 'app-upsert-admin',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './upsert-admin.component.html',
  styleUrl: './upsert-admin.component.scss',
})
export class UpsertAdminComponent implements OnInit {
  ocSidebarService = inject(OcSidebarService);
  adminsService = inject(AdminsService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  toastr = inject(ToastrService);
  adminForm!: FormGroup;
  adminId: string = '';
  gender: string = '';
  submitted: boolean = true;
  isLoading: boolean = false;
  isDropdownOpen: boolean = false;
  profileImage: string = '';
  isReadOnly: boolean = false;
  constructor() {
    this.route.params.subscribe((params) => {
      this.adminId = params['id'];
      if (this.adminId !== '0') {
        this.getAdminById(this.adminId);
        this.isReadOnly = true;
      } else {
        this.isReadOnly = false;
      }
    });
  }
  ngOnInit(): void {
    this.adminForm = this.fb.group({
      FirstName: ['', [Validators.required]],
      MiddleName: ['', [Validators.required]],
      LastName: ['', [Validators.required]],
      Email: ['', [Validators.required, Validators.email]],
      NationalId: [''],
      BirthDate: ['', [Validators.required]],
      PhoneNumber: [''],
      Gender: ['', [Validators.required]],
      ProfileImage: [null],
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
  addAdmin() {
    this.submitted = true;
    if (this.adminForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    const myForm = this.filterNullValues(this.adminForm);
    const formData = new FormData();
    Object.keys(myForm).forEach((key) => {
      const value = this.adminForm.get(key)?.value;
      formData.append(key, value);
    });
    this.adminsService.actionsAdmin(formData).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.adminForm.reset();
          this.isLoading = false;
          this.submitted = false;
          this.router.navigate(['/psovle']);
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
    Object.keys(this.adminForm.controls).forEach((field) => {
      const control = this.adminForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }
  getAdminById(id: string): void {
    this.isLoading = true;
    this.adminsService.getAdminById(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          const admin = data as OneAdmin;
          this.gender = admin.gender;
          this.profileImage = admin.photoUrl || 'assets/img/user.jpeg';
          this.adminForm.patchValue({
            FirstName: admin.firstName,
            MiddleName: admin.middleName,
            LastName: admin.lastName,
            Email: admin.email,
            PhoneNumber: admin.phoneNumber,
            NationalId: admin.nationalId,
            BirthDate: admin.birthDate,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.adminForm.get('ProfileImage')?.setValue(file);
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.profileImage = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#dropdown');
    if (!isInsideDropdown) {
      this.isDropdownOpen = false;
    }
  }
  toggleDropdown() {
    if (this.isReadOnly) {
      this.isDropdownOpen = false;
    } else {
      this.isDropdownOpen = !this.isDropdownOpen;
    }
  }
  selectGender(option: { id: number; name: string }): void {
    this.gender = option.name;
    this.isDropdownOpen = false;
    this.adminForm.get('Gender')?.setValue(option.id);
  }
}
