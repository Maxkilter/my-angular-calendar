import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CalendarComponent } from './calendar.component';
import { CalendarService } from '../services/calendar.service';
import { CalendarView } from '../models/calendar-view.model';

describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let calendarService: CalendarService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    calendarService = TestBed.inject(CalendarService);

    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should render the header component', () => {
    const header = fixture.debugElement.query(By.css('app-header'));
    expect(header).toBeTruthy();
  });

  it('should display month view by default', () => {
    expect(calendarService.currentView()).toBe(CalendarView.Month);

    const monthView = fixture.debugElement.query(By.css('app-month-view'));
    expect(monthView).toBeTruthy();

    const weekView = fixture.debugElement.query(By.css('app-week-view'));
    expect(weekView).toBeNull();

    const dayView = fixture.debugElement.query(By.css('app-day-view'));
    expect(dayView).toBeNull();
  });

  it('should display week view when currentView is set to Week', () => {
    calendarService.currentView.set(CalendarView.Week);
    fixture.detectChanges();

    const weekView = fixture.debugElement.query(By.css('app-week-view'));
    expect(weekView).toBeTruthy();

    const monthView = fixture.debugElement.query(By.css('app-month-view'));
    expect(monthView).toBeNull();

    const dayView = fixture.debugElement.query(By.css('app-day-view'));
    expect(dayView).toBeNull();
  });

  it('should display day view when currentView is set to Day', () => {
    calendarService.currentView.set(CalendarView.Day);
    fixture.detectChanges();

    const dayView = fixture.debugElement.query(By.css('app-day-view'));
    expect(dayView).toBeTruthy();

    const monthView = fixture.debugElement.query(By.css('app-month-view'));
    expect(monthView).toBeNull();

    const weekView = fixture.debugElement.query(By.css('app-week-view'));
    expect(weekView).toBeNull();
  });
});
