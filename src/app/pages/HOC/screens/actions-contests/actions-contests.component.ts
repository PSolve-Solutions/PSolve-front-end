import { NgClass } from '@angular/common';
import {
  Component,
  ElementRef,
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
import { CasheService } from '../../../../shared/services/cashe.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

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
  casheService = inject(CasheService);
  toastr = inject(ToastrService);
  fb = inject(FormBuilder);
  router = inject(Router);
  route = inject(ActivatedRoute);
  @ViewChild('community') community!: NgSelectComponent;
  @ViewChild('judge') judge!: NgSelectComponent;
  foucsTerm: boolean = false;
  foucsJ: boolean = false;
  id: number = 0;
  submitted: boolean = false;
  isLoading: boolean = false;
  contestForm!: FormGroup;

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
      community: [null, [Validators.required]],
      judgeType: [null, [Validators.required]],
      problemCount: [0, this.positiveNumberValidator],
      onlineId: [null, [Validators.required]],
      chiefOfContest: [null, [Validators.required]],
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
            startTime: data.startTime,
            endTime: data.endTime,
            community: data.community,
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
    if (this.id === 0) {
      this.contestsHocService.createContest(this.contestForm.value).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.casheService.clearCache();
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
    } else {
      this.contestsHocService.updateContest(this.contestForm.value).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.casheService.clearCache();
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
    if (this.community.dropdownPanel === undefined) {
      this.foucsTerm = false;
    }
    if (this.judge.dropdownPanel === undefined) {
      this.foucsJ = false;
    }
  }

  toggleDropdownC() {
    if (this.foucsTerm) {
      this.community.close();
    } else {
      this.community.open();
    }
    this.foucsTerm = !this.foucsTerm;
  }
  toggleDropdownJ() {
    if (this.foucsJ) {
      this.judge.close();
    } else {
      this.judge.open();
    }
    this.foucsJ = !this.foucsJ;
  }
}
