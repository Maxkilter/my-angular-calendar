import { Component, computed, inject } from "@angular/core";
import { MatIcon } from "@angular/material/icon";
import {
  MatButtonToggle,
  MatButtonToggleGroup,
} from "@angular/material/button-toggle";
import { MatButton, MatIconButton } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { CalendarService } from "../services/calendar.service";
import { CalendarView } from "../models/calendar-view.model";

@Component({
  selector: "app-header",
  imports: [
    MatIcon,
    MatButtonToggle,
    MatButton,
    MatButtonToggleGroup,
    MatIconButton,
    DatePipe,
  ],
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.scss",
})
export class HeaderComponent {
  viewDate: Date = new Date();
  protected readonly CalendarView = CalendarView;

  private calendarService = inject(CalendarService);
  currentView = computed(() => this.calendarService.currentView());

  switchToView(newView: CalendarView) {
    return this.calendarService.switchToView(newView);
  }

  selectDate(date?: Date, startTime?: string) {
    return this.calendarService.selectDate(date, startTime);
  }

  viewToday(): void {
    this.viewDate = new Date();
    if (this.currentView() === CalendarView.Month) {
      return this.calendarService.generateMonthView(this.viewDate);
    }
    if (this.currentView() === CalendarView.Week) {
      return this.calendarService.generateWeekView(this.viewDate);
    }
    return this.calendarService.generateDayView(this.viewDate);
  }

  previous() {
    if (this.currentView() === CalendarView.Month) {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() - 1),
      );
      return this.calendarService.generateMonthView(this.viewDate);
    }
    if (this.currentView() === CalendarView.Week) {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() - 7),
      );
      return this.calendarService.generateWeekView(this.viewDate);
    }
    this.viewDate = new Date(
      this.viewDate.setDate(this.viewDate.getDate() - 1),
    );
    return this.calendarService.generateDayView(this.viewDate);
  }

  next() {
    if (this.currentView() === CalendarView.Month) {
      this.viewDate = new Date(
        this.viewDate.setMonth(this.viewDate.getMonth() + 1),
      );
      return this.calendarService.generateMonthView(this.viewDate);
    }
    if (this.currentView() === CalendarView.Week) {
      this.viewDate = new Date(
        this.viewDate.setDate(this.viewDate.getDate() + 7),
      );
      return this.calendarService.generateWeekView(this.viewDate);
    }
    this.viewDate = new Date(
      this.viewDate.setDate(this.viewDate.getDate() + 1),
    );
    return this.calendarService.generateDayView(this.viewDate);
  }
}
