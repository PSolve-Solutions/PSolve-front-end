import { NgClass, SlicePipe } from '@angular/common';
import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  HostListener,
  inject,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { CampLeaderService } from '../../services/camp-leader.service';
import { CasheService } from '../../../../shared/services/cashe.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-actios-camp',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgSelectModule,
    NgClass,
    RouterLink,
    SlicePipe,
    ToastrModule,
  ],
  templateUrl: './actios-camp.component.html',
  styleUrl: './actios-camp.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  encapsulation: ViewEncapsulation.None,
})
export class ActiosCampComponent implements OnInit {
  campLeaderService = inject(CampLeaderService);
  ocSidebarService = inject(OcSidebarService);
  casheService = inject(CasheService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  @ViewChild('termSelect') termSelect!: NgSelectComponent;
  @ViewChild('mentorsSelect') mentorsSelect!: NgSelectComponent;
  @ViewChild('hocSelect') hocSelect!: NgSelectComponent;
  dropdownOpen: boolean = false;
  dropdownOpenH: boolean = false;
  foucsTerm: boolean = false;
  allMentors: { id: string; fullName: string; isInCamp?: boolean }[] = [];
  allHeadsOfCamp: { id: string; fullName: string; isInCamp: boolean }[] = [];
  allCamps: { name: string }[] = [];
  selectedCamp: string = '';
  isCampsActive: boolean = false;
  nameForm!: FormGroup;
  campForm!: FormGroup;
  campName: string = '';
  submitted: boolean = false;
  isLoading: boolean = false;
  isDeleted: boolean = false;
  id: number = 0;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id']);
    });
    if (this.id > 0) {
      this.getOneCamp(this.id);
    } else {
      this.fetchAllMentors();
      this.fetchAllHeadsOfCamp();
    }
    this.campForm = this.fb.group({
      id: [''],
      name: [null, [Validators.required]],
      term: [null, [Validators.required]],
      headsIds: [null],
      mentorsIds: [null],
      openForRegister: [false, [Validators.required]],
      isRequiredCodeforce: [false],
      isRequiredVjudge: [false],
      isOnSite: [false],
      durationInWeeks: [
        null,
        [Validators.required, this.positiveNumberValidator],
      ],
      endDate: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
    });

    this.nameForm = this.fb.group({
      name: ['', [Validators.required]],
    });

    this.fetchAllCamp();
  }

  positiveNumberValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== null && value < 0) {
      return { negativeNumber: true };
    }
    return null;
  }

  selectCamp(item: any): void {
    this.selectedCamp = item.name;
    this.isCampsActive = false;
  }

  deleteCamp(campName: string): void {
    this.isDeleted = true;
    this.campName = campName;
    this.campLeaderService.deleteCampFormDropdown(campName).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          if (campName === this.selectedCamp) {
            this.selectedCamp = '';
          }
          this.allCamps = this.allCamps.filter(
            (camp) => camp.name !== campName
          );
          this.isDeleted = false;
        } else {
          this.isDeleted = false;
        }
      },
      error: (err) => {
        console.log(err);
        this.isDeleted = false;
      },
    });
  }

  onAddCamp(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    keyboardEvent.preventDefault();
    if (this.nameForm.invalid) {
      return;
    }
    const name = this.nameForm.get('name')?.value;
    this.campLeaderService.addCamp(name).subscribe({
      next: ({ statusCode }) => {
        if (statusCode === 200) {
          this.selectedCamp = name;
          this.allCamps.unshift({ name });
          this.nameForm.reset();
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  toggleDropdownC(event: MouseEvent) {
    event.stopPropagation();
    this.isCampsActive = !this.isCampsActive;
  }

  @HostListener('window:click', ['$event'])
  closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;
    const dropdownElement = document.querySelector('.relative.flex.flex-col');
    const inputElement = document.querySelector(
      '.relative.flex.items-center.ps-2 input'
    );
    const deleteIcon = targetElement.closest('.delete-icon');
    if (dropdownElement && !dropdownElement.contains(targetElement)) {
      if (inputElement && inputElement.contains(targetElement)) {
        return;
      }
      if (deleteIcon) {
        return;
      }
      this.isCampsActive = false;
    }
  }

  getOneCamp(id: number): void {
    this.isLoading = true;
    this.campLeaderService.getOneCamp(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.selectedCamp = data.name;
          this.allMentors = data.mentorsOfCamp;
          this.allHeadsOfCamp = data.headsOfCamp;
          this.campForm.patchValue({
            id: data.id,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            term: data.term,
            durationInWeeks: data.durationInWeeks,
            openForRegister: data.openForRegister,
            isOnSite: data.isOnSite,
            isRequiredVjudge: data.isRequiredVjudge,
            isRequiredCodeforce: data.isRequiredCodeforce,
            headsIds: this.allHeadsOfCamp
              .filter((item: any) => item.inCamp)
              .map((item: any) => item.id),
            mentorsIds: this.allMentors
              .filter((item: any) => item.inCamp)
              .map((item: any) => item.id),
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }

  craeteNewCamp(): void {
    this.campForm.get('name')?.setValue(this.selectedCamp);
    this.submitted = true;
    if (this.campForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    if (this.id === 0) {
      this.campLeaderService.createCamp(this.campForm.value).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.selectedCamp = '';
            this.isLoading = false;
            this.casheService.clearCache();
            this.router.navigate(['/leader/camps']);
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
    } else {
      this.campLeaderService
        .updateCamp(this.id, this.campForm.value)
        .subscribe({
          next: ({ statusCode, message, errors }) => {
            if (statusCode === 200) {
              this.toastr.success(message);
              this.isLoading = false;
              this.casheService.clearCache();
              this.router.navigate(['/leader/camps']);
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
  }

  displayFormErrors() {
    Object.keys(this.campForm.controls).forEach((field) => {
      const control = this.campForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }

  fetchAllMentors(): void {
    this.campLeaderService.getAllMentors().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allMentors = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fetchAllHeadsOfCamp(): void {
    this.campLeaderService.getAllHeadsOfCamp().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allHeadsOfCamp = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  fetchAllCamp(): void {
    this.campLeaderService.getAllCamps().subscribe({
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
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.termSelect.dropdownPanel === undefined) {
      this.foucsTerm = false;
    }
    if (this.mentorsSelect.dropdownPanel === undefined) {
      this.dropdownOpen = false;
    }
    if (this.hocSelect.dropdownPanel === undefined) {
      this.dropdownOpenH = false;
    }
  }

  toggleDropdown() {
    if (this.dropdownOpen) {
      this.mentorsSelect.close();
    } else {
      this.mentorsSelect.open();
    }
    this.dropdownOpen = !this.dropdownOpen;
  }
  onItemClick() {
    setTimeout(() => {
      this.mentorsSelect.open();
    });
  }

  toggleDropdownH() {
    if (this.dropdownOpenH) {
      this.hocSelect.close();
    } else {
      this.hocSelect.open();
    }
    this.dropdownOpenH = !this.dropdownOpenH;
  }
  onItemClickH() {
    setTimeout(() => {
      this.hocSelect.open();
    });
  }
  toggleDropdownT() {
    if (this.foucsTerm) {
      this.termSelect.close();
    } else {
      this.termSelect.open();
    }
    this.foucsTerm = !this.foucsTerm;
  }
}
