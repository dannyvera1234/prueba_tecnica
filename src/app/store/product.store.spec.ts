import { TestBed } from '@angular/core/testing';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { PRODUCT_INITIAL_STATE } from './product.store';
import { of } from 'rxjs';
// Mock básico del ProductService
const mockProductService = {
  getProducts: jest.fn(() => of({ data: [{ id: '1', name: 'Product 1' }] })),
  createProduct: jest.fn(() => of({ data: { id: '2', name: 'New Product' } })),
  deleteProduct: jest.fn(() => of({})),
  updateProduct: jest.fn(() => of({}))
};

// Mock básico del Router
const mockRouter = {
  navigate: jest.fn()
};

describe('PRODUCT_INITIAL_STATE', () => {
  let store: InstanceType<typeof PRODUCT_INITIAL_STATE>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: ProductService, useValue: mockProductService },
        { provide: Router, useValue: mockRouter }
      ]
    });
  });

  it('should be created', () => {
    store = TestBed.inject(PRODUCT_INITIAL_STATE);
    expect(store).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have initial values', () => {
      // Verificación del estado inicial
      expect(store.Listproducts()).toEqual({ data: [] });
      expect(store.loading()).toBe(false);


      expect(store.itemsPerPage()).toBeDefined();
      expect(store.itemsPerPage()).toBeNull();

      // Verificación de modales
      expect(store.modals()).toEqual({
        addProduct: { isOpen: false },
        deleteProduct: { isOpen: false }
      });
    });
  });

  describe('Methods', () => {
    describe('Modal Management', () => {
      it('should open modal', () => {
        store.openModal('addProduct');
        expect(store.modals()["addProduct"].isOpen).toBe(true);
      });

      it('should close modal', () => {
        store.openModal('addProduct');
        store.closeModal('addProduct');
        expect(store.modals()["addProduct"].isOpen).toBe(false);
      });

      it('should check modal state', () => {
        expect(store.isModalOpen('addProduct')).toBe(false);
        store.openModal('addProduct');
        expect(store.isModalOpen('addProduct')).toBe(true);
      });
    });

    describe('Product Operations', () => {
      it('should fetch all products', (done) => {
        store.allProducts();

        setTimeout(() => {
          expect(mockProductService.getProducts).toHaveBeenCalled();
          expect(store.Listproducts().data.length).toBeGreaterThan(0);
          expect(store.loading()).toBe(false);
          done();
        }, 0);
      });

      it('should create product', (done) => {
        const mockForm = { value: { name: 'New' }, reset: jest.fn() };
        store.createProduct(mockForm);

        setTimeout(() => {
          expect(mockProductService.createProduct).toHaveBeenCalled();
          expect(store.Listproducts().data.some(p => p.name === 'New Product')).toBe(true);
          expect(mockForm.reset).toHaveBeenCalled();
          done();
        }, 0);
      });



      it('should update product', (done) => {
        const mockForm = { value: { name: 'Updated' }, reset: jest.fn() };
        store.updateProduct('1', mockForm);

        setTimeout(() => {
          expect(mockProductService.updateProduct).toHaveBeenCalled();
          expect(mockRouter.navigate).toHaveBeenCalledWith(['/product']);
          expect(mockForm.reset).toHaveBeenCalled();
          done();
        }, 0);
      });
    });
  });
});
