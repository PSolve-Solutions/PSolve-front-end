import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localTime',
  standalone: true
})
export class LocalTimePipe implements PipeTransform {

  transform(value: string | Date): string {
    if (!value) return '';

    // Convert the input value to a Date object
    const utcDate = new Date(value);

    // Convert the UTC date to the local time zone
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,  // Use 12-hour clock with AM/PM
    };

    // Format the local date with hours and minutes
    const localTimeString = utcDate.toLocaleTimeString(undefined, options);

    return localTimeString;
  }

}
