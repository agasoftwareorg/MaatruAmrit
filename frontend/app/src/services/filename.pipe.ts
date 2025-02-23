import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filename',
  standalone: true
})
export class FilenamePipe implements PipeTransform {

  transform(url: string | null | undefined): string {
    if (!url) return '';
    return url.split('/').pop() || ''; // Extracts file name from URL
  }
  

}
