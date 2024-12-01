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
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { SheetsHOCService } from '../../services/sheets-hoc.service';
import { CasheService } from '../../../../shared/services/cashe.service';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-actions-sheets',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ToastrModule,
    NgSelectModule,
    NgClass,
    RouterLink,
  ],
  templateUrl: './actions-sheets.component.html',
  styleUrl: './actions-sheets.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ActionsSheetsComponent implements OnInit {
  sheetsHOCService = inject(SheetsHOCService);
  casheService = inject(CasheService);
  fb = inject(FormBuilder);
  elementRef = inject(ElementRef);
  router = inject(Router);
  route = inject(ActivatedRoute);
  toastr = inject(ToastrService);
  @ViewChild('community') community!: NgSelectComponent;
  @ViewChild('status') status!: NgSelectComponent;
  @ViewChild('judge') judge!: NgSelectComponent;
  dropdownOpen: boolean = false;
  dropdownOpenS: boolean = false;
  foucsJ: boolean = false;
  sheetForm!: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;

  id: number = 0;
  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.id = parseInt(params['id']);
    });
    if (this.id > 0) {
      this.getOneSheet(this.id);
    }
    this.sheetForm = this.fb.group({
      id: [''],
      name: [null, [Validators.required]],
      sheetLink: [null, [Validators.required]],
      community: [null, [Validators.required]],
      onlineId: [null, [Validators.required]],
      status: [null, [Validators.required]],
      judgeType: [null, [Validators.required]],
      minimumPassingPrecent: [null, [Validators.required]],
      problemCount: [0, [Validators.required]],
      endDate: [null, [Validators.required]],
      startDate: [null, [Validators.required]],
    });
  }

  getOneSheet(id: number): void {
    this.isLoading = true;
    this.sheetsHOCService.getOneSheet(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode == 200) {
          this.isLoading = false;
          this.sheetForm.patchValue({
            id: data.id,
            name: data.name,
            startDate: data.startDate,
            endDate: data.endDate,
            sheetLink: data.sheetLink,
            community: data.community,
            judgeType: data.judgeType,
            onlineId: data.onlineId,
            status: data.status,
            minimumPassingPrecent: data.minimumPassingPrecent,
            problemCount: data.problemCount,
          });
        } else {
          this.isLoading = false;
        }
      },
    });
  }

  actionsSheet(): void {
    this.submitted = true;
    if (this.sheetForm.invalid) {
      this.displayFormErrors();
      return;
    }
    this.isLoading = true;
    if (this.id === 0) {
      this.sheetsHOCService.createSheet(this.sheetForm.value).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.isLoading = false;
            this.casheService.clearCache();
            this.router.navigate(['/head_of_camp/sheets']);
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
      this.sheetsHOCService.updateSheet(this.sheetForm.value).subscribe({
        next: ({ statusCode, message, errors }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.isLoading = false;
            this.casheService.clearCache();
            this.router.navigate(['/head_of_camp/sheets']);
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
    Object.keys(this.sheetForm.controls).forEach((field) => {
      const control = this.sheetForm.get(field);
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
      this.dropdownOpen = false;
    }
    if (this.status.dropdownPanel === undefined) {
      this.dropdownOpenS = false;
    }
    if (this.judge.dropdownPanel === undefined) {
      this.foucsJ = false;
    }
  }

  toggleDropdown() {
    if (this.dropdownOpen) {
      this.community.close();
    } else {
      this.community.open();
    }
    this.dropdownOpen = !this.dropdownOpen;
  }
  toggleDropdownS() {
    if (this.dropdownOpenS) {
      this.status.close();
    } else {
      this.status.open();
    }
    this.dropdownOpenS = !this.dropdownOpenS;
  }
  toggleDropdownJ() {
    if (this.foucsJ) {
      this.judge.close();
    } else {
      this.judge.open();
    }
    this.foucsJ = !this.foucsJ;
  }

  increase() {
    this.sheetForm
      .get('problemCount')
      ?.setValue(this.sheetForm.get('problemCount')?.value + 1);
  }

  decrease() {
    const current = this.sheetForm.get('problemCount')?.value;
    if (current > 0) {
      this.sheetForm.get('problemCount')?.setValue(current - 1);
    }
  }
}
