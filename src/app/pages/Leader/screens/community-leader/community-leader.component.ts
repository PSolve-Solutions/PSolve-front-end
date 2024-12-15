import { Component, inject, OnInit } from '@angular/core';
import { CommunityService } from '../../services/community.service';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';
import { NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommunityInfo } from '../../model/community';

@Component({
  selector: 'app-community-leader',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, RouterLink],
  templateUrl: './community-leader.component.html',
  styleUrl: './community-leader.component.scss',
})
export class CommunityLeaderComponent implements OnInit {
  communityService = inject(CommunityService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  communityForm!: FormGroup;
  communityId: string = '';
  isLoading: boolean = false;
  logoImage: string = '';
  startDate: string = '';
  endDate: string = '';
  isCodeforcesSettings: boolean = false;
  membersCount: number = 0;

  constructor() {
    this.getCommunityById();
  }

  ngOnInit(): void {
    console.log(this.isCodeforcesSettings);
    this.communityForm = this.fb.group({
      ClientName: ['', [Validators.required]],
      FacebookLink: [''],
      Gmail: ['', [Validators.required, Validators.email]],
      GoogleCredentialPassword: ['', [Validators.required]],
      ApiKey: [''],
      ApiSecret: [''],
      IsPublic: [''],
      CodeForcesSetting: [false],
      Logo: [null, [Validators.required]],
      IsRequiredTraineeNationalId: [''],
      IsRequiredTraineePhoneNumber: [''],
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

  updateCommuinty() {
    if (this.communityForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    const myForm = this.filterNullValues(this.communityForm);
    const formData = new FormData();
    Object.keys(myForm).forEach((key) => {
      const value = this.communityForm.get(key)?.value;
      formData.append(key, value);
    });
    this.communityService.updateCommuinty(formData).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.toastr.success(message);
          this.isLoading = false;
          // this.router.navigate(['/psovle']);
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
    Object.keys(this.communityForm.controls).forEach((field) => {
      const control = this.communityForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }

  getCommunityById(): void {
    this.isLoading = true;
    this.communityService.getCommuinty().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          const community = data as CommunityInfo;
          if (community.apiKey && community.apiSecret) {
            this.isCodeforcesSettings = true;
          }
          this.startDate = community.startDate;
          this.endDate = community.endDate;
          this.membersCount = community.usersCount;
          this.logoImage = community.logoUrl || 'assets/img/user.jpeg';
          this.communityForm.patchValue({
            ClientName: community.clientName,
            FacebookLink: community.facebookLink,
            Gmail: community.gmail,
            GoogleCredentialPassword: community.googleCredentialPassword,
            ApiKey: community.apiKey,
            ApiSecret: community.apiSecret,
            IsPublic: community.isPublic,
            Logo: community.logoUrl,
            IsRequiredTraineeNationalId: community.isRequiredTraineeNationalId,
            IsRequiredTraineePhoneNumber:
              community.isRequiredTraineePhoneNumber,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }

  toggleCheckbox() {
    this.isCodeforcesSettings = !this.isCodeforcesSettings;
    if (this.isCodeforcesSettings === true) {
      this.communityForm.get('ApiSecret')?.setValidators([Validators.required]);
      this.communityForm.get('ApiSecret')?.updateValueAndValidity();
      this.communityForm.get('ApiKey')?.setValidators([Validators.required]);
      this.communityForm.get('ApiKey')?.updateValueAndValidity();
    } else {
      this.communityForm.get('ApiSecret')?.clearValidators();
      this.communityForm.get('ApiSecret')?.updateValueAndValidity();
      this.communityForm.get('ApiKey')?.clearValidators();
      this.communityForm.get('ApiKey')?.updateValueAndValidity();
    }
    this.communityForm
      .get('CodeForcesSetting')
      ?.setValue(this.isCodeforcesSettings);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.communityForm.get('Logo')?.setValue(file);
      const reader = new FileReader();

      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.logoImage = e.target?.result as string;
      };

      reader.readAsDataURL(file);
    }
  }
}
