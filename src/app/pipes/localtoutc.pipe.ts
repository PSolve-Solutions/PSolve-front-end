import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'localToUtc',
  standalone: true,
})
export class LocaltoutcPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    // Convert the input value to a Date object
    const localDate = new Date(value);
    // Get the local timezone offset in minutes
    const timezoneOffset = localDate.getTimezoneOffset(); // This is in minutes
    // Adjust the local date to get UTC date
    const utcDate = new Date(localDate.getTime() - timezoneOffset * 60000); //
    // Format the adjusted UTC date to 'YYYY-MM-DDTHH:MM'
    const formattedDate = utcDate.toISOString().substring(0, 16); // 'YYYY-MM-DDTHH:MM'
    return formattedDate;
  }
}
