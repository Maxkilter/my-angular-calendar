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
  selector: 'app-day-view',
  imports: [CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup, NgStyle],
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.scss',
})
export class DayViewComponent implements OnInit {
  private calendarService = inject(CalendarService);
  private appointmentsService = inject(AppointmentsService);

  viewDate = new Date();
  timeSlots = this.calendarService.timeSlots;
  monthDays = computed(() => this.calendarService.monthDays()[0]);
  appointments: Signal<Appointment[]> = computed(() =>
    this.appointmentsService.events(),
  );

  ngOnInit() {
    this.calendarService.generateDayView(this.viewDate);
  }

  onDrop(event: CdkDragDrop<Appointment[]>, date: Date, slot?: string) {
    return this.calendarService.drop(event, date, slot);
  }

  onSelectDate(date?: Date, startTime?: string) {
    return this.calendarService.selectDate(date, startTime);
  }

  handleAppointment(appointment: Appointment, event: Event) {
    event.stopPropagation();
    return this.calendarService.handleAppointment(appointment);
  }

  getFormattedTime(time: string): string {
    const date = new Date(time);
    return date.toLocaleTimeString(undefined, {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  appointmentsForDay(day: Date) {
    return this.calendarService.getAppointmentsForDay(day, this.appointments());
  }
}
