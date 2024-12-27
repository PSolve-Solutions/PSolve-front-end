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
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { ContestsHocService } from '../../services/contests-hoc.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { OcSidebarService } from '../../../../shared/services/oc-sidebar.service';

@Component({
  selector: 'app-actions-contests',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastrModule,
    NgClass,
    NgSelectModule,
    RouterLink,
  ],
  templateUrl: './actions-contests.component.html',
  styleUrl: './actions-contests.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ActionsContestsComponent implements OnInit {
  contestsHocService = inject(ContestsHocService);
  ocSidebarService = inject(OcSidebarService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  @ViewChild('judge') judge!: NgSelectComponent;
  @ViewChild('communitySelect') communitySelect!: NgSelectComponent;
  foucsJ: boolean = false;
  foucsC: boolean = false;
  id: number = 0;
  submitted: boolean = false;
  isLoading: boolean = false;
  contestForm!: FormGroup;
  onlineJudgeIsCodeforces: boolean = false;

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id']);
    });
    if (this.id > 0) {
      this.getOneContest(this.id);
    }
    this.contestForm = this.fb.group({
      id: [''],
      name: [null, [Validators.required]],
      link: [null, [Validators.required]],
      problemCount: [0, this.positiveNumberValidator],
      onlineId: [null, [Validators.required]],
      judgeType: [null, [Validators.required]],
      chiefOfContest: [null, [Validators.required]],
      cfCommunityId: [null],
      endTime: [null, [Validators.required]],
      startTime: [null, [Validators.required]],
    });
  }

  positiveNumberValidator(control: AbstractControl) {
    const value = control.value;
    if (value !== null && value < 0) {
      return { negativeNumber: true };
    }
    return null;
  }

  increase() {
    this.contestForm
      .get('problemCount')
      ?.setValue(this.contestForm.get('problemCount')?.value + 1);
  }

  decrease() {
    const current = this.contestForm.get('problemCount')?.value;
    if (current > 0) {
      this.contestForm.get('problemCount')?.setValue(current - 1);
    }
  }

  getOneContest(id: number): void {
    this.isLoading = true;
    this.contestsHocService.getOneContest(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.contestForm.patchValue({
            id: data.id,
            name: data.name,
            link: data.link,
            startDate: data.startDate,
            endDate: data.endDate,
            judgeType: data.judgeType,
            chiefOfContest: data.chiefOfContest,
            onlineId: data.onlineId,
            problemCount: data.problemCount,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }

  actionsContext(): void {
    this.submitted = true;
    if (this.contestForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    const data = {
      ...this.contestForm.value,
      startTime: new Date(
        this.contestForm.get('startTime')?.value
      ).toISOString(),
      endTime: new Date(this.contestForm.get('endTime')?.value).toISOString(),
    };
    console.log(data);
    if (this.id === 0) {
      // this.contestsHocService.createContest(data).subscribe({
      //   next: ({ statusCode, message, errors }) => {
      //     if (statusCode === 200) {
      //       this.toastr.success(message);
      //       this.router.navigate(['/head_of_camp/contests']);
      //       this.isLoading = false;
      //     } else if (statusCode === 400) {
      //       this.toastr.error(message);
      //       this.isLoading = false;
      //     } else if (statusCode === 500) {
      //       this.toastr.warning(message);
      //       this.isLoading = false;
      //     } else {
      //       errors.forEach((error: any) => {
      //         this.toastr.error(error);
      //       });
      //       this.isLoading = false;
      //     }
      //   },
      //   error: (err) => {
      //     console.log(err);
      //     this.isLoading = false;
      //   },
      // });
    } else {
      this.contestsHocService.updateContest(data).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.router.navigate(['/head_of_camp/contests']);
            this.isLoading = false;
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

  changeJudge(item: number) {
    if (item === 0) {
      this.onlineJudgeIsCodeforces = true;

      // this.contestForm
      // .get('cfCommunityId')
      // ?.setValidators([Validators.required]);
      // this.contestForm.get('cfCommunityId')?.updateValueAndValidity();
    } else {
      this.onlineJudgeIsCodeforces = false;
      // this.contestForm.get('cfCommunityId')?.clearValidators();
      // this.contestForm.get('cfCommunityId')?.updateValueAndValidity();
    }
  }

  displayFormErrors() {
    Object.keys(this.contestForm.controls).forEach((field) => {
      const control = this.contestForm.get(field);
      if (control?.invalid) {
        if (control.errors?.['required']) {
          this.toastr.error(`${field} is required`);
        }
      }
    });
  }
  @HostListener('document:click', ['$event'])
  onClickOutside() {
    if (this.judge.dropdownPanel === undefined) {
      this.foucsJ = false;
    }
  }
  toggleDropdownJ() {
    if (this.foucsJ) {
      this.judge.close();
    } else {
      this.judge.open();
    }
    this.foucsJ = !this.foucsJ;
  }
  toggleDropdownC() {
    if (this.foucsC) {
      this.communitySelect.close();
    } else {
      this.communitySelect.open();
    }
    this.foucsC = !this.foucsC;
  }
}
