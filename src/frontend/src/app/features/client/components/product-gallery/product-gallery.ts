import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUrlPipe } from '../../../../core/pipes/image-url.pipe';

@Component({
  selector: 'app-product-gallery',
  standalone: true,
  imports: [CommonModule, ImageUrlPipe],
  templateUrl: './product-gallery.html',
  styleUrl: './product-gallery.css',
})
export class ProductGallery implements OnChanges {
  @Input({ required: true }) mainImageId!: string;
  @Input() galleryImageIds: string[] = [];

  allImages: string[] = [];
  activeImageId: string = '';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['mainImageId'] || changes['galleryImageIds']) {
      const images = [this.mainImageId, ...(this.galleryImageIds || [])];

      this.allImages = Array.from(new Set(images.filter((id) => !!id)));

      if (!this.activeImageId || !this.allImages.includes(this.activeImageId)) {
        this.activeImageId = this.allImages[0];
      }
    }
  }

  setActiveImage(id: string): void {
    this.activeImageId = id;
  }

  prevImage(): void {
    const index = this.allImages.indexOf(this.activeImageId);
    this.activeImageId =
      index > 0 ? this.allImages[index - 1] : this.allImages[this.allImages.length - 1];
  }

  nextImage(): void {
    const index = this.allImages.indexOf(this.activeImageId);
    this.activeImageId =
      index < this.allImages.length - 1 ? this.allImages[index + 1] : this.allImages[0];
  }
}
