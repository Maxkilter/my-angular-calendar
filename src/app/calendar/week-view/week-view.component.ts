import { Component, computed, inject, OnInit, Signal } from "@angular/core";
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  CdkDropListGroup,
} from "@angular/cdk/drag-drop";
import { NgStyle } from "@angular/common";
import { CalendarService } from "../../services/calendar.service";
import { AppointmentsService } from "../../services/appointments.service";
import { Appointment } from "../../models/appointment.model";

@Component({
  selector: "app-week-view",
  imports: [CdkDrag, CdkDragHandle, CdkDropList, CdkDropListGroup, NgStyle],
  templateUrl: "./week-view.component.html",
  styleUrl: "./week-view.component.scss",
})
export class WeekViewComponent implements OnInit {
  private calendarService = inject(CalendarService);
  private appointmentsService = inject(AppointmentsService);

  weekDays = this.calendarService.weekDays;
  viewDate = new Date();
  monthDays = computed(() => this.calendarService.monthDays());
  timeSlots = this.calendarService.timeSlots;

  appointments: Signal<Appointment[]> = computed(() =>
    this.appointmentsService.events(),
  );

  ngOnInit(): void {
    this.calendarService.generateWeekView(this.viewDate);
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

  isToday(date: Date): boolean {
    return this.calendarService.isToday(date);
  }

  appointmentsForDay(day: Date) {
    return this.calendarService.getAppointmentsForDay(day, this.appointments());
  }
}
