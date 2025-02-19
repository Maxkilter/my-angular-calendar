import { Component, inject } from '@angular/core';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
} from '@angular/material/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { Appointment } from '../models/appointment.model';
import {
  MatTimepicker,
  MatTimepickerInput,
  MatTimepickerToggle,
} from '@angular/material/timepicker';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatTimepickerInput,
    MatTimepicker,
    MatTimepickerToggle,
  ],
})
export class ModalComponent {
  appointmentForm: FormGroup;

  dialogRef: MatDialogRef<ModalComponent>;
  data: Appointment;
  start: Date | string = '';
  end: Date | string = '';

  constructor(private formBuilder: FormBuilder) {
    const dialogRef = inject(MatDialogRef<ModalComponent>);
    const data = inject(MAT_DIALOG_DATA);

    this.appointmentForm = this.formBuilder.group({
      title: [data.title || '', Validators.required],

      duration: this.formBuilder.group(
        {
          startDate: [data.start || '', Validators.required],
          endDate: [data.end || '', Validators.required],
          startTime: [data.start || '', Validators.required],
          endTime: [data.end || '', Validators.required],
        },
        { validators: [this.durationValidator] },
      ),
      description: [data.description || ''],
    });

    this.dialogRef = dialogRef;
    this.data = data;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onSaveClick(): void {
    if (this.appointmentForm.valid) {
      const data = {
        title: this.appointmentForm.get('title')?.value,
        start: this.start,
        end: this.end,
        description: this.appointmentForm.get('description')?.value,
        uuid: this.data.uuid,
      };
      this.dialogRef.close(data);
    }
  }

  onDeleteClick(): void {
    this.dialogRef.close({ remove: true, uuid: this.data.uuid });
  }

  durationValidator: ValidatorFn = (
    control: AbstractControl,
  ): ValidationErrors | null => {
    const startDateValue = control?.get('startDate')?.value;
    const endDateValue = control?.get('endDate')?.value;
    const startTimeValue = control.get('startTime')?.value;
    const endTimeValue = control.get('endTime')?.value;

    if (startDateValue && endDateValue && startTimeValue && endTimeValue) {
      const startDateObj = new Date(startDateValue);
      const endDateObj = new Date(endDateValue);
      const startTimeObj = new Date(startTimeValue);
      const endTimeObj = new Date(endTimeValue);

      startDateObj.setHours(
        startTimeObj.getHours(),
        startTimeObj.getMinutes(),
        0,
        0,
      );
      endDateObj.setHours(endTimeObj.getHours(), endTimeObj.getMinutes(), 0, 0);

      this.start = startDateObj.toISOString();
      this.end = endDateObj.toISOString();

      if (startDateObj >= endDateObj) {
        return { durationInvalid: true };
      }
    }
    return null;
  };
}
