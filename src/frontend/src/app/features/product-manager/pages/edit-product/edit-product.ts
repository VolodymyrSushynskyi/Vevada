import { Component } from '@angular/core';
import { UiCard } from '../../components/ui-card/ui-card';
import { ImageUploader } from '../../components/image-uploader/image-uploader';

@Component({
  selector: 'app-edit-product',
  standalone: true,
  imports: [UiCard, ImageUploader],
  templateUrl: './edit-product.html',
  styleUrl: './edit-product.css',
})
export class EditProduct {}
