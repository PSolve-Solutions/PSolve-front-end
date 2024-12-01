import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HocSideBarComponent } from './hoc-side-bar.component';

describe('HocSideBarComponent', () => {
  let component: HocSideBarComponent;
  let fixture: ComponentFixture<HocSideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HocSideBarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HocSideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
