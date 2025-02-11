import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  FormArray,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { Form, FormFilter, FormFilterV } from '../../model/requests';
import { RequestsLeaderService } from '../../services/requests-leader.service';
@Component({
  selector: 'app-system-filter',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgSelectModule],
  templateUrl: './system-filter.component.html',
  styleUrl: './system-filter.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class SystemFilterComponent implements OnInit {
  requestsLeaderService = inject(RequestsLeaderService);
  allCommunities: { id: string; clientName: string }[] = [];
  @Input() codeforcesFilters: any;
  @Input() vjudgeFilters: any;
  @Output() saveFilter = new EventEmitter<Form>();
  @Output() clickOutside = new EventEmitter<void>();
  elementRef = inject(ElementRef);
  fb = inject(NonNullableFormBuilder);
  filterForm!: Form;
  ngOnInit() {
    this.getAllCommunities();
    this.filterForm = this.fb.group({
      filtersC: this.fb.array<FormFilter>([this.generateFilter()]),
      filtersV: this.fb.array<FormFilterV>([this.generateFilterV()]),
    }) as Form;
    if (this.codeforcesFilters.length === 0) {
      this.codeforcesFilters.push({
        sheetId: '',
        communityId: null,
        passingPrecent: null,
      });
    }
    if (this.codeforcesFilters.length > 0) {
      this.setSavedFilters(this.codeforcesFilters);
    }
    if (this.vjudgeFilters.length === 0) {
      this.vjudgeFilters.push({
        sheetId: '',
        problemCount: null,
        passingPrecent: null,
      });
    }
    if (this.vjudgeFilters.length > 0) {
      this.setSavedFiltersV(this.vjudgeFilters);
    }
    this.updateLastRowValidation();
    this.updateLastRowValidationV();
  }
  generateFilter(): FormFilter {
    return this.fb.group({
      sheetId: [''],
      communityId: [null],
      passingPrecent: [null],
    }) as FormFilter;
  }
  get filtersC(): FormArray<FormFilter> {
    return this.filterForm.get('filtersC') as FormArray<FormFilter>;
  }
  addFilter() {
    this.filtersC.push(this.generateFilter());
    this.updateLastRowValidation();
  }
  removeFilter(index: number) {
    this.filtersC.removeAt(index);
    this.updateLastRowValidation();
  }
  isEableToSave(): boolean {
    const formData = this.filterForm.value?.filtersC ?? [];
    const formDataV = this.filterForm.value?.filtersV ?? [];
    const rowHasValues = (row: any) => {
      return row.sheetId && row.communityId && row.passingPrecent;
    };
    const rowHasValuesV = (row: any) => {
      return row.sheetId || row.problemCount || row.passingPrecent;
    };
    const firstRow = formData[0];
    const firstRowV = formDataV[0];
    if (
      rowHasValues(firstRow) &&
      formData.length > 1 &&
      !rowHasValuesV(firstRowV) &&
      formDataV.length === 1
    ) {
      return false;
    } else if (
      !rowHasValues(firstRow) &&
      formData.length === 1 &&
      rowHasValuesV(firstRowV) &&
      formDataV.length > 1
    ) {
      return false;
    } else if (
      rowHasValues(firstRow) &&
      formData.length > 1 &&
      rowHasValuesV(firstRowV) &&
      formDataV.length > 1
    ) {
      return false;
    }
    return true;
  }
  saveCustomFilter(): void {
    const formData = this.filterForm.value?.filtersC ?? [];
    const formDataV = this.filterForm.value?.filtersV ?? [];
    const rowHasValues = (row: any) => {
      return row.sheetId || row.communityId || row.passingPrecent;
    };
    const rowHasValuesV = (row: any) => {
      return row.sheetId || row.problemCount || row.passingPrecent;
    };
    const lastRow = formData[formData.length - 1];
    const lastRowV = formDataV[formDataV.length - 1];
    if (formData.length > 1 || formDataV.length > 1) {
      if (!rowHasValues(lastRow)) {
        this.filtersC.removeAt(this.filtersC.length - 1);
      }
      if (!rowHasValuesV(lastRowV)) {
        this.filtersV.removeAt(this.filtersV.length - 1);
      }
      this.saveFilter.emit(this.filterForm);
      return;
    }
    const firstRow = formData[0];
    const hasMultipleRows = this.filtersC.length > 1;
    const firstRowV = formDataV[0];
    const hasMultipleRowsV = this.filtersV.length > 1;
    if (!rowHasValues(firstRow)) {
      this.filtersC.removeAt(this.filtersC.length - 1);
      this.saveFilter.emit(this.filterForm);
    } else if (
      rowHasValues(firstRow) &&
      rowHasValues(lastRow) &&
      hasMultipleRows
    ) {
      this.filtersC.removeAt(this.filtersC.length - 1);
      this.saveFilter.emit(this.filterForm);
    } else {
      console.log('Form not submitted - only the first row has values');
      return;
    }
    if (!rowHasValuesV(firstRowV)) {
      this.filtersV.removeAt(this.filtersV.length - 1);
      this.saveFilter.emit(this.filterForm);
    } else if (
      rowHasValuesV(firstRowV) &&
      rowHasValuesV(lastRowV) &&
      hasMultipleRowsV
    ) {
      this.filtersV.removeAt(this.filtersV.length - 1);
      this.saveFilter.emit(this.filterForm);
    } else {
      console.log('Form not submitted - only the first row has valuesV');
    }
  }
  resetFilter(): void {
    this.filtersV.clear();
    this.filtersC.clear();
    this.saveFilter.emit(this.filterForm);
  }
  setSavedFilters(savedData: any[]) {
    this.filtersC.clear();
    savedData.forEach((filterData) => {
      const newFilter = this.generateFilter();
      newFilter.patchValue({
        sheetId: filterData.sheetId,
        communityId: filterData.communityId,
        passingPrecent: filterData.passingPrecent,
      });
      this.filtersC.push(newFilter);
    });
    this.updateLastRowValidation();
  }
  updateLastRowValidation() {
    const length = this.filtersC.length;
    this.filtersC.controls.forEach((filterGroup, index) => {
      if (index === length - 1) {
        filterGroup.get('sheetId')?.clearValidators();
        filterGroup.get('communityId')?.clearValidators();
        filterGroup.get('passingPrecent')?.clearValidators();
      } else {
        filterGroup.get('sheetId')?.setValidators([Validators.required]);
        filterGroup.get('communityId')?.setValidators([Validators.required]);
        filterGroup.get('passingPrecent')?.setValidators([Validators.required]);
      }
      filterGroup.get('sheetId')?.updateValueAndValidity();
      filterGroup.get('communityId')?.updateValueAndValidity();
      filterGroup.get('passingPrecent')?.updateValueAndValidity();
    });
  }
  //V
  generateFilterV(): FormFilterV {
    return this.fb.group({
      sheetId: [''],
      passingPrecent: [null],
      problemCount: [null],
    }) as FormFilterV;
  }
  get filtersV(): FormArray<FormFilterV> {
    return this.filterForm.get('filtersV') as FormArray<FormFilterV>;
  }
  addFilterV() {
    this.filtersV.push(this.generateFilterV());
    this.updateLastRowValidationV();
  }
  removeFilterV(index: number) {
    this.filtersV.removeAt(index);
    this.updateLastRowValidationV();
  }
  setSavedFiltersV(savedData: any[]) {
    this.filtersV.clear();
    savedData.forEach((filterData) => {
      const newFilter = this.generateFilterV();
      newFilter.patchValue({
        sheetId: filterData.sheetId,
        problemCount: filterData.problemCount,
        passingPrecent: filterData.passingPrecent,
      });
      this.filtersV.push(newFilter);
    });
    this.updateLastRowValidationV();
  }
  updateLastRowValidationV() {
    const length = this.filtersV.length;
    this.filtersV.controls.forEach((filterGroup, index) => {
      if (index === length - 1) {
        filterGroup.get('sheetId')?.clearValidators();
        filterGroup.get('problemCount')?.clearValidators();
        filterGroup.get('passingPrecent')?.clearValidators();
      } else {
        filterGroup.get('sheetId')?.setValidators([Validators.required]);
        filterGroup.get('problemCount')?.setValidators([Validators.required]);
        filterGroup.get('passingPrecent')?.setValidators([Validators.required]);
      }
      filterGroup.get('sheetId')?.updateValueAndValidity();
      filterGroup.get('problemCount')?.updateValueAndValidity();
      filterGroup.get('passingPrecent')?.updateValueAndValidity();
    });
  }
  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.clickOutside.emit();
    }
  }
  getAllCommunities(): void {
    this.requestsLeaderService.getCommunities().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allCommunities = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
