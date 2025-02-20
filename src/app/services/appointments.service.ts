import { Injectable, signal } from "@angular/core";
import { v4 as uuid4 } from "uuid";
import { DUMMY_APPOINTMENTS } from "../mocks/dummy-appointments";
import { Appointment } from "../models/appointment.model";

const APPOINTMENTS_STORAGE_KEY = "appointments";

const generateRandomColor = (): string => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = 0.4;
  return `rgba(${r},${g},${b},${a})`;
};

@Injectable({
  providedIn: "root",
})
export class AppointmentsService {
  private appointments = signal<Appointment[]>(DUMMY_APPOINTMENTS);

  events = this.appointments.asReadonly();

  constructor() {
    const storedEvents = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);

    if (storedEvents) {
      this.appointments.set(JSON.parse(storedEvents));
    }
  }

  addEvent({ start, end, title, description }: Omit<Appointment, "color">) {
    this.appointments.update((prevAppointments) => [
      ...prevAppointments,
      {
        uuid: uuid4(),
        title,
        start,
        end,
        description,
        color: generateRandomColor(),
      },
    ]);
    this.saveEvents();
  }

  removeEvent(uuid: Appointment["uuid"]) {
    this.appointments.update((prevAppointments) =>
      prevAppointments.filter((appointment) => appointment.uuid !== uuid),
    );
    this.saveEvents();
  }

  updateEvent({ start, end, title, uuid, description }: Appointment) {
    this.appointments.update((prevAppointments) =>
      prevAppointments.map((appointment) =>
        appointment.uuid === uuid
          ? {
              uuid,
              start,
              end,
              title,
              description,
              color: appointment.color,
            }
          : appointment,
      ),
    );
    this.saveEvents();
  }

  private saveEvents() {
    localStorage.setItem(
      APPOINTMENTS_STORAGE_KEY,
      JSON.stringify(this.appointments()),
    );
  }
}
