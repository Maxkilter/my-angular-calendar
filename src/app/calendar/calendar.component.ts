import { Component, computed, inject } from '@angular/core';
import { CdkDropListGroup } from '@angular/cdk/drag-drop';
import { MonthViewComponent } from './month-view/month-view.component';
import { WeekViewComponent } from './week-view/week-view.component';
import { HeaderComponent } from '../header/header.component';
import { DayViewComponent } from './day-view/day-view.component';
import { CalendarService } from '../services/calendar.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [
    CdkDropListGroup,
    MonthViewComponent,
    WeekViewComponent,
    HeaderComponent,
    DayViewComponent,
  ],
})
export class CalendarComponent {
  private calendarService = inject(CalendarService);

  currentView = computed(() => this.calendarService.currentView());
}
