import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { validateImage } from '../../../../core/validators/product-manager/image.validator';
import { ToastService } from '../../../../core/services/common/toast.service';
import { SubButton } from '../../../../shared/components/sub-button/sub-button';

export interface PreviewImage {
  file?: File;
  url: string;
}

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, MatIconModule, SubButton],
  templateUrl: './image-uploader.html',
  styleUrl: './image-uploader.css',
})
export class ImageUploader {
  private cdr = inject(ChangeDetectorRef);
  private toastService = inject(ToastService);
  private platformId = inject(PLATFORM_ID);

  isBrowser = isPlatformBrowser(this.platformId);
  previews: PreviewImage[] = [];

  @Input() multiple = false;

  // ДОДАНО: Механізм для отримання існуючих картинок ззовні
  @Input() set existingImages(urls: string | string[] | null) {
    if (!urls || (Array.isArray(urls) && urls.length === 0)) {
      return;
    }

    const urlArray = Array.isArray(urls) ? urls : [urls];
    this.previews = urlArray.map((url) => ({ url: url }));

    // Сигналізуємо Ангуляру, що дані змінилися і треба показати картинки
    this.cdr.detectChanges();
  }

  @Output() imagesChanged = new EventEmitter<File[]>();
  @Output() existingImagesChanged = new EventEmitter<string[]>();

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      Array.from(input.files).forEach((file) => {
        const errorMessage = validateImage(file);

        if (errorMessage) {
          this.toastService.showError(errorMessage);
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const newPreview = { file, url: e.target?.result as string };

          if (!this.multiple) {
            this.previews = [newPreview];
          } else {
            this.previews = [...this.previews, newPreview];
          }

          this.emitChanges();
          this.cdr.detectChanges();
        };

        reader.readAsDataURL(file);
      });
    }
    input.value = '';
  }

  removeImage(index: number) {
    this.previews = this.previews.filter((_, i) => i !== index);
    this.emitChanges();
    this.cdr.detectChanges();
  }

  private emitChanges() {
    const onlyNewFiles = this.previews
      .filter((p) => p.file !== undefined)
      .map((p) => p.file as File);
    this.imagesChanged.emit(onlyNewFiles);

    const retainedUrls = this.previews.filter((p) => p.file === undefined).map((p) => p.url);
    this.existingImagesChanged.emit(retainedUrls);
  }
}
