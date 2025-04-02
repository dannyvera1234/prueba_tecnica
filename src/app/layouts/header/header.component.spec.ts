import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ElementRef } from '@angular/core';
import { HeaderComponent } from './header.component';
import { fireEvent } from '@testing-library/angular';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let menuContainerMock: ElementRef;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    menuContainerMock = { nativeElement: document.createElement('div') };
    component.menuContainer = menuContainerMock;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu state when toggleMenu is called', () => {
    expect(component.isMenuOpen()).toBe(false);
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(true);
    component.toggleMenu();
    expect(component.isMenuOpen()).toBe(false);
  });

  it('should close menu when clicking outside', () => {
    component.isMenuOpen.set(true);
    fixture.detectChanges();

    const clickEvent = new MouseEvent('click', { bubbles: true });
    document.dispatchEvent(clickEvent);

    expect(component.isMenuOpen()).toBe(false);
  });

  it('should not close menu when clicking inside', () => {
    component.isMenuOpen.set(true);
    fixture.detectChanges();

    fireEvent.click(menuContainerMock.nativeElement);
    expect(component.isMenuOpen()).toBe(true);
  });
});
