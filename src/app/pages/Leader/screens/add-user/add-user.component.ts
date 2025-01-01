import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DashboardService } from '../../services/dashboard.service';
import { NgClass } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, ToastrModule, RouterLink],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  dashboardService = inject(DashboardService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  allRoles: { id: number; name: string }[] = [];
  allCollege: { id: number; name: string }[] = [];
  allCamps: { id: number; name: string }[] = [];
  uploadedFileName: string = '';
  isShow: boolean = false;
  foucsCollege: boolean = false;
  foucsRole: boolean = false;
  foucsCamp: boolean = false;
  isLoading: boolean = false;
  addUserForm!: FormGroup;
  collegeName: string = '';
  campName: string = '';
  roleName: string = '';

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nationalId: [''],
      phoneNumber: ['', [Validators.required]],
      college: [null, [Validators.required]],
      grade: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      profileImage: [null],
      codeForceHandle: [''],
      vjudgeHandle: [null],
      campId: [null],
      role: [null, [Validators.required]],
    });
    this.fetchAllRoles();
    this.fetchAllCamps();
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

  craeteUser() {
    if (this.addUserForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    const myForm = this.filterNullValues(this.addUserForm);
    const formData = new FormData();
    Object.keys(myForm).forEach((key) => {
      const value = this.addUserForm.get(key)?.value;
      formData.append(key, value);
    });
    this.dashboardService.createAccount(formData).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.addUserForm.reset();
          this.isLoading = false;
          this.roleName = '';
          this.collegeName = '';
          this.campName = '';
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
    Object.keys(this.addUserForm.controls).forEach((field) => {
      const control = this.addUserForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }

  onFileSelected(event: any): void {
    const imgFile = event.target.files[0];
    this.uploadedFileName = imgFile.name;
    this.addUserForm.get('profileImage')?.setValue(imgFile);
  }

  getRole(roleName: string): void {
    if (roleName === 'Trainee' || roleName === 'Head_Of_Camp') {
      this.isShow = true;
    } else {
      this.isShow = false;
      this.addUserForm.get('campId')?.setValue(null);
    }
  }

  fetchAllRoles(): void {
    this.dashboardService.roles().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allRoles = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fetchAllCamps(): void {
    this.dashboardService.getAllCamps().subscribe({
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

  selectCollege(option: any): void {
    this.collegeName = option.name;
    this.foucsCollege = false;
    this.addUserForm.get('college')?.setValue(option.id);
  }
  toggleDropdownCollege() {
    this.foucsCollege = !this.foucsCollege;
  }

  selectRole(role: any): void {
    this.roleName = role.name;
    this.getRole(this.roleName);
    this.foucsRole = false;
    this.addUserForm.get('role')?.setValue(role.name);
  }
  toggleDropdownRole() {
    this.foucsRole = !this.foucsRole;
  }

  selectCamp(option: any): void {
    this.campName = option.name;
    this.foucsCamp = false;
    this.addUserForm.get('campId')?.setValue(option.id);
  }
  toggleDropdownCamp() {
    console.log(this.allCamps);
    this.foucsCamp = !this.foucsCamp;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const targetElement = event.target as HTMLElement;
    const isInsideDropdown = targetElement.closest('#role');
    const isInsideDropdownCamp = targetElement.closest('#camp');
    const isInsideDropdownCollege = targetElement.closest('#college');
    if (!isInsideDropdown) {
      this.foucsRole = false;
    }
    if (!isInsideDropdownCamp) {
      this.foucsCamp = false;
    }
    if (!isInsideDropdownCollege) {
      this.foucsCollege = false;
    }
  }
}
