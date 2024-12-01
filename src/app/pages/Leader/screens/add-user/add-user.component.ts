import {
  Component,
  ElementRef,
  HostListener,
  inject,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { DashboardService } from '../../services/dashboard.service';
import { NgClass } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, NgClass, ToastrModule],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss',
})
export class AddUserComponent implements OnInit {
  dashboardService = inject(DashboardService);
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
  submitted: boolean = false;
  isLoading: boolean = false;
  imgFile!: File;
  addUserForm!: FormGroup;

  @ViewChild('collegeSelect') collegeSelect!: NgSelectComponent;
  @ViewChild('roleSelect') roleSelect!: NgSelectComponent;
  @ViewChild('campSelect') campSelect!: NgSelectComponent;

  ngOnInit(): void {
    this.addUserForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      nationalId: ['', [Validators.required]],
      phoneNumber: ['', [Validators.required]],
      college: [null, [Validators.required]],
      grade: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      profileImage: [null],
      codeForceHandle: ['', [Validators.required]],
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
    this.submitted = true;
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
          this.submitted = false;
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
    this.imgFile = event.target.files[0];
    this.uploadedFileName = this.imgFile.name;
  }

  getRole(role: any): void {
    if (role.name === 'Trainee' || role.name === 'Head_Of_Camp') {
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

  toggleDropdownC() {
    if (this.foucsCollege) {
      this.collegeSelect.close();
    } else {
      this.collegeSelect.open();
    }
    this.foucsCollege = !this.foucsCollege;
  }
  toggleDropdownR() {
    if (this.foucsRole) {
      this.roleSelect.close();
    } else {
      this.roleSelect.open();
    }
    this.foucsRole = !this.foucsRole;
  }
  toggleDropdownCamp() {
    if (this.foucsCamp) {
      this.campSelect.close();
    } else {
      this.campSelect.open();
    }
    this.foucsCamp = !this.foucsCamp;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside() {
    if (this.collegeSelect.dropdownPanel === undefined) {
      this.foucsCollege = false;
    }
    if (this.roleSelect.dropdownPanel === undefined) {
      this.foucsRole = false;
    }
    if (this.campSelect?.dropdownPanel === undefined) {
      this.foucsCamp = false;
    }
  }
}
