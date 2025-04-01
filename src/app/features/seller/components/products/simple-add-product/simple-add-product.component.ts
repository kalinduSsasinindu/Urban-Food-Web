import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { Product } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-simple-add-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './simple-add-product.component.html',
  styleUrl: './simple-add-product.component.css'
})
export class SimpleAddProductComponent {
  productForm: FormGroup;
  isLoading = false;
  imageUrl = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      imageUrl: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      tags: ['']
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      this.isLoading = true;
      
      const formValue = this.productForm.value;
      const tags = formValue.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag);
      
      const product: Product = {
        id: '',
        title: formValue.title,
        description: formValue.description,
        imgUrls: [formValue.imageUrl],
        images: [],
        tags: tags,
        variants: [{
          variantId: 1,
          sku: `SKU-${Date.now()}`,
          name: formValue.title,
          price: formValue.price,
          availableQuantity: 100,
          committedQuantity: 0,
          isActive: true
        }],
        options: []
      };

      this.productService.createProduct(product).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/seller/products']);
        },
        error: (error) => {
          console.error('Error creating product:', error);
          this.isLoading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/seller/products']);
  }
}
