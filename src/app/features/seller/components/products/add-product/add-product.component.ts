import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators,
  FormsModule,
  AbstractControl,
  ValidatorFn,
  ValidationErrors,
  FormControl
} from '@angular/forms';

import { ProductService } from '../../../../../core/services/product.service';
import { NotifierService } from '../../../../../core/services/notifier.service';
import { NotificationType } from '../../../../../core/models/enums/notification-type';
import { Product, ProductVariant, VariantOption } from '../../../../../core/models/product.model';
import { Observable, of } from 'rxjs';
import { map, startWith, debounceTime, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule
  ],
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  productForm!: FormGroup;
  isLoading = false;
  isSubmitting = false;
  imagePreview: { url: string; selected: boolean }[] = [];
  generatedVariants: ProductVariant[] = [];
  displayedColumns: string[] = ['variantName', 'price', 'availableQuantity'];
  isEditMode = false;
  productId: string | null = null;
  selectedImagesCount = 0;
  allImagesSelected = false;
  isDuplicated = false;
  hasUnsavedChanges = false;
  
  // Tags support
  tags: string[] = [];
  filteredTags: Observable<any[]> = of([]);
  tagSearchControl = new FormControl('');
  isTagDataDirty = false;
  isTagCardDisabled = false;
  tagInputValue = '';
  initialTags: string[] = [];
  
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notifierService: NotifierService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.setupVariantGeneration();
    this.setupTagSearch();
    
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.isEditMode = true;
        this.loadProduct(this.productId);
      }
      
      this.productForm.valueChanges.subscribe(() => {
        if (this.isDuplicated) {
          this.hasUnsavedChanges = true;
        }
      });
    });
  }
  
  private initForm(): void {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1)]],
      description: [''],
      images: this.fb.array([], [Validators.required, Validators.minLength(1)]),
      options: this.fb.array([], [this.uniqueOptionValuesValidator()])
    });
  }
  
  private setupTagSearch(): void {
    this.filteredTags = this.tagSearchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      switchMap(value => {
        if (typeof value === 'string') {
          return this.searchTags(value);
        }
        return of([]);
      })
    );
  }
  
  searchTags(query: string): Observable<any[]> {
    if (!query || query.trim() === '') {
      return of([]);
    }

    return this.productService.searchTags('product').pipe(
      map(tags => {
        const searchValue = query.toLowerCase();
        const filteredTags = tags.filter(tag => 
          tag.name.toLowerCase().includes(searchValue)
        );

        return [
          {
            id: 'new',
            name: `Add "${query}"`,
            kind: 'product'
          },
          ...filteredTags
        ];
      })
    );
  }
  
  displayTagFn(tag: any): string {
    return tag ? tag.name : '';
  }
  
  onTagSelected(event: any, tag: any): void {
    if (event.isUserInput) {
      const tagName = tag.id === 'new' 
        ? tag.name.replace('Add "', '').replace('"', '')
        : tag.name;

      if (!this.tags.includes(tagName)) {
        this.tags.push(tagName);
        this.isTagDataDirty = true;
      } else {
        this.notifierService.showNotification(
          'Tag already exists',
          'OK',
          NotificationType.WARNING
        );
      }
      this.tagSearchControl.setValue('');
    }
  }
  
  addTag(): void {
    const value = this.tagInputValue.trim();
    if (value && !this.tags.includes(value)) {
      this.tags.push(value);
      this.isTagDataDirty = true;
      this.tagInputValue = '';
    } else if (this.tags.includes(value)) {
      this.notifierService.showNotification(
        'Tag already exists',
        'OK',
        NotificationType.WARNING
      );
    }
  }
  
  removeTag(tag: string): void {
    if (this.isTagCardDisabled) return;

    const index = this.tags.indexOf(tag);
    if (index >= 0) {
      this.tags.splice(index, 1);
      this.isTagDataDirty = true;
    }
  }
  
  onCancelTagChanges(): void {
    const confirmed = confirm('Are you sure you want to discard the recent tag changes? This cannot be undone.');
    if (confirmed) {
      this.tags = [...this.initialTags];
      this.isTagDataDirty = false;
      this.tagInputValue = '';

      this.notifierService.showNotification(
        'Tag changes discarded',
        'OK',
        NotificationType.SUCCESS
      );
    }
  }
  
  onSaveTagChanges(): void {
    if (!this.productId || !this.isTagDataDirty) return;

    this.isTagCardDisabled = true;
    this.isLoading = true;

    this.productService.addTagToProduct(this.productId, this.tags).subscribe({
      next: () => {
        this.isLoading = false;
        this.isTagDataDirty = false;
        this.isTagCardDisabled = false;
        this.initialTags = [...this.tags];

        this.notifierService.showNotification(
          'Tags updated successfully',
          'OK',
          NotificationType.SUCCESS
        );
      },
      error: (error) => {
        console.error('Error updating tags:', error);
        this.isLoading = false;
        this.isTagCardDisabled = false;
        this.notifierService.showNotification(
          'Error updating tags',
          'OK',
          NotificationType.ERROR
        );
      }
    });
  }
  
  showUploadSection(): boolean {
    return this.imagePreview.length === 0;
  }
  
  hasImages(): boolean {
    return this.imagePreview.length > 0;
  }
  
  hasSelectedImages(): boolean {
    return this.selectedImagesCount > 0;
  }

  someImagesSelected(): boolean {
    return this.selectedImagesCount > 0 && this.selectedImagesCount < this.imagePreview.length;
  }

  triggerFileInput(event: Event): void {
    event.preventDefault();
    if (this.fileInput?.nativeElement) {
      this.fileInput.nativeElement.click();
    } else {
      console.warn('File input element not found');
    }
  }
  
  toggleImageSelection(index: number): void {
    this.imagePreview[index].selected = !this.imagePreview[index].selected;
    this.updateSelectedImagesCount();
    this.updateAllImagesSelectedState();
  }

  updateSelectedImagesCount(): void {
    this.selectedImagesCount = this.imagePreview.filter(img => img.selected).length;
  }

  updateAllImagesSelectedState(): void {
    this.allImagesSelected = 
      this.imagePreview.length > 0 && 
      this.imagePreview.every(img => img.selected);
  }

  toggleSelectAll(checked: boolean): void {
    this.imagePreview.forEach(img => img.selected = checked);
    this.updateSelectedImagesCount();
    this.updateAllImagesSelectedState();
  }

  removeSelectedImages(): void {
    const selectedIndices = this.imagePreview
      .map((img, index) => img.selected ? index : -1)
      .filter(index => index !== -1)
      .sort((a, b) => b - a); // Sort in descending order to remove from end to start

    // Remove from the imagesFormArray as well
    const imagesArray = this.productForm.get('images') as FormArray;
    selectedIndices.forEach(index => {
      imagesArray.removeAt(index);
    });

    // Remove from the preview array
    selectedIndices.forEach(index => {
      this.imagePreview.splice(index, 1);
    });

    this.selectedImagesCount = 0;
    this.allImagesSelected = false;
  }
  
  onFileSelected(event: any): void {
    const files: File[] = event.target.files;
    this.handleFiles(files);
  }

  onDragOver(event: any): void {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: any): void {
    event.preventDefault();
    event.stopPropagation();
    const files: File[] = event.dataTransfer.files;
    this.handleFiles(files);
  }

  private handleFiles(files: File[]): void {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) {
        this.notifierService.showNotification(
          'Please select only image files.',
          'OK',
          NotificationType.WARNING
        );
        continue;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        const base64String = e.target.result;
        const cleanBase64 = base64String.split(',')[1];
        this.imagePreview.push({ url: base64String, selected: false });
        this.addImageUrl(cleanBase64);
      };
      reader.readAsDataURL(file);
    }
  }
  
  get imagesFormArray(): FormArray {
    return this.productForm.get('images') as FormArray;
  }

  get optionsFormArray(): FormArray {
    return this.productForm.get('options') as FormArray;
  }

  getOptionValuesFormArray(index: number): FormArray {
    return (this.optionsFormArray.at(index) as FormGroup).get('values') as FormArray;
  }

  addImageUrl(url: string): void {
    this.imagesFormArray.push(this.fb.control(url));
  }
  
  private setupVariantGeneration(): void {
    const optionsArray = this.productForm.get('options') as FormArray;
    optionsArray.valueChanges.subscribe(() => {
      if (this.isEditMode) {
        // Store current variant data before regenerating
        const currentVariants = this.generatedVariants.map(v => ({
          name: v.name,
          price: v.price,
          availableQuantity: v.availableQuantity,
          committedQuantity: v.committedQuantity
        }));

        // Generate new variants
        this.generateVariants();

        // Restore data for matching variants
        this.generatedVariants = this.generatedVariants.map(variant => {
          const existing = currentVariants.find(e => e.name === variant.name);
          if (existing) {
            return {
              ...variant,
              price: existing.price,
              availableQuantity: existing.availableQuantity,
              committedQuantity: existing.committedQuantity
            };
          }
          return variant;
        });
      } else {
        this.generateVariants();
      }
    });
  }
  
  private loadProduct(id: string): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Set form values
        this.productForm.patchValue({
          title: product.title,
          description: product.description
        });

        // Load images
        if (product.imgUrls && product.imgUrls.length > 0) {
          this.imagePreview = product.imgUrls.map(url => ({
            url,
            selected: false
          }));
          this.imagesFormArray.clear();
          product.imgUrls.forEach(url => this.addImageUrl(url));
        }

        // Load options and generate variants
        this.loadOptions(product);

        // Map existing variants with their prices and quantities
        if (product.variants && product.variants.length > 0) {
          this.generatedVariants = product.variants.map(variant => ({
            ...variant,
            name: variant.name,
            price: variant.price,
            availableQuantity: variant.availableQuantity,
            committedQuantity: variant.committedQuantity
          }));
        }

        // Handle tags
        this.tags = product.tags || [];
        this.initialTags = [...this.tags];
        this.isTagDataDirty = false;
        this.tagSearchControl.setValue('');

        this.isLoading = false;
        this.isTagCardDisabled = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.notifierService.showNotification(
          'Error loading product',
          'OK',
          NotificationType.ERROR
        );
        this.isLoading = false;
      }
    });
  }
  
  private loadOptions(product: any): void {
    this.optionsFormArray.clear();

    if (product.options) {
      product.options.forEach((option: any) => {
        const optionGroup = this.fb.group({
          name: [option.name, Validators.required],
          values: this.fb.array([], [this.uniqueValuesValidator()])
        });

        const valuesArray = optionGroup.get('values') as FormArray;
        option.values.forEach((value: string) => {
          valuesArray.push(this.fb.control(value, Validators.required));
        });

        this.optionsFormArray.push(optionGroup);
      });
    }
  }
  
  private uniqueValuesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const values = control.value as string[];
      const uniqueValues = new Set(values);
      
      if (values.length !== uniqueValues.size) {
        return { duplicate: true };
      }
      
      return null;
    };
  }
  
  private uniqueOptionValuesValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const optionsArray = control as FormArray;
      const errors: ValidationErrors = {};
      
      // Check for duplicate option names
      const optionNames = optionsArray.controls.map(
        option => (option as FormGroup).get('name')?.value?.trim().toLowerCase()
      );
      
      const uniqueNames = new Set(optionNames.filter(name => name));
      if (optionNames.filter(name => name).length !== uniqueNames.size) {
        errors['duplicateOptionNames'] = true;
      }
      
      // Check for duplicate values within each option
      let hasDuplicateValues = false;
      optionsArray.controls.forEach(option => {
        const valuesArray = (option as FormGroup).get('values') as FormArray;
        const values = valuesArray.controls.map(c => c.value?.trim().toLowerCase());
        const uniqueValues = new Set(values.filter(v => v));
        
        if (values.filter(v => v).length !== uniqueValues.size) {
          hasDuplicateValues = true;
        }
      });
      
      if (hasDuplicateValues) {
        errors['duplicateOptionValues'] = true;
      }
      
      return Object.keys(errors).length ? errors : null;
    };
  }
  
  addOption(event: Event): void {
    event.preventDefault();
    const newOption = this.fb.group({
      name: ['', Validators.required],
      values: this.fb.array([], [this.uniqueValuesValidator()])
    });
    
    this.optionsFormArray.push(newOption);
    this.addOptionValue(event, this.optionsFormArray.length - 1);
  }
  
  removeOption(event: Event, index: number): void {
    event.preventDefault();
    this.optionsFormArray.removeAt(index);
    this.generateVariants();
  }
  
  addOptionValue(event: Event, optionIndex: number): void {
    event.preventDefault();
    const valuesArray = this.getOptionValuesFormArray(optionIndex);
    valuesArray.push(this.fb.control('', Validators.required));
  }
  
  removeOptionValue(event: Event, optionIndex: number, valueIndex: number): void {
    event.preventDefault();
    const valuesArray = this.getOptionValuesFormArray(optionIndex);
    valuesArray.removeAt(valueIndex);
    
    if (valuesArray.length === 0) {
      this.removeOption(event, optionIndex);
    }
  }
  
  generateVariants(): void {
    const options = this.optionsFormArray.value as VariantOption[];
    if (!options.length) {
      this.generatedVariants = [];
      return;
    }

    // Convert Observable<ProductVariant[]> to ProductVariant[] 
    this.productService.generateVariants(options).subscribe(variants => {
      this.generatedVariants = variants;
    });
  }
  
  updateVariantPrice(variant: ProductVariant, event: any): void {
    const price = parseFloat(event.target.value);
    variant.price = isNaN(price) ? 0 : price;
  }
  
  updateVariantQuantity(variant: ProductVariant, event: any): void {
    const quantity = parseInt(event.target.value, 10);
    variant.availableQuantity = isNaN(quantity) ? 0 : quantity;
  }
  
  goBack(): void {
    this.router.navigate(['/seller/products']);
  }
  
  openDuplicateDialog(): void {
    if (confirm('Do you want to duplicate this product with media?')) {
      this.duplicateProduct(true);
    } else if (confirm('Do you want to duplicate without media?')) {
      this.duplicateProduct(false);
    }
  }
  
  private duplicateProduct(withMedia: boolean): void {
    if (!this.productId) return;
    
    this.isLoading = true;
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        const duplicatedTitle = `${product.title} (Copy)`;
        
        // Reset the form with the duplicated data
        this.productForm.patchValue({
          title: duplicatedTitle,
          description: product.description
        });
        
        // Handle images
        if (withMedia && product.imgUrls && product.imgUrls.length > 0) {
          this.imagePreview = product.imgUrls.map(url => ({
            url,
            selected: false
          }));
          
          this.imagesFormArray.clear();
          product.imgUrls.forEach(url => this.addImageUrl(url));
        } else {
          this.imagePreview = [];
          this.imagesFormArray.clear();
        }
        
        // Handle options
        this.loadOptions(product);
        
        // Handle variants with prices and quantities
        this.generatedVariants = product.variants && product.variants.length > 0 
          ? product.variants.map(variant => ({
              ...variant,
              variantId: variant.variantId,
              availableQuantity: variant.availableQuantity,
              committedQuantity: variant.committedQuantity
            }))
          : [this.createDefaultVariant(0, duplicatedTitle)];
          
        // Handle tags
        this.tags = [...(product.tags || [])];
        this.initialTags = [...this.tags];
        this.tagSearchControl.setValue('');
        
        // Set duplication mode
        this.isDuplicated = true;
        this.productId = null;
        this.isEditMode = false;
        this.hasUnsavedChanges = true;
        
        // Update UI
        this.isLoading = false;
        this.isTagCardDisabled = false;
        
        this.notifierService.showNotification(
          `Product duplicated. Don't forget to save the new copy.`,
          'OK',
          NotificationType.SUCCESS
        );
      },
      error: (error) => {
        console.error('Error duplicating product:', error);
        this.notifierService.showNotification(
          'Error duplicating product',
          'OK',
          NotificationType.ERROR
        );
        this.isLoading = false;
      }
    });
  }
  
  private createDefaultVariant(basePrice: number, productTitle: string): ProductVariant {
    return {
      name: `${productTitle} - Standard`,
      price: basePrice || 0,
      variantId: 1,
      sku: `DEFAULT-SKU-${Date.now()}`,
      isActive: true,
      availableQuantity: 0,
      committedQuantity: 0
    };
  }

  private ensureVariantsExist(): void {
    if (this.generatedVariants.length === 0) {
      const title = this.productForm.get('title')?.value || 'Product';
      this.generatedVariants.push(this.createDefaultVariant(0, title));
    }
  }

  private processImages(): { images: string[]; imgUrls: string[] } {
    const imgUrls: string[] = [];
    const images: string[] = [];

    this.imagePreview.forEach(img => {
      if (img.url.startsWith('data:')) {
        // This is a base64 image
        const base64Data = img.url.split(',')[1];
        images.push(base64Data);
      } else {
        // This is an existing image URL
        imgUrls.push(img.url);
      }
    });

    return { images, imgUrls };
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      this.notifierService.showNotification(
        'Please fill in all required fields correctly.',
        'OK',
        NotificationType.WARNING
      );
      return;
    }

    this.ensureVariantsExist();

    // Validate variants have valid data
    const invalidVariants = this.generatedVariants.filter(
      variant => 
        (variant.price !== undefined && variant.price < 0) || 
        (variant.availableQuantity !== undefined && variant.availableQuantity < 0)
    );

    if (invalidVariants.length > 0) {
      const errorMessages = invalidVariants.map(variant => {
        const issues: string[] = [];
        if (variant.price !== undefined && variant.price < 0) {
          issues.push(`Price (${variant.price})`);
        }
        if (variant.availableQuantity !== undefined && variant.availableQuantity < 0) {
          issues.push(`Quantity (${variant.availableQuantity})`);
        }
        return `${variant.name}: ${issues.join(' and ')} cannot be negative`;
      });

      this.notifierService.showNotification(
        `Please fix the following issues: ${errorMessages.join(', ')}`,
        'OK',
        NotificationType.WARNING
      );
      return;
    }

    if (this.productForm.valid && this.imagePreview.length > 0) {
      this.isLoading = true;
      const { images, imgUrls } = this.processImages();

      const productData: Product = {
        id: this.productId || '',
        title: this.productForm.get('title')!.value,
        description: this.productForm.get('description')!.value,
        variants: this.generatedVariants,
        options: this.optionsFormArray.length > 0 ? this.productForm.get('options')!.value : [],
        imgUrls: imgUrls,
        tags: this.tags
      };

      if (this.isEditMode) {
        if (images.length > 0) {
          productData.images = images;
        }
      } else {
        productData.images = images;
      }

      if (this.isEditMode && this.productId) {
        // Update existing product
        this.productService.updateProduct(productData)
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.isDuplicated = false;
              this.hasUnsavedChanges = false;

              this.notifierService.showNotification(
                'Product updated successfully',
                'OK',
                NotificationType.SUCCESS
              );

              this.router.navigate(['/seller/products']);
            },
            error: (err: any) => {
              this.isLoading = false;
              this.notifierService.showNotification(
                'Error updating product',
                'OK',
                NotificationType.ERROR
              );
              console.error('Error updating product:', err);
            }
          });
      } else {
        // Create a new product
        this.productService.createProduct(productData)
          .subscribe({
            next: (newProductId: string) => {
              this.isLoading = false;
              this.isDuplicated = false;
              this.hasUnsavedChanges = false;

              this.notifierService.showNotification(
                'Product added successfully',
                'OK',
                NotificationType.SUCCESS
              );

              this.router.navigate(['/seller/products']);
            },
            error: (err: any) => {
              this.isLoading = false;
              this.notifierService.showNotification(
                'Error adding product',
                'OK',
                NotificationType.ERROR
              );
              console.error('Error adding product:', err);
            }
          });
      }
    } else {
      const validationErrors: string[] = [];
      
      if (this.productForm.get('title')?.invalid) {
        validationErrors.push('Title is required');
      }
      
      if (this.imagePreview.length === 0) {
        validationErrors.push('At least one image is required');
      }
      
      this.notifierService.showNotification(
        `Please fix the following issues: ${validationErrors.join(', ')}`,
        'OK',
        NotificationType.WARNING
      );
    }
  }
} 