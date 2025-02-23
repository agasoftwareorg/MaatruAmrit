import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nill',
  standalone: true
})
export class NillPipe implements PipeTransform {

  transform(value: string, strToReplace: string = '-'): string {
    return value || strToReplace;
  }

}
