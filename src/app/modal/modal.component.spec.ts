import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormsModule, FormGroup } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { mockAppointment } from '../mocks/mock-appointment';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;
  let dialogRef: MatDialogRef<ModalComponent>;

  const fakeDialogRef = {
    close: jasmine.createSpy('close'),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ModalComponent,
        ReactiveFormsModule,
        FormsModule,
        MatNativeDateModule,
        NoopAnimationsModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockAppointment },
        { provide: MatDialogRef, useValue: fakeDialogRef },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    dialogRef = TestBed.inject(MatDialogRef);
    fixture.detectChanges();
  });

  afterEach(() => {
    fakeDialogRef.close.calls.reset();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form controls with injected mockAppointment data', () => {
    const form = component.appointmentForm;
    expect(form).toBeTruthy();
    expect(form.get('title')?.value).toBe(mockAppointment.title);
    expect(form.get('description')?.value).toBe(mockAppointment.description);

    const durationGroup = form.get('duration') as FormGroup;
    expect(durationGroup).toBeTruthy();
    expect(durationGroup.get('startDate')?.value).toBe(mockAppointment.start);
    expect(durationGroup.get('endDate')?.value).toBe(mockAppointment.end);
    expect(durationGroup.get('startTime')?.value).toBe(mockAppointment.start);
    expect(durationGroup.get('endTime')?.value).toBe(mockAppointment.end);
  });

  it('should close the dialog with form data when onSaveClick is called and the form is valid', () => {
    const updatedTitle = 'Updated Title';
    const updatedDescription = 'Updated description';
    const updatedStartDate = '2025-02-18T00:00:00.000Z';
    const updatedEndDate = '2025-02-18T00:00:00.000Z';
    const updatedStartTime = '2025-02-18T10:00:00.000Z';
    const updatedEndTime = '2025-02-18T11:00:00.000Z';

    component.appointmentForm.patchValue({
      title: updatedTitle,
      description: updatedDescription,
    });
    const durationGroup = component.appointmentForm.get(
      'duration',
    ) as FormGroup;
    durationGroup.patchValue({
      startDate: updatedStartDate,
      endDate: updatedEndDate,
      startTime: updatedStartTime,
      endTime: updatedEndTime,
    });

    component.appointmentForm.updateValueAndValidity();
    component.onSaveClick();

    const expectedStart = new Date(updatedStartDate);
    const startTimeObj = new Date(updatedStartTime);
    expectedStart.setHours(
      startTimeObj.getHours(),
      startTimeObj.getMinutes(),
      0,
      0,
    );

    const expectedEnd = new Date(updatedEndDate);
    const endTimeObj = new Date(updatedEndTime);
    expectedEnd.setHours(endTimeObj.getHours(), endTimeObj.getMinutes(), 0, 0);

    expect(dialogRef.close).toHaveBeenCalledWith({
      title: updatedTitle,
      start: expectedStart.toISOString(),
      end: expectedEnd.toISOString(),
      description: updatedDescription,
      uuid: mockAppointment.uuid,
    });
  });

  it('should not close the dialog when onSaveClick is called if the form is invalid', () => {
    component.appointmentForm.get('title')?.setValue('');
    component.onSaveClick();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close the dialog when onCancelClick is called', () => {
    component.onCancelClick();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should close the dialog with remove flag when onDeleteClick is called', () => {
    component.onDeleteClick();
    expect(dialogRef.close).toHaveBeenCalledWith({
      remove: true,
      uuid: mockAppointment.uuid,
    });
  });

  describe('durationValidator', () => {
    it('should not return an error if the start datetime is before the end datetime', () => {
      const durationGroup = component.appointmentForm.get(
        'duration',
      ) as FormGroup;
      durationGroup.patchValue({
        startDate: '2025-02-18T00:00:00.000Z',
        endDate: '2025-02-18T00:00:00.000Z',
        startTime: '2025-02-18T10:00:00.000Z',
        endTime: '2025-02-18T11:00:00.000Z',
      });
      durationGroup.updateValueAndValidity();

      expect(durationGroup.errors).toBeNull();
    });

    it('should return an error if the start datetime is not before the end datetime', () => {
      const durationGroup = component.appointmentForm.get(
        'duration',
      ) as FormGroup;
      durationGroup.patchValue({
        startDate: '2025-02-18T00:00:00.000Z',
        endDate: '2025-02-18T00:00:00.000Z',
        startTime: '2025-02-18T12:00:00.000Z',
        endTime: '2025-02-18T11:00:00.000Z',
      });
      durationGroup.updateValueAndValidity();

      expect(durationGroup.errors).toEqual({ durationInvalid: true });
    });
  });

  it('should render error message when duration is invalid', () => {
    const durationGroup = component.appointmentForm.get(
      'duration',
    ) as FormGroup;
    durationGroup.patchValue({
      startDate: '2025-02-18T00:00:00.000Z',
      endDate: '2025-02-18T00:00:00.000Z',
      startTime: '2025-02-18T12:00:00.000Z',
      endTime: '2025-02-18T11:00:00.000Z',
    });
    durationGroup.updateValueAndValidity();
    fixture.detectChanges();

    const errorEl = fixture.debugElement.query(By.css('mat-error'));

    expect(errorEl).toBeTruthy();
    expect(errorEl.nativeElement.textContent).toContain(
      'Please ensure the end time is after the start time.',
    );
  });
});
