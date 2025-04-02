import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductComponent } from './product.component';
import { PRODUCT_INITIAL_STATE } from '../../store';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TextInitialsPipe } from '../../pipe';
import { DatePipe } from '@angular/common';
import { AddProductComponent } from './components/add-product/add-product.component';
import { DeleteProductComponent } from './components/delete-product/delete-product.component';

describe('ProductComponent', () => {
  let component: ProductComponent;
  let fixture: ComponentFixture<ProductComponent>;

  // Mock mínimo del store
  const mockProductStore = {
    allProducts: jest.fn(),
    searchTerm: jest.fn(),
    filterProducts: jest.fn(),
    idProduct: jest.fn(),
    // error: jest.fn(() => null),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductComponent, // Componente standalone
        FormsModule,
        RouterLink,
        DatePipe,
        TextInitialsPipe,
        AddProductComponent,
        DeleteProductComponent
      ],
      providers: [
        { provide: PRODUCT_INITIAL_STATE, useValue: mockProductStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and initialize', () => {


    // Verificaciones básicas
    expect(component).toBeTruthy();
    expect(component.searchTerm).toBe('');
    expect(component.isMenuOpen()).toBeNull();

    // Verificar que se llamó a allProducts al inicializar
    expect(mockProductStore.allProducts).toHaveBeenCalled();

    // Estos métodos NO deberían llamarse durante la inicialización
    expect(mockProductStore.filterProducts).not.toHaveBeenCalled();
    expect(mockProductStore.searchTerm).not.toHaveBeenCalled();
    expect(mockProductStore.idProduct).not.toHaveBeenCalled();
  });

  describe('Métodos del componente', () => {
    it('onSearch() debería llamar a métodos del store', () => {
      component.searchTerm = 'test';
      component.onSearch();

      expect(mockProductStore.searchTerm).toHaveBeenCalledWith('test');
      expect(mockProductStore.filterProducts).toHaveBeenCalled();
    });

    it('toggleMenu() debería alternar el menú', () => {
      // Menú cerrado -> abrir
      component.toggleMenu(1);
      expect(component.isMenuOpen()).toBe(1);

      // Menú abierto -> cerrar (mismo índice)
      component.toggleMenu(1);
      expect(component.isMenuOpen()).toBeNull();

      // Menú abierto -> cambiar a otro índice
      component.toggleMenu(2);
      expect(component.isMenuOpen()).toBe(2);
    });


  });


  describe('HostListener', () => {
    it('debería cerrar el menú al hacer click fuera', () => {
      component.isMenuOpen.set(1);
      const event = new MouseEvent('click');
      component.onClickOutside(event);
      expect(component.isMenuOpen()).toBeNull();
    });

    it('no debería cerrar el menú al hacer click dentro', () => {
      component.isMenuOpen.set(1);
      const element = fixture.debugElement.nativeElement;
      const event = new MouseEvent('click', { bubbles: true });

      jest.spyOn(element, 'contains').mockReturnValue(true);

      component.onClickOutside(event);
      expect(component.isMenuOpen()).toBe(1);
    });
  });
});
