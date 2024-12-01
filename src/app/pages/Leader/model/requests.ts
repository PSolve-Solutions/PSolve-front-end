import { FormArray, FormControl, FormGroup } from '@angular/forms';

export type Form = FormGroup<{
  filters: FormArray<FormFilter>;
}>;
export type FormFilter = FormGroup<{
  sheetId: FormControl;
  community: FormControl;
  passingPrecent: FormControl;
}>;
