import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAddProductComponent } from './simple-add-product.component';

describe('SimpleAddProductComponent', () => {
  let component: SimpleAddProductComponent;
  let fixture: ComponentFixture<SimpleAddProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimpleAddProductComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimpleAddProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
