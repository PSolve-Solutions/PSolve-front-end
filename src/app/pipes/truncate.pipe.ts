import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone:true
})
export class TruncatePipe implements PipeTransform {

  transform(value: string): string {
    if (!value) {
      return '';
    }
    return value.length > 7 ? value.slice(0, 7) + '...' : value;
  }

}
