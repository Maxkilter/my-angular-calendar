import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
} from '@angular/cdk/drag-drop';
import { NgStyle } from '@angular/common';
import { CalendarService } from '../../services/calendar.service';
import { AppointmentsService } from '../../services/appointments.service';
import { Appointment } from '../../models/appointment.model';

@Component({
  selector: 'app-month-view',
  imports: [CdkDropListGroup, CdkDropList, NgStyle, CdkDrag, CdkDragHandle],
  templateUrl: './month-view.component.html',
  styleUrl: './month-view.component.scss',
})
export class MonthViewComponent implements OnInit {
  private calendarService = inject(CalendarService);
  private appointmentsService = inject(AppointmentsService);

  weekDays = this.calendarService.weekDays;
  viewDate = new Date();
  weeks = computed(() => this.calendarService.weeks());

  appointments: Signal<Appointment[]> = computed(() =>
    this.appointmentsService.events(),
  );

  ngOnInit(): void {
    this.calendarService.generateMonthView(this.viewDate);
  }

  isToday(date: Date): boolean {
    return this.calendarService.isToday(date);
  }

  isSameDate(date1: Date | string, date2: Date): boolean {
    return this.calendarService.isSameDate(date1, date2);
  }

  isCurrentMonth(date: Date): boolean {
    return (
      date.getMonth() === this.viewDate.getMonth() &&
      date.getFullYear() === this.viewDate.getFullYear()
    );
  }

  onDrop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
    this.calendarService.drop(event, date, slot);
  }

  onSelectDate(date?: Date, startTime?: string) {
    this.calendarService.selectDate(date, startTime);
  }

  handleAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();
    return this.calendarService.handleAppointment(appointment);
  }
}
