import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { AppointmentsService } from './appointments.service';
import { CalendarView } from '../models/calendar-view.model';
import { Appointment } from '../models/appointment.model';

const SLOT_HEIGHT = 50;
const HOURS_IN_DAY = 24;
const DAYS_IN_WEEK = 7;
const MINUTES_IN_HOUR = 60;
const BEFORE_MIDDAY = 'AM';
const AFTER_MIDDAY = 'PM';

const convert12To24 = (value: string): string => {
  const [time, modifier] = value.trim().split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier.toUpperCase() === AFTER_MIDDAY && hours < 12) {
    hours += 12;
  }
  if (modifier.toUpperCase() === BEFORE_MIDDAY && hours === 12) {
    hours = 0;
  }
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  selectedDate: Date | null = null;
  selectedStartTime: string | undefined;
  timeSlots: string[] = [];
  weekDays: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  monthDays = signal<Date[]>([]);
  weeks = signal<Date[][]>([]);
  currentView = signal<CalendarView>(CalendarView.Month);

  private appointmentsService = inject(AppointmentsService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  destroyRef = inject(DestroyRef);

  private dateCache = new Map<string, boolean>();

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const navEnd = event as NavigationEnd;
        const url = navEnd.urlAfterRedirects;
        const viewParam = url.split('/')[1];
        if (viewParam) {
          switch (viewParam.toLowerCase()) {
            case CalendarView.Month:
              this.currentView.set(CalendarView.Month);
              break;
            case CalendarView.Week:
              this.currentView.set(CalendarView.Week);
              break;
            case CalendarView.Day:
              this.currentView.set(CalendarView.Day);
              break;
            default:
              break;
          }
        }
      });
    this.generateTimeSlots();
  }

  startOfWeek(date: Date): Date {
    const start = new Date(date);
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    return start;
  }

  generateMonthView(date: Date) {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const allDays: Date[] = [];
    const allWeeks: Date[][] = [];
    let week: Date[] = [];

    for (let i = start.getDay(); i > 0; i--) {
      const prevDate = new Date(start);
      prevDate.setDate(start.getDate() - i);
      week.push(prevDate);
      allDays.push(prevDate);
    }

    for (let day = 1; day <= end.getDate(); day++) {
      const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
      week.push(currentDate);
      allDays.push(currentDate);
      if (week.length === DAYS_IN_WEEK) {
        allWeeks.push(week);
        week = [];
      }
    }

    if (week.length > 0) {
      let nextDay = 1;
      while (week.length < DAYS_IN_WEEK) {
        const nextDate = new Date(end);
        nextDate.setDate(end.getDate() + nextDay);
        week.push(nextDate);
        allDays.push(nextDate);
        nextDay++;
      }
      allWeeks.push(week);
    }

    this.monthDays.set(allDays);
    this.weeks.set(allWeeks);
  }

  generateWeekView(date: Date) {
    const startOfWeek = this.startOfWeek(date);
    this.monthDays.set([]);

    for (let day = 0; day < DAYS_IN_WEEK; day++) {
      const weekDate = new Date(startOfWeek);
      weekDate.setDate(startOfWeek.getDate() + day);
      this.monthDays.update((days) => [...days, weekDate]);
    }
  }

  generateDayView(date: Date) {
    this.monthDays.set([date]);
  }

  drop(event: CdkDragDrop<Appointment[]>, newDate: Date, slot?: string) {
    const movedAppointment = event.item.data;

    const originalStart = new Date(movedAppointment.start);
    const originalEnd = new Date(movedAppointment.end);

    let durationMs = originalEnd.getTime() - originalStart.getTime();
    let newStartTimeStr: string;

    if (slot) {
      newStartTimeStr = slot;
      if (
        newStartTimeStr.includes(BEFORE_MIDDAY) ||
        newStartTimeStr.includes(AFTER_MIDDAY)
      ) {
        newStartTimeStr = convert12To24(newStartTimeStr);
      }
    } else {
      newStartTimeStr = originalStart.toTimeString().substring(0, 5); // "HH:mm"
    }

    // Parse the new start hour and minute.
    const timeParts = newStartTimeStr.split(':');
    const newStartHour = Number(timeParts[0]);
    const newStartMinute = Number(timeParts[1]);
    // Create a new Date for the appointment's start by combining newDate and the new time.
    const updatedStart = new Date(newDate);
    updatedStart.setHours(newStartHour, newStartMinute, 0, 0);
    // Compute the new end DateTime by adding the original duration.
    const updatedEnd = new Date(updatedStart.getTime() + durationMs);

    movedAppointment.start = updatedStart.toISOString();
    movedAppointment.end = updatedEnd.toISOString();

    this.appointmentsService.updateEvent(movedAppointment);
  }

  addAppointment({
    title,
    start,
    end,
    description,
  }: Omit<Appointment, 'color'>) {
    this.appointmentsService.addEvent({
      title,
      start,
      end,
      description,
    });
  }

  openDialog(): void {
    const now = new Date();
    const baseDate = this.selectedDate ? new Date(this.selectedDate) : now;

    const startTime24 = this.selectedStartTime
      ? convert12To24(this.selectedStartTime)
      : `${now.getHours()}:${now.getMinutes()}`;

    const [startHour, startMinute] = startTime24.split(':').map(Number);

    const startDate = new Date(baseDate);
    startDate.setHours(startHour, startMinute, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(endDate.getHours() + 1);

    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
    });

    const subscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.addAppointment({
          title: result.title,
          start: result.start,
          end: result.end,
          description: result.description,
        });
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  handleAppointment(appointment: Appointment): void {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: appointment,
    });

    const subscription = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.remove) {
          return this.appointmentsService.removeEvent(result.uuid);
        }
        return this.appointmentsService.updateEvent({
          ...appointment,
          title: result.title,
          start: result.start,
          end: result.end,
          description: result.description,
        });
      }
    });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  switchToView(newView: CalendarView) {
    this.router.navigate([newView.toLowerCase()]).then(() => {
      this.currentView.set(newView);
    });
  }

  generateTimeSlots() {
    for (let hour = 0; hour < HOURS_IN_DAY; hour++) {
      const period = hour < 12 ? BEFORE_MIDDAY : AFTER_MIDDAY;
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const hourStr = displayHour < 10 ? `0${displayHour}` : `${displayHour}`;
      this.timeSlots.push(`${hourStr}:00 ${period}`);
    }
  }

  selectDate(date?: Date, startTime?: string) {
    this.selectedDate = date ? date : new Date();
    this.selectedStartTime = startTime;
    this.openDialog();
  }

  isToday(date: Date): boolean {
    const dateKey = date.toISOString();
    if (this.dateCache.has(dateKey)) {
      return this.dateCache.get(dateKey)!;
    }

    const today = new Date();
    const result =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    this.dateCache.set(dateKey, result);
    return result;
  }

  isSameDate(date1: Date | string, date2: Date): boolean {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    return (
      d1.getDate() === date2.getDate() &&
      d1.getMonth() === date2.getMonth() &&
      d1.getFullYear() === date2.getFullYear()
    );
  }

  getAppointmentLayout(appointment: Appointment): {
    startSlotIndex: number;
    appointmentTop: string;
    appointmentHeight: string;
  } {
    // Parse the start and end as full Date objects.
    const appointmentStart = new Date(appointment.start);
    const appointmentEnd = new Date(appointment.end);
    // Compute the full duration in minutes.
    const durationInMinutes =
      (appointmentEnd.getTime() - appointmentStart.getTime()) / 60000;
    // Determine the starting slot based on the local hour.
    const startSlotIndex = appointmentStart.getHours();
    // Calculate the vertical offset within the starting hour.
    const minutesIntoHour = appointmentStart.getMinutes();
    const appointmentTop = `${(minutesIntoHour / MINUTES_IN_HOUR) * SLOT_HEIGHT}px`;

    const appointmentHeight = `${(durationInMinutes / MINUTES_IN_HOUR) * SLOT_HEIGHT}px`;

    return {
      startSlotIndex,
      appointmentTop,
      appointmentHeight,
    };
  }

  getAppointmentsForDay(
    day: Date,
    appointments: Appointment[],
  ): (Appointment & {
    layout: {
      appointmentTop: string;
      appointmentHeight: string;
      startSlotIndex: number;
    };
  })[] {
    return appointments
      .filter((appointment: Appointment) =>
        this.isSameDate(appointment.start, day),
      )
      .map((appointment) => {
        const layout = this.getAppointmentLayout(appointment);
        return {
          ...appointment,
          layout,
        };
      });
  }
}
