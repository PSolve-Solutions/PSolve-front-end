import { NgClass } from '@angular/common';
import {
  Component,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { LeaderProfileService } from '../../services/leader-profile.service';
import { ValidationProfileService } from '../../../../shared/services/validation-profile.service';
import { Router } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [ReactiveFormsModule, NgSelectModule, NgClass, ToastrModule],
  templateUrl: './profile-details.component.html',
  styleUrl: './profile-details.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ProfileDetailsComponent implements OnInit {
  leaderProfileService = inject(LeaderProfileService);
  validationProfileService = inject(ValidationProfileService);
  toastr = inject(ToastrService);
  router = inject(Router);
  fb = inject(FormBuilder);
  isEditMode: boolean = false;
  profileForm!: FormGroup;
  isLoading: boolean = false;
  allCollege: { id: number; name: string }[] = [];
  foucsTerm: boolean = false;
  foucsCollege: boolean = false;
  phoneMessage: string = '';
  isMessageSuccess: boolean = true;
  isMessageSuccessId: boolean = true;
  idMessage: string = '';
  currentPath: string = '';
  camps: string[] = [];
  camp: string = '';
  @ViewChild('term') term!: NgSelectComponent;
  @ViewChild('college') college!: NgSelectComponent;

  ngOnInit(): void {
    this.currentPath = this.router.url;
    if (this.currentPath.includes('leader')) {
      this.getGeneralProfile();
    } else if (this.currentPath.includes('head_of_camp')) {
      this.generalHeadProfile();
    } else {
      this.generalMentorProfile();
    }
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      middleName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
        ],
      ],
      nationalId: [
        '',
        [
          Validators.required,
          Validators.maxLength(14),
          Validators.minLength(14),
        ],
      ],
      grade: [null, [Validators.required]],
      college: [null, [Validators.required]],
      facebookLink: [null],
      birthDate: ['', [Validators.required]],
    });

    this.profileForm.disable();
    this.allCollege = [
      { id: 0, name: 'Computer and Ai' },
      { id: 1, name: 'EELU' },
      { id: 2, name: 'Science' },
      { id: 3, name: 'Engineering' },
      { id: 4, name: 'Commerce' },
      { id: 5, name: 'Law' },
      { id: 6, name: 'Others' },
    ];
    this.addFieldsForHead();
  }

  addFieldsForHead() {
    if (
      this.currentPath.includes('head_of_camp') ||
      this.currentPath.includes('mentor')
    ) {
      if (!this.profileForm.get('about')) {
        this.profileForm.addControl('about', this.fb.control(''));
      }
    } else {
      if (this.profileForm.get('about')) {
        this.profileForm.removeControl('about');
      }
    }
  }

  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (this.isEditMode) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      this.phoneMessage = '';
      this.idMessage = '';
      if (this.currentPath.includes('leader')) {
        this.getGeneralProfile();
      } else if (this.currentPath.includes('head_of_camp')) {
        this.generalHeadProfile();
      } else {
        this.generalMentorProfile();
      }
    }
  }

  vaildationPhone(): void {
    let phoneNumber = this.profileForm.get('phoneNumber')?.value;
    if (phoneNumber.length > 10) {
      this.validationProfileService.validatePhoneNumber(phoneNumber).subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.isMessageSuccess = true;
            this.phoneMessage = message;
          } else {
            this.isMessageSuccess = false;
            this.phoneMessage = message;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.phoneMessage = '';
    }
  }
  vaildationId(): void {
    let nationalId = this.profileForm.get('nationalId')?.value;
    if (nationalId.length > 13) {
      this.validationProfileService.validateNationalId(nationalId).subscribe({
        next: ({ statusCode, message }) => {
          if (statusCode === 200) {
            this.isMessageSuccessId = true;
            this.idMessage = message;
          } else {
            this.isMessageSuccessId = false;
            this.idMessage = message;
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    } else {
      this.idMessage = '';
    }
  }

  onSubmit() {
    this.isLoading = true;
    if (
      this.profileForm.invalid ||
      !this.isMessageSuccess ||
      !this.isMessageSuccessId
    ) {
      this.isLoading = false;
      this.displayFormErrors();

      return;
    }
    if (this.profileForm.get('facebookLink')?.value === '') {
      this.profileForm.get('facebookLink')?.setValue(null);
    }
    if (this.currentPath.includes('leader')) {
      this.updateLeaderProfile();
    } else if (this.currentPath.includes('head_of_camp')) {
      this.updateHeadOfCamp();
    } else {
      this.updateMentor();
    }
  }

  getGeneralProfile(): void {
    this.isLoading = true;
    this.leaderProfileService.generalLeaderProfile().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.profileForm.patchValue({
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            nationalId: data.nationalId,
            facebookLink: data.facebookLink,
            college: data.college,
            grade: data.grade,
            birthDate: data.birthDate,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }
  generalHeadProfile(): void {
    this.isLoading = true;
    this.leaderProfileService.generalHeadProfile().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.camp = data.campName;
          this.profileForm.patchValue({
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            nationalId: data.nationalId,
            facebookLink: data.facebookLink,
            college: data.college,
            grade: data.grade,
            birthDate: data.birthDate,
            about: data.about,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }

  generalMentorProfile(): void {
    this.isLoading = true;
    this.leaderProfileService.generalMentorProfile().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.camps = [...data.camps];
          this.profileForm.patchValue({
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            phoneNumber: data.phoneNumber,
            nationalId: data.nationalId,
            facebookLink: data.facebookLink,
            college: data.college,
            grade: data.grade,
            birthDate: data.birthDate,
            about: data.about,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }

  // update leader
  updateLeaderProfile() {
    this.leaderProfileService.updateProfile(this.profileForm.value).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.isLoading = false;
          this.toastr.success(message);
          this.isEditMode = false;
          this.phoneMessage = '';
          this.idMessage = '';
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

  // update HOC
  updateHeadOfCamp() {
    this.leaderProfileService
      .updateHeadOfCamp(this.profileForm.value)
      .subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.isLoading = false;
            this.toastr.success(message);
            this.isEditMode = false;
            this.phoneMessage = '';
            this.idMessage = '';
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

  // update Mentor
  updateMentor() {
    this.leaderProfileService.updateMentor(this.profileForm.value).subscribe({
      next: ({ statusCode, message, errors }) => {
        if (statusCode === 200) {
          this.isLoading = false;
          this.toastr.success(message);
          this.isEditMode = false;
          this.phoneMessage = '';
          this.idMessage = '';
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
    Object.keys(this.profileForm.controls).forEach((field) => {
      const control = this.profileForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.term.dropdownPanel === undefined) {
      this.foucsTerm = false;
    }
    if (this.college.dropdownPanel === undefined) {
      this.foucsCollege = false;
    }
  }

  toggleDropdownTerm() {
    if (this.foucsTerm) {
      this.term.close();
    } else {
      this.term.open();
    }
    this.foucsTerm = !this.foucsTerm;
  }
  toggleDropdownCollege() {
    if (this.foucsCollege) {
      this.college.close();
    } else {
      this.college.open();
    }
    this.foucsCollege = !this.foucsCollege;
  }
}
