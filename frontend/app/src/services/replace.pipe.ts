import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'replace',
  standalone: true
})
export class ReplacePipe implements PipeTransform {

  escapeStr(str: string) {
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  }

  transform(value: string, strToReplace: string, replacementStr: string): string {
    return value.replace(new RegExp(this.escapeStr(strToReplace), 'g'), replacementStr);
  }

}
