import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcDate',
  standalone: true
})
export class UtcDatePipe implements PipeTransform {

  transform(value: Date | string | null): string {
    if (!value) {
      return '';
    }

    const date = new Date(value);
    // Convert to UTC string
    return date.toUTCString();
  }

}
