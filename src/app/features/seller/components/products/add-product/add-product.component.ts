import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, FormsModule, AbstractControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../../../core/services/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = false;
  selectedFiles: File[] = [];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required]],
      content: [''],
      options: this.fb.array([])
    });
  }

  get optionsArray(): FormArray {
    return this.productForm.get('options') as FormArray;
  }

  addOption(): void {
    const optionGroup = this.fb.group({
      name: ['', Validators.required],
      values: this.fb.array([this.createOptionValue()])
    });
    this.optionsArray.push(optionGroup);
  }

  addOptionValue(optionIndex: number): void {
    const valuesArray = (this.optionsArray.at(optionIndex).get('values') as FormArray);
    valuesArray.push(this.createOptionValue());
  }

  createOptionValue(): FormGroup {
    return this.fb.group({
      value: ['', Validators.required],
      price: [0]
    });
  }

  removeOption(optionIndex: number): void {
    this.optionsArray.removeAt(optionIndex);
  }

  removeOptionValue(optionIndex: number, valueIndex: number): void {
    const valuesArray = (this.optionsArray.at(optionIndex).get('values') as FormArray);
    valuesArray.removeAt(valueIndex);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      for (let i = 0; i < input.files.length; i++) {
        this.selectedFiles.push(input.files[i]);
      }
    }
  }

  triggerFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    fileInput.click();
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  goBack(): void {
    this.router.navigate(['/seller/products']);
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      return;
    }

    this.isLoading = true;
    
    // Convert form to product model
    const productData = {
      ...this.productForm.value
    };

    // For demonstration, just log the data and navigate back
    console.log('Product data to submit:', productData);
    console.log('Files to upload:', this.selectedFiles);
    
    // TODO: Implement actual API calls to save product
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/seller/products']);
    }, 1000);
  }
} 