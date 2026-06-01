import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../config/environment';

@Pipe({
  name: 'imageUrl',
  standalone: true,
})
export class ImageUrlPipe implements PipeTransform {
  transform(imageId: string | null | undefined, suffix: string = 'full'): string {
    if (!imageId) {
      return '../../../../../public/img/placeholder.png';
    }

    const baseUrl = environment.apiUrl.replace(/\/api$/, '');

    return `${baseUrl}/content/images/${imageId}-${suffix}.webp`;
  }
}
