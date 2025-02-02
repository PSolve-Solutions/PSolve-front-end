import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MentorLayoutComponent } from './mentor-layout.component';
describe('MentorLayoutComponent', () => {
  let component: MentorLayoutComponent;
  let fixture: ComponentFixture<MentorLayoutComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentorLayoutComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(MentorLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
