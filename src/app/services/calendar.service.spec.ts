import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CalendarService } from './calendar.service';
import { CalendarView } from '../models/calendar-view.model';
import { Appointment } from '../models/appointment.model';
import { Router } from '@angular/router';
import { of, Subject } from 'rxjs';
import { AppointmentsService } from './appointments.service';
import { MatDialog } from '@angular/material/dialog';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { mockAppointment } from '../mocks/mock-appointment';

class FakeRouter {
  public events = new Subject<any>();
  navigate = jasmine
    .createSpy('navigate')
    .and.returnValue(Promise.resolve(true));
}

class FakeAppointmentsService {
  updateEvent = jasmine.createSpy('updateEvent');
  addEvent = jasmine.createSpy('addEvent');
  removeEvent = jasmine.createSpy('removeEvent');
}

class FakeMatDialog {
  open(component: any, config: any) {
    return {
      afterClosed: () => of(config.data),
    };
  }
}

describe('CalendarService', () => {
  let service: CalendarService;
  let router: FakeRouter;
  let appointmentsService: FakeAppointmentsService;
  let dialog: FakeMatDialog;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CalendarService,
        { provide: Router, useClass: FakeRouter },
        { provide: AppointmentsService, useClass: FakeAppointmentsService },
        { provide: MatDialog, useClass: FakeMatDialog },
      ],
    });
    service = TestBed.inject(CalendarService);
    router = TestBed.inject(Router) as unknown as FakeRouter;
    appointmentsService = TestBed.inject(
      AppointmentsService,
    ) as unknown as FakeAppointmentsService;
    dialog = TestBed.inject(MatDialog) as unknown as FakeMatDialog;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate time slots on construction', () => {
    expect(service.timeSlots.length).toBe(24);
    expect(service.timeSlots[0]).toBe('12:00 AM');
    expect(service.timeSlots[23]).toBe('11:00 PM');
  });

  describe('generateMonthView', () => {
    it('should build a correct month view (days and weeks)', () => {
      const testDate = new Date(2025, 0, 15);
      service.generateMonthView(testDate);
      const monthDays = service.monthDays();
      const weeks = service.weeks();

      expect(monthDays.length).toBeGreaterThan(28);
      expect(weeks.length).toBeGreaterThanOrEqual(4);
      weeks.forEach((week) => {
        expect(week.length).toBe(7);
      });
    });
  });

  describe('generateWeekView', () => {
    it('should generate exactly 7 days for week view', () => {
      const testDate = new Date(2025, 0, 15);
      service.generateWeekView(testDate);
      const weekDays = service.monthDays();
      expect(weekDays.length).toBe(7);
    });
  });

  describe('generateDayView', () => {
    it('should generate a single day view', () => {
      const testDate = new Date(2025, 0, 15);
      service.generateDayView(testDate);
      const dayArray = service.monthDays();
      expect(dayArray.length).toBe(1);
      expect(dayArray[0].getTime()).toBe(testDate.getTime());
    });
  });

  describe('switchToView', () => {
    it('should update currentView and navigate via the router', fakeAsync(() => {
      service.switchToView(CalendarView.Week);
      tick();

      expect(router.navigate).toHaveBeenCalledWith([CalendarView.Week]);
      expect(service.currentView()).toBe(CalendarView.Week);
    }));
  });

  describe('drop', () => {
    it('should call updateEvent on appointmentsService when dropping an appointment', () => {
      const dropEvent = {
        item: { data: mockAppointment },
      } as CdkDragDrop<Appointment[]>;

      service.drop(dropEvent, new Date(mockAppointment.start), '10:00 AM');
      expect(appointmentsService.updateEvent).toHaveBeenCalled();
    });
  });

  describe('addAppointment', () => {
    it('should call addEvent on appointmentsService', () => {
      service.addAppointment(mockAppointment);
      expect(appointmentsService.addEvent).toHaveBeenCalled();
    });
  });

  describe('openDialog', () => {
    it('should open the modal and add an appointment on dialog close', () => {
      service.selectedDate = new Date(mockAppointment.start);
      service.selectedStartTime = '10:00 AM';
      spyOn(service, 'addAppointment');

      service.openDialog();
      expect(service.addAppointment).toHaveBeenCalled();
    });
  });

  describe('handleAppointment', () => {
    it('should update an appointment', () => {
      const updatedAppointment = {
        ...mockAppointment,
        title: 'Updated Title',
      };
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of(updatedAppointment),
      });

      service.handleAppointment(mockAppointment);
      expect(appointmentsService.updateEvent).toHaveBeenCalledWith(
        updatedAppointment,
      );
    });

    it('should remove an appointment', () => {
      spyOn(dialog, 'open').and.returnValue({
        afterClosed: () => of({ remove: true, uuid: mockAppointment.uuid }),
      });
      service.handleAppointment(mockAppointment);
      expect(appointmentsService.removeEvent).toHaveBeenCalledWith(
        mockAppointment.uuid,
      );
    });
  });

  describe('isSameDate', () => {
    it('should return true for dates with the same year, month, and day', () => {
      const d1 = new Date(2025, 0, 15);
      const d2 = new Date(2025, 0, 15);
      expect(service.isSameDate(d1, d2)).toBeTrue();
    });

    it('should return false for dates that differ', () => {
      const d1 = new Date(2025, 0, 15);
      const d2 = new Date(2025, 0, 16);
      expect(service.isSameDate(d1, d2)).toBeFalse();
    });
  });

  describe('getAppointmentLayout', () => {
    it('should correctly calculate the appointment layout', () => {
      const appointment: Appointment = {
        ...mockAppointment,
        start: '2025-02-18T08:30:00.000Z',
        end: '2025-02-18T10:00:00.000Z',
      };

      const layout = service.getAppointmentLayout(appointment);
      const localStart = new Date(appointment.start);
      const expectedStartSlotIndex = localStart.getHours();

      expect(layout.startSlotIndex).toBe(expectedStartSlotIndex);
      expect(layout.appointmentTop).toBe(25 + 'px');
      expect(layout.appointmentHeight).toBe(75 + 'px');
    });
  });
});
