import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'utcToLocal',
  standalone: true,
})
export class UtcToLocalPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';

    // Convert the input value to a Date object
    const date = new Date(value);

    // Format the date as per your requirements, without adjusting for timezone
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    };

    // Use toLocaleString to format the date, which applies local formatting but keeps the original time
    const formattedDate = date.toLocaleString('en-US', options);

    return formattedDate;
  }
}
